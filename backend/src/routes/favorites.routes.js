const router = require('express').Router();
const {
  getFavorites,
  getFavoritesById,
  createFavorites,
  deleteFavorites,
} = require('../controllers/favorites.controller');

router.get('/', getFavorites);
router.get('/:id', getFavoritesById);
router.post('/', createFavorites);
router.delete('/:id', deleteFavorites);

module.exports = router;
