const express = require('express');
const router = express.Router();

const {
  registerClient,
  loginClient,
  getClientProfile
} = require('../controllers/clientController');

router.post('/register', registerClient);
router.post('/login', loginClient);
router.get('/:id', getClientProfile);

module.exports = router;
