const router = require('express').Router();
const {
  login,
  registerCandidate,
  registerCompany,
} = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register-candidate', registerCandidate);
router.post('/register-company', registerCompany);

module.exports = router;
