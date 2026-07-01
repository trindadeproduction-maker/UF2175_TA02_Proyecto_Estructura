const pool = require('../config/db');

/**
 * GET /headhunters
 * Get all headhunters
 */
const getHeadhunters = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT h.id, h.user_id, h.full_name, h.agency, h.bio, h.created_at,
              u.email, u.role
       FROM headhunters h
       JOIN users u ON h.user_id = u.id
       ORDER BY h.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get headhunters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch headhunters',
    });
  }
};

/**
 * GET /headhunters/:id
 * Get headhunter by ID
 */
const getHeadhuntersById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT h.id, h.user_id, h.full_name, h.agency, h.bio, h.created_at,
              u.email, u.role
       FROM headhunters h
       JOIN users u ON h.user_id = u.id
       WHERE h.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Headhunter not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get headhunter by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch headhunter',
    });
  }
};

/**
 * POST /headhunters
 * Create a new headhunter
 */
const createHeadhunters = async (req, res) => {
  try {
    const { user_id, full_name, agency, bio } = req.body;

    if (!user_id || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'User ID and full name are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO headhunters (user_id, full_name, agency, bio)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, full_name, agency, bio, created_at`,
      [user_id, full_name, agency || null, bio || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create headhunter error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create headhunter',
    });
  }
};

/**
 * PUT /headhunters/:id
 * Update headhunter
 */
const updateHeadhunters = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, agency, bio } = req.body;

    const result = await pool.query(
      `UPDATE headhunters
       SET full_name = COALESCE($2, full_name),
           agency = COALESCE($3, agency),
           bio = COALESCE($4, bio)
       WHERE id = $1
       RETURNING id, user_id, full_name, agency, bio, created_at`,
      [id, full_name, agency, bio]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Headhunter not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update headhunter error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update headhunter',
    });
  }
};

/**
 * DELETE /headhunters/:id
 * Delete headhunter
 */
const deleteHeadhunters = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM headhunters WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Headhunter not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete headhunter error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete headhunter',
    });
  }
};

module.exports = {
  getHeadhunters,
  getHeadhuntersById,
  createHeadhunters,
  updateHeadhunters,
  deleteHeadhunters,
};
