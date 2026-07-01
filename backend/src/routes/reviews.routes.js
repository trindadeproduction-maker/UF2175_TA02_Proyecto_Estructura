const router = require('express').Router();
const {
  getReviews,
  getReviewsById,
  createReviews,
  updateReviews,
  deleteReviews,
} = require('../controllers/reviews.controller');

router.get('/', getReviews);
router.get('/:id', getReviewsById);
router.post('/', createReviews);
router.put('/:id', updateReviews);
router.delete('/:id', deleteReviews);

module.exports = router;
