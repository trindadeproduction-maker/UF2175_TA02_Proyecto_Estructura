const pool = require("../config/db");

const getAllApplications = async () => {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.candidate_id,
        c.full_name AS candidate_name,
        a.offer_id,
        jo.title AS job_title,
        a.status,
        a.cover_letter,
        a.applied_at,
        a.updated_at
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN job_offers jo ON a.offer_id = jo.id
      ORDER BY a.id;
    `);

    return result.rows;
};

const getApplicationById = async (id) => {
    const result = await pool.query(
        `
      SELECT 
        a.id,
        a.candidate_id,
        c.full_name AS candidate_name,
        a.offer_id,
        jo.title AS job_title,
        a.status,
        a.cover_letter,
        a.applied_at,
        a.updated_at
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN job_offers jo ON a.offer_id = jo.id
      WHERE a.id = $1;
      `,
        [id]
    );

    return result.rows[0];
};

const createApplication = async (candidate_id, offer_id, status, cover_letter) => {
    const result = await pool.query(
        `
      INSERT INTO applications 
      (candidate_id, offer_id, status, cover_letter)
      VALUES ($1, $2, COALESCE($3, 'applied'), $4)
      RETURNING *;
      `,
        [candidate_id, offer_id, status, cover_letter]
    );

    return result.rows[0];
};

const updateApplication = async (id, status, cover_letter) => {
    const result = await pool.query(
        `
      UPDATE applications
      SET 
        status = COALESCE($1, status),
        cover_letter = COALESCE($2, cover_letter),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *;
      `,
        [status, cover_letter, id]
    );

    return result.rows[0];
};

const deleteApplication = async (id) => {
    const result = await pool.query(
        `
      DELETE FROM applications
      WHERE id = $1
      RETURNING *;
      `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
};