const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth, userController.getProfile);

module.exports = router;
