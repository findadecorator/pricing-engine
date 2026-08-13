const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const leadStatusController = require("../controllers/leadStatusController");

// Get all statuses
router.get(
  "/",
  auth,
  role("admin", "superadmin", "decorator"),
  leadStatusController.getAllStatuses
);

// Get status by name
router.get(
  "/name/:name",
  auth,
  role("admin", "superadmin", "decorator"),
  leadStatusController.getStatusByName
);

// Get status by ID
router.get(
  "/id/:id",
  auth,
  role("admin", "superadmin", "decorator"),
  leadStatusController.getStatusById
);

module.exports = router;
