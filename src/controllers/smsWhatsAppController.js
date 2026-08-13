const { success, error } = require('../utils/response');

// Twilio disabled until real keys are added
exports.sendSMS = async (req, res) => {
  return error(res, 'Twilio SMS disabled: missing valid TWILIO_SID', 500);
};

exports.sendWhatsApp = async (req, res) => {
  return error(res, 'Twilio WhatsApp disabled: missing valid TWILIO_SID', 500);
};
