const express = require("express");
const router = express.Router();

const decoratorController = require("../controllers/decoratorController");

// GET all decorators
router.get("/", decoratorController.getAllDecorators);

// ADD a decorator
router.post("/", decoratorController.addDecorator);

module.exports = router;
