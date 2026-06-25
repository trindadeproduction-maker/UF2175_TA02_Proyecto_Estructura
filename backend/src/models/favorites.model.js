const pool = require("../config/db");

const getCandidateFavorites = async (id) => {
    const result = await pool.query(
        `
      SELECT 
        f.id AS favorite_id,
        f.candidate_id,
        c.full_name AS candidate_name,
        f.company_id,
        co.name AS company_name,
        co.industry,
        co.size,
        co.location,
        co.website,
        f.created_at
      FROM favorites f
      JOIN candidates c ON f.candidate_id = c.id
      JOIN companies co ON f.company_id = co.id
      WHERE f.candidate_id = $1
      ORDER BY f.created_at DESC;
      `,
        [id]
    );

    return result.rows;
};

const addFavorite = async (id, companyId) => {
    const result = await pool.query(
        `
      INSERT INTO favorites (candidate_id, company_id)
      VALUES ($1, $2)
      RETURNING *;
      `,
        [id, companyId]
    );

    return result.rows[0];
};

const removeFavorite = async (id, companyId) => {
    const result = await pool.query(
        `
      DELETE FROM favorites
      WHERE candidate_id = $1
        AND company_id = $2
      RETURNING *;
      `,
        [id, companyId]
    );

    return result.rows[0];
};

module.exports = {
    getCandidateFavorites,
    addFavorite,
    removeFavorite,
};