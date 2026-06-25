const headhuntersModel = require("../models/headhunters.model");

const getHeadhunters = async (req, res) => {
    try {

        const headhunters = await headhuntersModel.getHeadhunters();

        res.json(headhunters);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const getHeadhunterById = async (req, res) => {
    try {

        const { id } = req.params;

        const headhunter = await headhuntersModel.getHeadhunterById(id);

        if (!headhunter) {
            return res.status(404).json({
                error: "Headhunter no encontrado"
            });
        }

        res.json(headhunter);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const buildHeadhunterInsert = (headhunter) => {

    const {
        user_id,
        full_name,
        agency,
        bio
    } = headhunter;

    if (!user_id || !Number.isInteger(user_id)) {
        return {
            error: "user_id debe ser un número entero"
        };
    }

    if (!full_name || full_name.length > 150) {
        return {
            error: "full_name es obligatorio y máximo 150 caracteres"
        };
    }

    if (agency && agency.length > 150) {
        return {
            error: "agency máximo 150 caracteres"
        };
    }

    return {
        query: `
            INSERT INTO headhunters
            (
                user_id,
                full_name,
                agency,
                bio
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *
        `,
        values: [
            user_id,
            full_name,
            agency || null,
            bio || null
        ]
    };
};

const createHeadhunter = async (req, res) => {
    try {

        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({
                error: "El body no puede estar vacio"
            });
        }

        if (!Array.isArray(req.body)) {

            const insert = buildHeadhunterInsert(req.body);

            if (insert.error) {
                return res.status(400).json({
                    error: insert.error
                });
            }

            const headhunter = await headhuntersModel.createHeadhunter(
                insert.query,
                insert.values
            );

            return res.status(201).json(
                headhunter
            );
        }

        const headhunterInserts = [];

        for (const headhunter of req.body) {

            const insert = buildHeadhunterInsert(headhunter);

            if (insert.error) {
                return res.status(400).json({
                    error: insert.error
                });
            }

            headhunterInserts.push(insert);
        }

        const insertedHeadhunters = await headhuntersModel.createHeadhuntersBulk(
            headhunterInserts
        );

        return res.status(201).json(
            insertedHeadhunters
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const buildHeadhunterUpdate = (id, headhunter) => {

    const {
        user_id,
        full_name,
        agency,
        bio
    } = headhunter;

    if (!Number.isInteger(Number(id))) {
        return {
            error: "id debe ser un número entero"
        };
    }

    if (!user_id || !Number.isInteger(user_id)) {
        return {
            error: "user_id debe ser un número entero"
        };
    }

    if (!full_name || full_name.length > 150) {
        return {
            error: "full_name es obligatorio y máximo 150 caracteres"
        };
    }

    if (agency && agency.length > 150) {
        return {
            error: "agency máximo 150 caracteres"
        };
    }

    return {
        query: `
            UPDATE headhunters
            SET
                user_id = $1,
                full_name = $2,
                agency = $3,
                bio = $4
            WHERE id = $5
            RETURNING *
        `,
        values: [
            user_id,
            full_name,
            agency || null,
            bio || null,
            id
        ]
    };
};

const updateHeadhunter = async (req, res) => {
    try {

        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "El body no puede estar vacio"
            });
        }

        const update = buildHeadhunterUpdate(
            id,
            req.body
        );

        if (update.error) {
            return res.status(400).json({
                error: update.error
            });
        }

        const headhunter = await headhuntersModel.updateHeadhunter(
            update.query,
            update.values
        );

        if (!headhunter) {
            return res.status(404).json({
                error: "Headhunter no encontrado"
            });
        }

        return res.status(200).json(
            headhunter
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const deleteHeadhunter = async (req, res) => {
    try {

        const { id } = req.params;

        const headhunter = await headhuntersModel.deleteHeadhunter(id);

        if (!headhunter) {
            return res.status(404).json({
                error: "Headhunter no encontrado"
            });
        }

        return res.status(200).json(
            headhunter
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

module.exports = {
    getHeadhunters,
    getHeadhunterById,
    createHeadhunter,
    updateHeadhunter,
    deleteHeadhunter
};