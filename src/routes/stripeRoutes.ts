import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { publish } from "../lib/eventBus";
import { recordLedger } from "../lib/ledger";
import requireAuth from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Only initialise Stripe if key is present — graceful fallback otherwise
const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET, { apiVersion: "2026-07-29.dahlia" as any }) : null;

/** Credit pack definitions — price in pence, credits granted. */
const PACKS: Record<string, { name: string; credits: number; pricePence: number; stripePriceId?: string }> = {
  SMALL:  { name: "Small Pack",  credits: 30,  pricePence: 999,  stripePriceId: process.env.STRIPE_PRICE_SMALL  },
  GROWTH: { name: "Growth Pack", credits: 100, pricePence: 2499, stripePriceId: process.env.STRIPE_PRICE_GROWTH },
  SCALE:  { name: "Scale Pack",  credits: 250, pricePence: 4999, stripePriceId: process.env.STRIPE_PRICE_SCALE  },
};

/** POST /api/stripe/checkout-session — create a Stripe Checkout session */
router.post("/checkout-session", requireAuth, async (req: Request, res: Response) => {
  const { packCode, successUrl, cancelUrl } = req.body;
  const userId = req.user!.id;
  const pack = PACKS[packCode?.toUpperCase()];
  if (!pack) return res.status(400).json({ error: "Unknown pack code", validCodes: Object.keys(PACKS) });

  if (!stripe) {
    // Dev fallback — simulate a successful purchase without Stripe
    return res.json({
      fallback: true,
      message: "Stripe not configured — credits will be added directly in dev mode",
      pack,
      checkoutUrl: null,
    });
  }

  try {
    await prisma.$connect();
    let stripeCustomerId = (await prisma.user.findUnique({ where: { id: userId }, select: { stripeCustomerId: true } }))?.stripeCustomerId ?? undefined;

    // Create or reuse a Stripe customer
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user!.email,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId } });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        pack.stripePriceId
          ? { price: pack.stripePriceId, quantity: 1 }
          : {
              price_data: {
                currency: "gbp",
                product_data: { name: pack.name, description: `${pack.credits} decorator credits` },
                unit_amount: pack.pricePence,
              },
              quantity: 1,
            },
      ],
      mode: "payment",
      success_url: successUrl ?? `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/credits?success=1`,
      cancel_url: cancelUrl ?? `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/credits?cancelled=1`,
      metadata: { userId, packCode: packCode.toUpperCase(), credits: String(pack.credits), pricePence: String(pack.pricePence) },
    });

    return res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/** POST /api/stripe/webhook — handle Stripe events */
router.post("/webhook", (req: Request, res: Response) => {
  if (!stripe || !WEBHOOK_SECRET) {
    // Dev fallback — accept unsigned webhook bodies for local testing
    return handleWebhookPayload(req.body, res);
  }

  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody ?? JSON.stringify(req.body),
      sig as string,
      WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature failed: ${(err as Error).message}` });
  }
  return handleWebhookPayload(event, res);
});

async function handleWebhookPayload(event: any, res: Response) {
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object ?? event;
    const { userId, packCode, credits, pricePence } = session.metadata ?? {};
    if (!userId || !credits) {
      return res.json({ received: true, warning: "missing metadata" });
    }

    try {
      await prisma.$connect();
      const creditsNum = Number(credits);
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: creditsNum } },
      });
      const purchase = await prisma.purchase.create({
        data: {
          userId,
          type: "PAYG_PACK",
          credits: creditsNum,
          pricePence: Number(pricePence ?? 0),
          meta: { packCode, stripeSessionId: session.id, source: "stripe_checkout" },
        },
      });
      recordLedger({ type: "stripe_purchase", userId, purchaseId: purchase.id, packCode, credits: creditsNum });
      publish("purchase.created", {
        userId,
        purchaseId: purchase.id,
        packCode,
        newBalance: updated.credits,
        source: "stripe",
      });
      console.log(`[Stripe] credits +${creditsNum} for user ${userId} → new balance ${updated.credits}`);
    } catch (err) {
      console.error("[Stripe webhook] DB error:", (err as Error).message);
      return res.status(500).json({ error: "DB update failed" });
    }
  }

  return res.json({ received: true, type: event.type });
}

/** GET /api/stripe/packs — list available packs */
router.get("/packs", (_req, res) => {
  return res.json(
    Object.entries(PACKS).map(([code, p]) => ({ code, ...p }))
  );
});

export default router;
