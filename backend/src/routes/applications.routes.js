const router = require('express').Router();
const {
  getApplications,
  getApplicationsById,
  createApplications,
  updateApplications,
  deleteApplications,
} = require('../controllers/applications.controller');

router.get('/', getApplications);
router.get('/:id', getApplicationsById);
router.post('/', createApplications);
router.put('/:id', updateApplications);
router.delete('/:id', deleteApplications);

module.exports = router;
