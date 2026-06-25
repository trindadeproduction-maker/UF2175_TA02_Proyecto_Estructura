const pool = require("../config/db");

/* =========================================================
   GET ALL JOB OFFERS (light payload)
========================================================= */

const getJobOffers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                jo.*,
                c.name AS company_name,
                h.full_name AS headhunter_name
            FROM job_offers jo
            LEFT JOIN companies c ON c.id = jo.company_id
            LEFT JOIN headhunters h ON h.id = jo.headhunter_id
            ORDER BY jo.created_at DESC
        `);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   GET JOB OFFER BY ID (rich payload incl. technologies)
========================================================= */

const getJobOfferById = async (req, res) => {
    try {
        const { id } = req.params;

        const offerResult = await pool.query(`
            SELECT 
                jo.*,
                c.name AS company_name,
                h.full_name AS headhunter_name
            FROM job_offers jo
            LEFT JOIN companies c ON c.id = jo.company_id
            LEFT JOIN headhunters h ON h.id = jo.headhunter_id
            WHERE jo.offer_id = $1
        `, [id]);

        if (offerResult.rows.length === 0) {
            return res.status(404).json({ error: "Job offer not found" });
        }

        const offer = offerResult.rows[0];

        const techResult = await pool.query(`
            SELECT t.id, t.name
            FROM technologies t
            INNER JOIN offer_technologies ot ON ot.technology_id = t.id
            WHERE ot.offer_id = $1
        `, [id]);

        offer.technologies = techResult.rows.map(t => t.name);

        return res.json(offer);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   INSERT BUILDER
========================================================= */

const buildJobOfferInsert = (jobOffer) => {

    const STATUS_ENUM = ["active", "paused", "closed"];
    const CONTRACT_TYPES = ["full_time", "part_time", "contract", "internship"];

    const {
        company_id,
        headhunter_id,
        title,
        description,
        location,
        income,
        status,
        contract_type
    } = jobOffer;

    if (!Number.isInteger(company_id)) {
        return { error: "company_id must be integer" };
    }

    if (!Number.isInteger(headhunter_id)) {
        return { error: "headhunter_id must be integer" };
    }

    if (!title || title.length > 200) {
        return { error: "title is required (max 200 chars)" };
    }

    if (!description) {
        return { error: "description is required" };
    }

    if (!location || location.length > 150) {
        return { error: "location is required (max 150 chars)" };
    }

    

    if (!income && typeof income !== "number") {
        return { error: "salary_max must be number" };
    }

    if (!status || !STATUS_ENUM.includes(status)) {
        return { error: "invalid status" };
    }

    if (!contract_type || !CONTRACT_TYPES.includes(contract_type)) {
        return { error: "invalid contract_type" };
    }

    const columns = [
        "company_id",
        "headhunter_id",
        "title",
        "description",
        "location",
        "income",
        "status",
        "contract_type"
    ];

    const values = [
        company_id,
        headhunter_id,
        title,
        description,
        location,
        income ?? null,
        status,
        contract_type
    ];

    const params = values.map((_, i) => `$${i + 1}`);

    return {
        query: `
            INSERT INTO job_offers (${columns.join(", ")})
            VALUES (${params.join(", ")})
            RETURNING *
        `,
        values
    };
};


/* =========================================================
   CREATE (supports bulk insert)
========================================================= */

const createJobOffer = async (req, res) => {
    try {
        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({ error: "Body cannot be empty" });
        }

        // single insert
        if (!Array.isArray(req.body)) {
            const insert = buildJobOfferInsert(req.body);

            if (insert.error) {
                return res.status(400).json({ error: insert.error });
            }

            const result = await pool.query(insert.query, insert.values);
            return res.status(201).json(result.rows[0]);
        }

        // bulk insert
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const inserted = [];

            for (const jobOffer of req.body) {
                const insert = buildJobOfferInsert(jobOffer);

                if (insert.error) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({ error: insert.error });
                }

                const result = await client.query(insert.query, insert.values);
                inserted.push(result.rows[0]);
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
   UPDATE BUILDER (DYNAMIC PARTIAL UPDATE)
========================================================= */

const buildJobOfferUpdate = (id, jobOffer) => {

    if (!Number.isInteger(Number(id))) {
        return { error: "id must be integer" };
    }

    const allowedFields = [
        "company_id",
        "headhunter_id",
        "title",
        "description",
        "location",
        "income",
        "status",
        "contract_type"
    ];

    const keys = Object.keys(jobOffer).filter(k => allowedFields.includes(k));

    if (keys.length === 0) {
        return { error: "No valid fields provided" };
    }

    const STATUS_ENUM = ["active", "paused", "closed"];
    const CONTRACT_TYPES = ["full_time", "part_time", "contract", "internship"];

    const values = [];
    const setClauses = [];

    for (const key of keys) {
        const value = jobOffer[key];

        if (key === "company_id" && !Number.isInteger(value))
            return { error: "company_id must be integer" };
        if (key === "headhunter_id" && !Number.isInteger(value))
            return { error: "headhunter_id must be integer" };
        if (key === "status" && !STATUS_ENUM.includes(value))
            return { error: "invalid status" };
        if (key === "contract_type" && !CONTRACT_TYPES.includes(value))
            return { error: "invalid contract_type" };

        values.push(value);
        setClauses.push(`${key} = $${values.length}`);
    }

    if (setClauses.length === 0) {
        return { error: "Invalid update payload" };
    }

    values.push(id);

    return {
        query: `
            UPDATE job_offers
            SET ${setClauses.join(", ")},
                updated_at = NOW()
            WHERE id = $${values.length}
            RETURNING *
        `,
        values
    };
};


/* =========================================================
   UPDATE
========================================================= */

const updateJobOffer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Body cannot be empty" });
        }

        const update = buildJobOfferUpdate(id, req.body);

        if (update.error) {
            return res.status(400).json({ error: update.error });
        }

        const result = await pool.query(update.query, update.values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Job offer not found" });
        }

        return res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


/* =========================================================
   DELETE
========================================================= */

const deleteJobOffer = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            DELETE FROM job_offers
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Job offer not found" });
        }

        return res.json(result.rows[0]);

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
    getJobOffers,
    getJobOfferById,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer
};