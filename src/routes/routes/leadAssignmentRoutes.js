const express = require('express');
const router = express.Router();

const {
  assignLead,
  getAssignments,
  getAssignmentById
} = require('../controllers/leadAssignmentController');

router.post('/', assignLead);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

module.exports = router;
