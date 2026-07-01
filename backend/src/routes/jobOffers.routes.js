const router = require('express').Router();
const {
  getJobOffers,
  getJobOffersById,
  createJobOffers,
  updateJobOffers,
  deleteJobOffers,
} = require('../controllers/jobOffers.controller');

router.get('/', getJobOffers);
router.get('/:id', getJobOffersById);
router.post('/', createJobOffers);
router.put('/:id', updateJobOffers);
router.delete('/:id', deleteJobOffers);

module.exports = router;
