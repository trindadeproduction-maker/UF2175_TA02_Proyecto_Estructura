const candidatesModel = require("../models/candidates.model");

const getCandidates = async (req, res) => {

    try {

        const candidates = await candidatesModel.getCandidates();

        res.json(candidates);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const buildCandidateInsert = (candidate) => {
    const MODALITIES = ["remote", "hybrid", "on-site"];

    const { user_id, full_name, bio, location, experience_years, preferred_modality } = candidate;

    if (!user_id || !Number.isInteger(user_id)) {
        return { error: "user_id debe ser un número entero" };
    }

    if (!full_name || full_name.length > 150) {
        return { error: "full_name es obligatorio y máximo 150 caracteres" };
    }

    if (experience_years !== undefined && !Number.isInteger(experience_years)) {
        return { error: "experience_years debe ser un número entero" };
    }

    if (preferred_modality && !MODALITIES.includes(preferred_modality)) {
        return { error: "preferred_modality debe ser remote, hybrid u on-site" };
    }

    return {
        query: `
            INSERT INTO candidates (user_id, full_name, bio, location, experience_years, preferred_modality)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
        values: [user_id, full_name, bio || null, location || null, experience_years || 0, preferred_modality || null]
    };
};

const createCandidate = async (req, res) => {
    try {
        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({ error: "El body no puede estar vacio" });
        }

        if (!Array.isArray(req.body)) {
            const insert = buildCandidateInsert(req.body);

            if (insert.error) {
                return res.status(400).json({ error: insert.error });
            }

            const candidate = await candidatesModel.createCandidate(insert.query, insert.values);
            return res.status(201).json(candidate);
        }

        const candidatesInserts = [];

        for (const candidate of req.body) {
            const insert = buildCandidateInsert(candidate);

            if (insert.error) {
                return res.status(400).json({ error: insert.error });
            }

            candidatesInserts.push(insert);
        }

        const insertedCandidates = await candidatesModel.createCandidatesBulk(candidatesInserts);
        return res.status(201).json(insertedCandidates);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCandidateById = async (req, res) => {
    try {
        const { id } = req.params;

        const candidate = await candidatesModel.getCandidateById(id);

        if (!candidate) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }

        res.json(candidate);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const buildCandidateUpdate = (id, candidate) => {
    const MODALITIES = ["remote", "hybrid", "on-site"];

    const { user_id, full_name, bio, location, experience_years, preferred_modality } = candidate;

    if (!Number.isInteger(Number(id))) {
        return { error: "id debe ser un número entero" };
    }

    if (!user_id || !Number.isInteger(user_id)) {
        return { error: "user_id debe ser un número entero" };
    }

    if (!full_name || full_name.length > 150) {
        return { error: "full_name es obligatorio y máximo 150 caracteres" };
    }

    if (experience_years !== undefined && !Number.isInteger(experience_years)) {
        return { error: "experience_years debe ser un número entero" };
    }

    if (preferred_modality && !MODALITIES.includes(preferred_modality)) {
        return { error: "preferred_modality debe ser remote, hybrid u on-site" };
    }

    return {
        query: `
            UPDATE candidates
            SET user_id = $1, full_name = $2, bio = $3,
                location = $4, experience_years = $5, preferred_modality = $6
            WHERE id = $7
            RETURNING *`,
        values: [user_id, full_name, bio || null, location || null, experience_years || 0, preferred_modality || null, id]
    };
};

const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "El body no puede estar vacio" });
        }

        const update = buildCandidateUpdate(id, req.body);

        if (update.error) {
            return res.status(400).json({ error: update.error });
        }

        const candidate = await candidatesModel.updateCandidate(update.query, update.values);

        if (!candidate) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }

        return res.status(200).json(candidate);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;

        const candidate = await candidatesModel.deleteCandidate(id);

        if (!candidate) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }

        return res.status(200).json(candidate);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate
};