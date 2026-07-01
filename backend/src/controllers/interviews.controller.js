const pool = require('../config/db');

/**
 * GET /interviews
 * Get all interviews
 */
const getInterviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.id, i.application_id, i.scheduled_at, i.type, i.notes, i.status, i.created_at,
              a.candidate_id, c.full_name, jo.title as offer_title
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN candidates c ON a.candidate_id = c.id
       JOIN job_offers jo ON a.offer_id = jo.id
       ORDER BY i.scheduled_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interviews',
    });
  }
};

/**
 * GET /interviews/:id
 * Get interview by ID
 */
const getInterviewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT i.id, i.application_id, i.scheduled_at, i.type, i.notes, i.status, i.created_at,
              a.candidate_id, c.full_name, jo.title as offer_title
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN candidates c ON a.candidate_id = c.id
       JOIN job_offers jo ON a.offer_id = jo.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get interview by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interview',
    });
  }
};

/**
 * POST /interviews
 * Schedule a new interview
 */
const createInterviews = async (req, res) => {
  try {
    const { application_id, scheduled_at, type, notes, status } = req.body;

    if (!application_id) {
      return res.status(400).json({
        success: false,
        error: 'Application ID is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO interviews (application_id, scheduled_at, type, notes, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, application_id, scheduled_at, type, notes, status, created_at`,
      [application_id, scheduled_at || null, type || null, notes || null, status || 'scheduled']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create interview',
    });
  }
};

/**
 * PUT /interviews/:id
 * Update interview
 */
const updateInterviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduled_at, type, notes, status } = req.body;

    const result = await pool.query(
      `UPDATE interviews
       SET scheduled_at = COALESCE($2, scheduled_at),
           type = COALESCE($3, type),
           notes = COALESCE($4, notes),
           status = COALESCE($5, status)
       WHERE id = $1
       RETURNING id, application_id, scheduled_at, type, notes, status, created_at`,
      [id, scheduled_at, type, notes, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update interview',
    });
  }
};

/**
 * DELETE /interviews/:id
 * Delete interview
 */
const deleteInterviews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM interviews WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete interview',
    });
  }
};

module.exports = {
  getInterviews,
  getInterviewsById,
  createInterviews,
  updateInterviews,
  deleteInterviews,
};
