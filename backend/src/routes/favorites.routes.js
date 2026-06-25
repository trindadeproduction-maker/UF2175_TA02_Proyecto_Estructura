const express = require("express");
const router = express.Router();

const favoritesController = require("../controllers/favorites.controller");

router.get("/candidates/:id/favorites", favoritesController.getCandidateFavorites);
router.post("/candidates/:id/favorites/:companyId", favoritesController.addFavorite);
router.delete("/candidates/:id/favorites/:companyId", favoritesController.removeFavorite);

module.exports = router;