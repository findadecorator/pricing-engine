const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllDecorators,
  getAllClients
} = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/decorators', getAllDecorators);
router.get('/clients', getAllClients);

module.exports = router;
