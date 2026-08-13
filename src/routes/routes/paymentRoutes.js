const express = require('express');
const router = express.Router();

const {
  createPaymentIntent,
  getPaymentIntent
} = require('../controllers/paymentController');

router.post('/intent', createPaymentIntent);
router.get('/intent/:id', getPaymentIntent);

module.exports = router;
