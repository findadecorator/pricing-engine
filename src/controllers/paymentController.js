// 🔥 PRINT THE STRIPE KEY LOADED BY DOTENV
console.log("🔥 Loaded Stripe Key:", process.env.STRIPE_SECRET_KEY);

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { job_lead_id, decorator_user_id, amount_cents, payment_type } = req.body;

    if (!job_lead_id || !decorator_user_id || !amount_cents || !payment_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Job Lead Payment (${payment_type})`
            },
            unit_amount: amount_cents
          },
          quantity: 1
        }
      ],
      metadata: {
        job_lead_id,
        decorator_user_id,
        payment_type
      },
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel"
    });

    return res.json({ id: session.id, url: session.url });

  } catch (error) {
    console.log("🔥 STRIPE RAW ERROR:", error);
    console.log("🔥 STRIPE MESSAGE:", error.message);
    console.log("🔥 STRIPE TYPE:", error.type);

    return res.status(500).json({
      error: "Failed to create checkout session",
      details: error.message
    });
  }
};
