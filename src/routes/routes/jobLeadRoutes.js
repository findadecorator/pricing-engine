const express = require('express');
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus
} = require('../controllers/jobLeadController');

router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id/status', updateLeadStatus);

module.exports = router;
