const pool = require("../config/db");

const getHeadhunters = async () => {
    const result = await pool.query(`
            SELECT *
            FROM headhunters
            ORDER BY full_name
        `);

    return result.rows;
};

const getHeadhunterById = async (id) => {
    const result = await pool.query(`
            SELECT *
            FROM headhunters
            WHERE id = $1
        `, [id]);

    return result.rows[0];
};

const createHeadhunter = async (query, values) => {
    const result = await pool.query(query, values);
    return result.rows[0];
};

const createHeadhuntersBulk = async (headhunterInserts) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const insertedHeadhunters = [];

        for (const insert of headhunterInserts) {
            const result = await client.query(
                insert.query,
                insert.values
            );

            insertedHeadhunters.push(
                result.rows[0]
            );
        }

        await client.query("COMMIT");

        return insertedHeadhunters;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};

const updateHeadhunter = async (query, values) => {
    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};

const deleteHeadhunter = async (id) => {
    const result = await pool.query(`
            DELETE FROM headhunters
            WHERE id = $1
            RETURNING *
        `, [id]);

    return result.rows[0];
};

module.exports = {
    getHeadhunters,
    getHeadhunterById,
    createHeadhunter,
    createHeadhuntersBulk,
    updateHeadhunter,
    deleteHeadhunter
};