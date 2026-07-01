const pool = require('../config/db');

/**
 * GET /reviews
 * Get all company reviews
 */
const getReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cr.id, cr.user_id, cr.company_id, cr.title, cr.overall_rating, cr.work_env_rating, 
              cr.growth_rating, cr.salary_rating, cr.interview_rating, cr.anonymous, cr.created_at,
              u.email, c.name as company_name
       FROM company_reviews cr
       JOIN users u ON cr.user_id = u.id
       JOIN companies c ON cr.company_id = c.id
       ORDER BY cr.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
    });
  }
};

/**
 * GET /reviews/:id
 * Get review by ID
 */
const getReviewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT cr.id, cr.user_id, cr.company_id, cr.title, cr.overall_rating, cr.work_env_rating, 
              cr.growth_rating, cr.salary_rating, cr.interview_rating, cr.anonymous, cr.created_at,
              u.email, c.name as company_name
       FROM company_reviews cr
       JOIN users u ON cr.user_id = u.id
       JOIN companies c ON cr.company_id = c.id
       WHERE cr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch review',
    });
  }
};

/**
 * POST /reviews
 * Create a new review
 */
const createReviews = async (req, res) => {
  try {
    const { user_id, company_id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous } = req.body;

    if (!user_id || !company_id || !overall_rating) {
      return res.status(400).json({
        success: false,
        error: 'User ID, company ID, and overall rating are required',
      });
    }

    if (overall_rating < 1 || overall_rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }

    const result = await pool.query(
      `INSERT INTO company_reviews (user_id, company_id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, user_id, company_id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous, created_at`,
      [user_id, company_id, title || null, overall_rating, work_env_rating || null, growth_rating || null, salary_rating || null, interview_rating || null, anonymous || false]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create review',
    });
  }
};

/**
 * PUT /reviews/:id
 * Update review
 */
const updateReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous } = req.body;

    const result = await pool.query(
      `UPDATE company_reviews
       SET title = COALESCE($2, title),
           overall_rating = COALESCE($3, overall_rating),
           work_env_rating = COALESCE($4, work_env_rating),
           growth_rating = COALESCE($5, growth_rating),
           salary_rating = COALESCE($6, salary_rating),
           interview_rating = COALESCE($7, interview_rating),
           anonymous = COALESCE($8, anonymous)
       WHERE id = $1
       RETURNING id, user_id, company_id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous, created_at`,
      [id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review',
    });
  }
};

/**
 * DELETE /reviews/:id
 * Delete review
 */
const deleteReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM company_reviews WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
    });
  }
};

module.exports = {
  getReviews,
  getReviewsById,
  createReviews,
  updateReviews,
  deleteReviews,
};
