const pool = require('../config/db');

/**
 * GET /applications
 * Get all applications
 */
const getApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.candidate_id, a.offer_id, a.status, a.cover_letter, a.applied_at, a.updated_at,
              c.full_name, jo.title as offer_title
       FROM applications a
       JOIN candidates c ON a.candidate_id = c.id
       JOIN job_offers jo ON a.offer_id = jo.id
       ORDER BY a.applied_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications',
    });
  }
};

/**
 * GET /applications/:id
 * Get application by ID
 */
const getApplicationsById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT a.id, a.candidate_id, a.offer_id, a.status, a.cover_letter, a.applied_at, a.updated_at,
              c.full_name, jo.title as offer_title
       FROM applications a
       JOIN candidates c ON a.candidate_id = c.id
       JOIN job_offers jo ON a.offer_id = jo.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application',
    });
  }
};

/**
 * POST /applications
 * Create a new application
 */
const createApplications = async (req, res) => {
  try {
    const { candidate_id, offer_id, status, cover_letter } = req.body;

    if (!candidate_id || !offer_id) {
      return res.status(400).json({
        success: false,
        error: 'Candidate ID and offer ID are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO applications (candidate_id, offer_id, status, cover_letter)
       VALUES ($1, $2, $3, $4)
       RETURNING id, candidate_id, offer_id, status, cover_letter, applied_at, updated_at`,
      [candidate_id, offer_id, status || 'applied', cover_letter || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create application error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Candidate has already applied to this offer',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create application',
    });
  }
};

/**
 * PUT /applications/:id
 * Update application status
 */
const updateApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const result = await pool.query(
      `UPDATE applications
       SET status = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, candidate_id, offer_id, status, cover_letter, applied_at, updated_at`,
      [id, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application',
    });
  }
};

/**
 * DELETE /applications/:id
 * Delete application
 */
const deleteApplications = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete application',
    });
  }
};

module.exports = {
  getApplications,
  getApplicationsById,
  createApplications,
  updateApplications,
  deleteApplications,
};
