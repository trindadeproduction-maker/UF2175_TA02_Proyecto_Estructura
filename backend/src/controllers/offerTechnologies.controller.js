const pool = require("../config/db");


/* =========================================================
   GET ALL RELATIONS
========================================================= */

const getOfferTechnologies = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ot.offer_id,
                ot.technology_id,
                t.name AS technology_name
            FROM offer_technologies ot
            LEFT JOIN technologies t
                ON t.id = ot.technology_id
            ORDER BY ot.offer_id
        `);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   GET BY OFFER ID
========================================================= */

const getTechnologiesByOfferId = async (req, res) => {
    try {
        const { offerId } = req.params;

        const result = await pool.query(`
            SELECT 
                t.id,
                t.name
            FROM offer_technologies ot
            INNER JOIN technologies t
                ON t.id = ot.technology_id
            WHERE ot.offer_id = $1
        `, [offerId]);

        return res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   BULK INSERT RELATIONS
========================================================= */

const addTechnologiesToOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const { technologyIds } = req.body;

        if (!Number.isInteger(Number(offerId))) {
            return res.status(400).json({ error: "offerId must be integer" });
        }

        if (!Array.isArray(technologyIds) || technologyIds.length === 0) {
            return res.status(400).json({ error: "technologyIds must be non-empty array" });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const inserted = [];

            for (const techId of technologyIds) {

                if (!Number.isInteger(techId)) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({
                        error: "technologyIds must contain only integers"
                    });
                }

                const result = await client.query(`
                    INSERT INTO offer_technologies (offer_id, technology_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                    RETURNING *
                `, [offerId, techId]);

                if (result.rows[0]) {
                    inserted.push(result.rows[0]);
                }
            }

            await client.query("COMMIT");

            return res.status(201).json(inserted);

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   DELETE SINGLE RELATION (composite key)
========================================================= */

const deleteOfferTechnology = async (req, res) => {
    try {
        const { offerId, technologyId } = req.params;

        if (!Number.isInteger(Number(offerId)) || !Number.isInteger(Number(technologyId))) {
            return res.status(400).json({
                error: "offerId and technologyId must be integers"
            });
        }

        const result = await pool.query(`
            DELETE FROM offer_technologies
            WHERE offer_id = $1
              AND technology_id = $2
            RETURNING *
        `, [offerId, technologyId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Relation not found"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   DELETE ALL TECHNOLOGIES FOR AN OFFER
========================================================= */

const deleteTechnologiesByOfferId = async (req, res) => {
    try {
        const { offerId } = req.params;

        const result = await pool.query(`
            DELETE FROM offer_technologies
            WHERE offer_id = $1
            RETURNING *
        `, [offerId]);

        return res.json({
            deleted: result.rowCount
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getOfferTechnologies,
    getTechnologiesByOfferId,
    addTechnologiesToOffer,
    deleteOfferTechnology,
    deleteTechnologiesByOfferId
};