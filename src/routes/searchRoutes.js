const express = require('express');
const router = express.Router();

const {
  searchDecorators,
  searchClients,
  searchLeads
} = require('../controllers/searchController');

router.get('/decorators', searchDecorators);
router.get('/clients', searchClients);
router.get('/leads', searchLeads);

module.exports = router;
