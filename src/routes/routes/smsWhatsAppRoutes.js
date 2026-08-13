const express = require('express');
const router = express.Router();

const {
  sendSMS,
  sendWhatsApp
} = require('../controllers/smsWhatsAppController');

router.post('/sms', sendSMS);
router.post('/whatsapp', sendWhatsApp);

module.exports = router;
