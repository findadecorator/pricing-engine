const express = require('express');
const router = express.Router();

const {
  pingServer,
  pingDB
} = require('../controllers/testController');

router.get('/server', pingServer);
router.get('/db', pingDB);

module.exports = router;
