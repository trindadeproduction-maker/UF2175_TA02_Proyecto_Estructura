const pool = require('../config/db');

/**
 * GET /offerTechnologies
 * Get all offer-technology relationships
 */
const getOfferTechnologies = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ot.offer_id, ot.technology_id, t.name as technology_name, jo.title as offer_title
       FROM offer_technologies ot
       JOIN technologies t ON ot.technology_id = t.id
       JOIN job_offers jo ON ot.offer_id = jo.id
       ORDER BY ot.offer_id`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get offer technologies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offer technologies',
    });
  }
};

/**
 * GET /offerTechnologies/:offerId
 * Get technologies for a specific offer
 */
const getOfferTechnologiesByOfferId = async (req, res) => {
  try {
    const { offerId } = req.params;

    const result = await pool.query(
      `SELECT ot.offer_id, ot.technology_id, t.name as technology_name, t.category
       FROM offer_technologies ot
       JOIN technologies t ON ot.technology_id = t.id
       WHERE ot.offer_id = $1
       ORDER BY t.name`,
      [offerId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get offer technologies by offer ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offer technologies',
    });
  }
};

/**
 * POST /offerTechnologies
 * Add technology to offer
 */
const createOfferTechnologies = async (req, res) => {
  try {
    const { offer_id, technology_id } = req.body;

    if (!offer_id || !technology_id) {
      return res.status(400).json({
        success: false,
        error: 'Offer ID and technology ID are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO offer_technologies (offer_id, technology_id)
       VALUES ($1, $2)
       RETURNING offer_id, technology_id`,
      [offer_id, technology_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create offer technology error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Technology already added to this offer',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to add technology to offer',
    });
  }
};

/**
 * DELETE /offerTechnologies/:offerId/:technologyId
 * Remove technology from offer
 */
const deleteOfferTechnologies = async (req, res) => {
  try {
    const { offerId, technologyId } = req.params;

    const result = await pool.query(
      'DELETE FROM offer_technologies WHERE offer_id = $1 AND technology_id = $2 RETURNING offer_id, technology_id',
      [offerId, technologyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Offer-technology relationship not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Delete offer technology error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove technology from offer',
    });
  }
};

module.exports = {
  getOfferTechnologies,
  getOfferTechnologiesByOfferId,
  createOfferTechnologies,
  deleteOfferTechnologies,
};
