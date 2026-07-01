const pool = require('../config/db');

/**
 * GET /candidates
 * Get all candidates
 */
const getCandidates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.user_id, c.full_name, c.bio, c.location, c.experience_years, c.preferred_modality, c.created_at,
              u.email, u.role
       FROM candidates c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidates',
    });
  }
};

/**
 * GET /candidates/:id
 * Get candidate by ID
 */
const getCandidatesById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.id, c.user_id, c.full_name, c.bio, c.location, c.experience_years, c.preferred_modality, c.created_at,
              u.email, u.role
       FROM candidates c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get candidate by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidate',
    });
  }
};

/**
 * POST /candidates
 * Create a new candidate
 */
const createCandidates = async (req, res) => {
  try {
    const { user_id, full_name, bio, location, experience_years, preferred_modality } = req.body;

    if (!user_id || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'User ID and full name are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO candidates (user_id, full_name, bio, location, experience_years, preferred_modality)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, full_name, bio, location, experience_years, preferred_modality, created_at`,
      [user_id, full_name, bio || null, location || null, experience_years || 0, preferred_modality || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create candidate',
    });
  }
};

/**
 * PUT /candidates/:id
 * Update candidate
 */
const updateCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, bio, location, experience_years, preferred_modality } = req.body;

    const result = await pool.query(
      `UPDATE candidates
       SET full_name = COALESCE($2, full_name),
           bio = COALESCE($3, bio),
           location = COALESCE($4, location),
           experience_years = COALESCE($5, experience_years),
           preferred_modality = COALESCE($6, preferred_modality)
       WHERE id = $1
       RETURNING id, user_id, full_name, bio, location, experience_years, preferred_modality, created_at`,
      [id, full_name, bio, location, experience_years, preferred_modality]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update candidate',
    });
  }
};

/**
 * DELETE /candidates/:id
 * Delete candidate
 */
const deleteCandidates = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM candidates WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete candidate',
    });
  }
};

module.exports = {
  getCandidates,
  getCandidatesById,
  createCandidates,
  updateCandidates,
  deleteCandidates,
};
