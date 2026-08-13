const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const jobLeadController = require("../controllers/jobLeadController");

// Create a new job lead
router.post(
  "/",
  auth,
  role("user", "admin", "superadmin"),
  jobLeadController.createLead
);

// Update lead status
router.put(
  "/:id/status",
  auth,
  role("admin", "superadmin", "decorator"),
  jobLeadController.updateLeadStatus
);

// Assign lead to decorator
router.post(
  "/:id/assign",
  auth,
  role("admin", "superadmin"),
  jobLeadController.assignLead
);

// Get lead by ID
router.get(
  "/:id",
  auth,
  jobLeadController.getLeadById
);

// Get all leads for a decorator
router.get(
  "/decorator/:id",
  auth,
  role("decorator", "admin", "superadmin"),
  jobLeadController.getLeadsForDecorator
);

// Get all leads for a client
router.get(
  "/client/:id",
  auth,
  role("user", "admin", "superadmin"),
  jobLeadController.getLeadsForClient
);

// Get all leads (admin only)
router.get(
  "/",
  auth,
  role("admin", "superadmin"),
  jobLeadController.getAllLeads
);

module.exports = router;
