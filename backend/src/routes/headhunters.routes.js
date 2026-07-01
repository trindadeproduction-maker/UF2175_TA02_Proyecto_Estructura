const router = require('express').Router();
const {
  getHeadhunters,
  getHeadhuntersById,
  createHeadhunters,
  updateHeadhunters,
  deleteHeadhunters,
} = require('../controllers/headhunters.controller');

router.get('/', getHeadhunters);
router.get('/:id', getHeadhuntersById);
router.post('/', createHeadhunters);
router.put('/:id', updateHeadhunters);
router.delete('/:id', deleteHeadhunters);

module.exports = router;
