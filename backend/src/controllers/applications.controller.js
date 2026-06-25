const applicationsModel = require("../models/applications.model");

// GET /applications
const getAllApplications = async (req, res) => {
    try {
        const applications = await applicationsModel.getAllApplications();
        res.json(applications);
    } catch (error) {
        console.error("Error al obtener candidaturas:", error);
        res.status(500).json({ message: "Error al obtener candidaturas" });
    }
};

// GET /applications/:id
const getApplicationById = async (req, res) => {
    const { id } = req.params;

    try {
        const application = await applicationsModel.getApplicationById(id);

        if (!application) {
            return res.status(404).json({ message: "Candidatura no encontrada" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error al obtener candidatura:", error);
        res.status(500).json({ message: "Error al obtener candidatura" });
    }
};

// POST /applications
const createApplication = async (req, res) => {
    const { candidate_id, offer_id, status, cover_letter } = req.body;

    if (!candidate_id || !offer_id) {
        return res.status(400).json({
            message: "candidate_id y offer_id son obligatorios",
        });
    }

    try {
        const application = await applicationsModel.createApplication(
            candidate_id,
            offer_id,
            status,
            cover_letter
        );

        res.status(201).json({
            message: "Candidatura creada correctamente",
            application,
        });
    } catch (error) {
        console.error("Error al crear candidatura:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Este candidato ya ha aplicado a esta oferta",
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                message: "candidate_id u offer_id no existe",
            });
        }

        res.status(500).json({ message: "Error al crear candidatura" });
    }
};

// PUT /applications/:id
const updateApplication = async (req, res) => {
    const { id } = req.params;
    const { status, cover_letter } = req.body;

    if (!status && !cover_letter) {
        return res.status(400).json({
            message: "Debes enviar status o cover_letter para actualizar",
        });
    }

    try {
        const application = await applicationsModel.updateApplication(
            id,
            status,
            cover_letter
        );

        if (!application) {
            return res.status(404).json({ message: "Candidatura no encontrada" });
        }

        res.json({
            message: "Candidatura actualizada correctamente",
            application,
        });
    } catch (error) {
        console.error("Error al actualizar candidatura:", error);
        res.status(500).json({ message: "Error al actualizar candidatura" });
    }
};

// DELETE /applications/:id
const deleteApplication = async (req, res) => {
    const { id } = req.params;

    try {
        const application = await applicationsModel.deleteApplication(id);

        if (!application) {
            return res.status(404).json({ message: "Candidatura no encontrada" });
        }

        res.json({
            message: "Candidatura eliminada correctamente",
            application,
        });
    } catch (error) {
        console.error("Error al eliminar candidatura:", error);
        res.status(500).json({ message: "Error al eliminar candidatura" });
    }
};

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
};