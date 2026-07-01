const pool = require('../config/db');

/**
 * GET /joboffers
 * Get all job offers
 */
const getJobOffers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT jo.id, jo.company_id, jo.headhunter_id, jo.title, jo.description, jo.modality, jo.income, 
              jo.location, jo.contract_type, jo.status, jo.created_at, jo.updated_at,
              c.name as company_name, h.full_name as headhunter_name
       FROM job_offers jo
       LEFT JOIN companies c ON jo.company_id = c.id
       LEFT JOIN headhunters h ON jo.headhunter_id = h.id
       ORDER BY jo.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get job offers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job offers',
    });
  }
};

/**
 * GET /joboffers/:id
 * Get job offer by ID
 */
const getJobOffersById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT jo.id, jo.company_id, jo.headhunter_id, jo.title, jo.description, jo.modality, jo.income, 
              jo.location, jo.contract_type, jo.status, jo.created_at, jo.updated_at,
              c.name as company_name, h.full_name as headhunter_name
       FROM job_offers jo
       LEFT JOIN companies c ON jo.company_id = c.id
       LEFT JOIN headhunters h ON jo.headhunter_id = h.id
       WHERE jo.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Job offer not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get job offer by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job offer',
    });
  }
};

/**
 * POST /joboffers
 * Create a new job offer
 */
const createJobOffers = async (req, res) => {
  try {
    const { company_id, headhunter_id, title, description, modality, income, location, contract_type, status } = req.body;

    if (!title || (!company_id && !headhunter_id)) {
      return res.status(400).json({
        success: false,
        error: 'Title and either company_id or headhunter_id are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO job_offers (company_id, headhunter_id, title, description, modality, income, location, contract_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, company_id, headhunter_id, title, description, modality, income, location, contract_type, status, created_at, updated_at`,
      [company_id || null, headhunter_id || null, title, description || null, modality || null, income || null, location || null, contract_type || 'full-time', status || 'active']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create job offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create job offer',
    });
  }
};

/**
 * PUT /joboffers/:id
 * Update job offer
 */
const updateJobOffers = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, modality, income, location, contract_type, status } = req.body;

    const result = await pool.query(
      `UPDATE job_offers
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           modality = COALESCE($4, modality),
           income = COALESCE($5, income),
           location = COALESCE($6, location),
           contract_type = COALESCE($7, contract_type),
           status = COALESCE($8, status),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, company_id, headhunter_id, title, description, modality, income, location, contract_type, status, created_at, updated_at`,
      [id, title, description, modality, income, location, contract_type, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Job offer not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update job offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update job offer',
    });
  }
};

/**
 * DELETE /joboffers/:id
 * Delete job offer
 */
const deleteJobOffers = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM job_offers WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Job offer not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete job offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete job offer',
    });
  }
};

module.exports = {
  getJobOffers,
  getJobOffersById,
  createJobOffers,
  updateJobOffers,
  deleteJobOffers,
};
