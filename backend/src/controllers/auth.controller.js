const pool = require('../config/db');
const { generateToken, hashPassword, comparePassword } = require('../config/auth');

/**
 * POST /auth/login
 * Login user and return JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    // Compare password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
};

/**
 * POST /auth/register-candidate
 * Register a new candidate
 */
const registerCandidate = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, full_name, bio, location, experience_years, preferred_modality } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required',
      });
    }

    await client.query('BEGIN');

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, 'candidate']
    );

    const userId = userResult.rows[0].id;

    // Create candidate profile
    const candidateResult = await client.query(
      'INSERT INTO candidates (user_id, full_name, bio, location, experience_years, preferred_modality) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, full_name, bio || null, location || null, experience_years || 0, preferred_modality || null]
    );

    await client.query('COMMIT');

    // Generate token
    const token = generateToken(userId, 'candidate');

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: userId,
          email,
          role: 'candidate',
          candidateId: candidateResult.rows[0].id,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Register candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  } finally {
    client.release();
  }
};

/**
 * POST /auth/register-company
 * Register a new company
 */
const registerCompany = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, company_name, description, industry, size, location, website } = req.body;

    if (!email || !password || !company_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and company name are required',
      });
    }

    await client.query('BEGIN');

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, 'company']
    );

    const userId = userResult.rows[0].id;

    // Create company profile
    const companyResult = await client.query(
      'INSERT INTO companies (user_id, name, description, industry, size, location, website) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [userId, company_name, description || null, industry || null, size || null, location || null, website || null]
    );

    await client.query('COMMIT');

    // Generate token
    const token = generateToken(userId, 'company');

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: userId,
          email,
          role: 'company',
          companyId: companyResult.rows[0].id,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Register company error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  } finally {
    client.release();
  }
};

module.exports = {
  login,
  registerCandidate,
  registerCompany,
};
