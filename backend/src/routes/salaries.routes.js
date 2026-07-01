const router = require('express').Router();
const {
  getSalaries,
  getSalariesById,
  createSalaries,
  updateSalaries,
  deleteSalaries,
} = require('../controllers/salaries.controller');

router.get('/', getSalaries);
router.get('/:id', getSalariesById);
router.post('/', createSalaries);
router.put('/:id', updateSalaries);
router.delete('/:id', deleteSalaries);

module.exports = router;
