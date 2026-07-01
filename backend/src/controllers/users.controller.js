const pool = require('../config/db');

/**
 * GET /users
 * Get all users (admin only)
 */
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};

/**
 * GET /users/:id
 * Get user by ID
 */
const getUsersByid = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
};

/**
 * POST /users
 * Create a new user (admin only)
 */
const createUsers = async (req, res) => {
  try {
    const { email, password_hash, role } = req.body;

    if (!email || !password_hash || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password hash, and role are required',
      });
    }

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, password_hash, role]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
};

module.exports = {
  getUsers,
  getUsersByid,
  createUsers,
};
