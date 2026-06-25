const favoritesModel = require("../models/favorites.model");

// GET /candidates/:id/favorites
const getCandidateFavorites = async (req, res) => {
    const { id } = req.params;

    try {
        const favorites = await favoritesModel.getCandidateFavorites(id);

        res.json(favorites);
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        res.status(500).json({ message: "Error al obtener favoritos" });
    }
};

// POST /candidates/:id/favorites/:companyId
const addFavorite = async (req, res) => {
    const { id, companyId } = req.params;

    try {
        const favorite = await favoritesModel.addFavorite(id, companyId);

        res.status(201).json({
            message: "Empresa añadida a favoritos correctamente",
            favorite,
        });
    } catch (error) {
        console.error("Error al añadir favorito:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Esta empresa ya está en favoritos",
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                message: "El candidato o la empresa no existe",
            });
        }

        res.status(500).json({ message: "Error al añadir favorito" });
    }
};

// DELETE /candidates/:id/favorites/:companyId
const removeFavorite = async (req, res) => {
    const { id, companyId } = req.params;

    try {
        const favorite = await favoritesModel.removeFavorite(id, companyId);

        if (!favorite) {
            return res.status(404).json({
                message: "Favorito no encontrado",
            });
        }

        res.json({
            message: "Empresa eliminada de favoritos correctamente",
            favorite,
        });
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        res.status(500).json({ message: "Error al eliminar favorito" });
    }
};

module.exports = {
    getCandidateFavorites,
    addFavorite,
    removeFavorite,
};