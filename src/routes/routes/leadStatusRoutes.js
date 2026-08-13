const express = require('express');
const router = express.Router();

const {
  updateStatus,
  getStatuses
} = require('../controllers/leadStatusController');

router.put('/:leadId', updateStatus);
router.get('/', getStatuses);

module.exports = router;
