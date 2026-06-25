const pool = require("../config/db");

const getAllSalaries = async () => {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.company_id,
        c.name AS company_name,
        s.technology_id,
        t.name AS technology_name,
        s.role_name,
        s.amount,
        s.currency,
        s.experience_level,
        s.created_at
      FROM salaries s
      LEFT JOIN companies c ON s.company_id = c.id
      LEFT JOIN technologies t ON s.technology_id = t.id
      ORDER BY s.id;
    `);

    return result.rows;
};

const getSalaryById = async (id) => {
    const result = await pool.query(
        `
      SELECT 
        s.id,
        s.company_id,
        c.name AS company_name,
        s.technology_id,
        t.name AS technology_name,
        s.role_name,
        s.amount,
        s.currency,
        s.experience_level,
        s.created_at
      FROM salaries s
      LEFT JOIN companies c ON s.company_id = c.id
      LEFT JOIN technologies t ON s.technology_id = t.id
      WHERE s.id = $1;
      `,
        [id]
    );

    return result.rows[0];
};

const createSalary = async (
    company_id,
    technology_id,
    role_name,
    amount,
    currency,
    experience_level
) => {
    const result = await pool.query(
        `
      INSERT INTO salaries 
      (company_id, technology_id, role_name, amount, currency, experience_level)
      VALUES ($1, $2, $3, $4, COALESCE($5, 'EUR'), $6)
      RETURNING *;
      `,
        [company_id, technology_id, role_name, amount, currency, experience_level]
    );

    return result.rows[0];
};

const updateSalary = async (
    id,
    company_id,
    technology_id,
    role_name,
    amount,
    currency,
    experience_level
) => {
    const result = await pool.query(
        `
      UPDATE salaries
      SET
        company_id = COALESCE($1, company_id),
        technology_id = COALESCE($2, technology_id),
        role_name = COALESCE($3, role_name),
        amount = COALESCE($4, amount),
        currency = COALESCE($5, currency),
        experience_level = COALESCE($6, experience_level)
      WHERE id = $7
      RETURNING *;
      `,
        [company_id, technology_id, role_name, amount, currency, experience_level, id]
    );

    return result.rows[0];
};

const deleteSalary = async (id) => {
    const result = await pool.query(
        `
      DELETE FROM salaries
      WHERE id = $1
      RETURNING *;
      `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllSalaries,
    getSalaryById,
    createSalary,
    updateSalary,
    deleteSalary,
};