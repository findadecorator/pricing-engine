const Stripe = require('stripe');
const { success, error } = require('../utils/response');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE PAYMENT INTENT
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return error(res, 'Amount and currency are required', 400);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }
    });

    return success(res, {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    next(err);
  }
};

// GET PAYMENT INTENT
exports.getPaymentIntent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    return success(res, { paymentIntent });
  } catch (err) {
    next(err);
  }
};
