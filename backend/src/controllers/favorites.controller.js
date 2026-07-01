const pool = require('../config/db');

/**
 * GET /favorites
 * Get all favorites
 */
const getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id, f.candidate_id, f.company_id, f.created_at,
              c.full_name, comp.name as company_name
       FROM favorites f
       JOIN candidates c ON f.candidate_id = c.id
       JOIN companies comp ON f.company_id = comp.id
       ORDER BY f.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites',
    });
  }
};

/**
 * GET /favorites/:id
 * Get favorite by ID
 */
const getFavoritesById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT f.id, f.candidate_id, f.company_id, f.created_at,
              c.full_name, comp.name as company_name
       FROM favorites f
       JOIN candidates c ON f.candidate_id = c.id
       JOIN companies comp ON f.company_id = comp.id
       WHERE f.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get favorite by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorite',
    });
  }
};

/**
 * POST /favorites
 * Create a favorite (add to favorites)
 */
const createFavorites = async (req, res) => {
  try {
    const { candidate_id, company_id } = req.body;

    if (!candidate_id || !company_id) {
      return res.status(400).json({
        success: false,
        error: 'Candidate ID and company ID are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO favorites (candidate_id, company_id)
       VALUES ($1, $2)
       RETURNING id, candidate_id, company_id, created_at`,
      [candidate_id, company_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create favorite error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'This company is already in favorites',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create favorite',
    });
  }
};

/**
 * DELETE /favorites/:id
 * Delete favorite (remove from favorites)
 */
const deleteFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM favorites WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found',
      });
    }

    res.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete favorite',
    });
  }
};

module.exports = {
  getFavorites,
  getFavoritesById,
  createFavorites,
  deleteFavorites,
};
