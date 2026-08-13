const express = require("express");
const router = express.Router();

const {
  createCheckoutSession
} = require("../controllers/paymentController");

router.post("/job-lead/checkout-session", createCheckoutSession);

module.exports = router;
