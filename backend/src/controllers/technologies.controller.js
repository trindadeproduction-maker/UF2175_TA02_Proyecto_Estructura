const pool = require('../config/db');

/**
 * GET /technologies
 * Get all technologies
 */
const getTechnologies = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, category FROM technologies ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get technologies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch technologies',
    });
  }
};

/**
 * GET /technologies/:id
 * Get technology by ID
 */
const getTechnologiesById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, category FROM technologies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get technology by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch technology',
    });
  }
};

/**
 * POST /technologies
 * Create a new technology
 */
const createTechnologies = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Technology name is required',
      });
    }

    const result = await pool.query(
      'INSERT INTO technologies (name, category) VALUES ($1, $2) RETURNING id, name, category',
      [name, category || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create technology error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Technology name already exists',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create technology',
    });
  }
};

/**
 * DELETE /technologies/:id
 * Delete technology
 */
const deleteTechnologies = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM technologies WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete technology error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete technology',
    });
  }
};

module.exports = {
  getTechnologies,
  getTechnologiesById,
  createTechnologies,
  deleteTechnologies,
};
