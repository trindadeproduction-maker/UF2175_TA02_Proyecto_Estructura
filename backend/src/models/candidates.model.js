const pool = require("../config/db");

const getCandidates = async () => {
    const result = await pool.query(`
            SELECT *
            FROM candidates
            ORDER BY id
        `);

    return result.rows;
};

const createCandidate = async (query, values) => {
    const result = await pool.query(query, values);
    return result.rows[0];
};

const createCandidatesBulk = async (candidatesInserts) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const insertedCandidates = [];

        for (const insert of candidatesInserts) {
            const result = await client.query(insert.query, insert.values);
            insertedCandidates.push(result.rows[0]);
        }

        await client.query("COMMIT");
        return insertedCandidates;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getCandidateById = async (id) => {
    const result = await pool.query(`
            SELECT *
            FROM candidates
            WHERE id = $1
        `, [id]);

    return result.rows[0];
};

const updateCandidate = async (query, values) => {
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteCandidate = async (id) => {
    const result = await pool.query(`
            DELETE FROM candidates
            WHERE id = $1
            RETURNING *
        `, [id]);

    return result.rows[0];
};

module.exports = {
    getCandidates,
    createCandidate,
    createCandidatesBulk,
    getCandidateById,
    updateCandidate,
    deleteCandidate
};