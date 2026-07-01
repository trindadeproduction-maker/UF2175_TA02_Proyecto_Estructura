const router = require('express').Router();
const {
  getCandidates,
  getCandidatesById,
  createCandidates,
  updateCandidates,
  deleteCandidates,
} = require('../controllers/candidates.controller');

router.get('/', getCandidates);
router.get('/:id', getCandidatesById);
router.post('/', createCandidates);
router.put('/:id', updateCandidates);
router.delete('/:id', deleteCandidates);

module.exports = router;
