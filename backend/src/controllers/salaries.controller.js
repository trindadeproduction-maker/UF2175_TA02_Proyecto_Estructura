const pool = require('../config/db');

/**
 * GET /salaries
 * Get all salaries
 */
const getSalaries = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.company_id, s.technology_id, s.role_name, s.amount, s.currency, s.experience_level, s.created_at,
              c.name as company_name, t.name as technology_name
       FROM salaries s
       LEFT JOIN companies c ON s.company_id = c.id
       LEFT JOIN technologies t ON s.technology_id = t.id
       ORDER BY s.amount DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get salaries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch salaries',
    });
  }
};

/**
 * GET /salaries/:id
 * Get salary by ID
 */
const getSalariesById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT s.id, s.company_id, s.technology_id, s.role_name, s.amount, s.currency, s.experience_level, s.created_at,
              c.name as company_name, t.name as technology_name
       FROM salaries s
       LEFT JOIN companies c ON s.company_id = c.id
       LEFT JOIN technologies t ON s.technology_id = t.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Salary not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get salary by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch salary',
    });
  }
};

/**
 * POST /salaries
 * Create a new salary record
 */
const createSalaries = async (req, res) => {
  try {
    const { company_id, technology_id, role_name, amount, currency, experience_level } = req.body;

    if (!role_name || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Role name and amount are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO salaries (company_id, technology_id, role_name, amount, currency, experience_level)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, company_id, technology_id, role_name, amount, currency, experience_level, created_at`,
      [company_id || null, technology_id || null, role_name, amount, currency || 'EUR', experience_level || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create salary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create salary',
    });
  }
};

/**
 * PUT /salaries/:id
 * Update salary
 */
const updateSalaries = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, amount, currency, experience_level } = req.body;

    const result = await pool.query(
      `UPDATE salaries
       SET role_name = COALESCE($2, role_name),
           amount = COALESCE($3, amount),
           currency = COALESCE($4, currency),
           experience_level = COALESCE($5, experience_level)
       WHERE id = $1
       RETURNING id, company_id, technology_id, role_name, amount, currency, experience_level, created_at`,
      [id, role_name, amount, currency, experience_level]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Salary not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update salary',
    });
  }
};

/**
 * DELETE /salaries/:id
 * Delete salary
 */
const deleteSalaries = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM salaries WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Salary not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete salary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete salary',
    });
  }
};

module.exports = {
  getSalaries,
  getSalariesById,
  createSalaries,
  updateSalaries,
  deleteSalaries,
};
