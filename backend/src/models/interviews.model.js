const pool = require("../config/db");

const getAllInterviews = async () => {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.application_id,
        c.full_name AS candidate_name,
        jo.title AS job_title,
        i.scheduled_at,
        i.type,
        i.notes,
        i.status,
        i.created_at
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidates c ON a.candidate_id = c.id
      JOIN job_offers jo ON a.offer_id = jo.id
      ORDER BY i.id;
    `);

    return result.rows;
};

const getInterviewById = async (id) => {
    const result = await pool.query(
        `
      SELECT 
        i.id,
        i.application_id,
        c.full_name AS candidate_name,
        jo.title AS job_title,
        i.scheduled_at,
        i.type,
        i.notes,
        i.status,
        i.created_at
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidates c ON a.candidate_id = c.id
      JOIN job_offers jo ON a.offer_id = jo.id
      WHERE i.id = $1;
      `,
        [id]
    );

    return result.rows[0];
};

const createInterview = async (application_id, scheduled_at, type, notes, status) => {
    const result = await pool.query(
        `
      INSERT INTO interviews 
      (application_id, scheduled_at, type, notes, status)
      VALUES ($1, $2, $3, $4, COALESCE($5, 'scheduled'))
      RETURNING *;
      `,
        [application_id, scheduled_at, type, notes, status]
    );

    return result.rows[0];
};

const updateInterview = async (id, scheduled_at, type, notes, status) => {
    const result = await pool.query(
        `
      UPDATE interviews
      SET
        scheduled_at = COALESCE($1, scheduled_at),
        type = COALESCE($2, type),
        notes = COALESCE($3, notes),
        status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *;
      `,
        [scheduled_at, type, notes, status, id]
    );

    return result.rows[0];
};

const deleteInterview = async (id) => {
    const result = await pool.query(
        `
      DELETE FROM interviews
      WHERE id = $1
      RETURNING *;
      `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllInterviews,
    getInterviewById,
    createInterview,
    updateInterview,
    deleteInterview,
};