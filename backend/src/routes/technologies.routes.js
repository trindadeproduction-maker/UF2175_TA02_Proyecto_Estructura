const router = require('express').Router();
const {
  getTechnologies,
  getTechnologiesById,
  createTechnologies,
  deleteTechnologies,
} = require('../controllers/technologies.controller');

router.get('/', getTechnologies);
router.get('/:id', getTechnologiesById);
router.post('/', createTechnologies);
router.delete('/:id', deleteTechnologies);

module.exports = router;
