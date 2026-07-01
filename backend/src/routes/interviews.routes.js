const router = require('express').Router();
const {
  getInterviews,
  getInterviewsById,
  createInterviews,
  updateInterviews,
  deleteInterviews,
} = require('../controllers/interviews.controller');

router.get('/', getInterviews);
router.get('/:id', getInterviewsById);
router.post('/', createInterviews);
router.put('/:id', updateInterviews);
router.delete('/:id', deleteInterviews);

module.exports = router;
