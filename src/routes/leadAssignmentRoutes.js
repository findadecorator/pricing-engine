const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const leadAssignmentController = require("../controllers/leadAssignmentController");

// Assign lead to decorator
router.post(
  "/:id",
  auth,
  role("admin", "superadmin"),
  leadAssignmentController.assignLeadToDecorator
);

// Get all assignments for a lead
router.get(
  "/:id",
  auth,
  role("admin", "superadmin", "decorator"),
  leadAssignmentController.getAssignmentsForLead
);

module.exports = router;
