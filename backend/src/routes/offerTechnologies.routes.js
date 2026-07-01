const router = require('express').Router();
const {
  getOfferTechnologies,
  getOfferTechnologiesByOfferId,
  createOfferTechnologies,
  deleteOfferTechnologies,
} = require('../controllers/offerTechnologies.controller');

router.get('/', getOfferTechnologies);
router.get('/:offerId', getOfferTechnologiesByOfferId);
router.post('/', createOfferTechnologies);
router.delete('/:offerId/:technologyId', deleteOfferTechnologies);

module.exports = router;
