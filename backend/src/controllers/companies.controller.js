const pool = require('../config/db');

/**
 * GET /companies
 * Get all companies
 */
const getCompanies = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.user_id, c.name, c.description, c.industry, c.size, c.location, c.website, c.created_at,
              u.email, u.role
       FROM companies c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch companies',
    });
  }
};

/**
 * GET /companies/:id
 * Get company by ID
 */
const getCompaniesById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.id, c.user_id, c.name, c.description, c.industry, c.size, c.location, c.website, c.created_at,
              u.email, u.role
       FROM companies c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get company by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company',
    });
  }
};

/**
 * POST /companies
 * Create a new company
 */
const createCompanies = async (req, res) => {
  try {
    const { user_id, name, description, industry, size, location, website } = req.body;

    if (!user_id || !name) {
      return res.status(400).json({
        success: false,
        error: 'User ID and company name are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO companies (user_id, name, description, industry, size, location, website)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, name, description, industry, size, location, website, created_at`,
      [user_id, name, description || null, industry || null, size || null, location || null, website || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create company',
    });
  }
};

/**
 * PUT /companies/:id
 * Update company
 */
const updateCompanies = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, industry, size, location, website } = req.body;

    const result = await pool.query(
      `UPDATE companies
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           industry = COALESCE($4, industry),
           size = COALESCE($5, size),
           location = COALESCE($6, location),
           website = COALESCE($7, website)
       WHERE id = $1
       RETURNING id, user_id, name, description, industry, size, location, website, created_at`,
      [id, name, description, industry, size, location, website]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company',
    });
  }
};

/**
 * DELETE /companies/:id
 * Delete company
 */
const deleteCompanies = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM companies WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete company',
    });
  }
};

module.exports = {
  getCompanies,
  getCompaniesById,
  createCompanies,
  updateCompanies,
  deleteCompanies,
};
