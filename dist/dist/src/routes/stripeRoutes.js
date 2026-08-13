"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const eventBus_1 = require("../lib/eventBus");
const ledger_1 = require("../lib/ledger");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
// Only initialise Stripe if key is present — graceful fallback otherwise
const stripe = STRIPE_SECRET ? new stripe_1.default(STRIPE_SECRET, { apiVersion: "2026-07-29.dahlia" }) : null;
/** Credit pack definitions — price in pence, credits granted. */
const PACKS = {
    SMALL: { name: "Small Pack", credits: 30, pricePence: 999, stripePriceId: process.env.STRIPE_PRICE_SMALL },
    GROWTH: { name: "Growth Pack", credits: 100, pricePence: 2499, stripePriceId: process.env.STRIPE_PRICE_GROWTH },
    SCALE: { name: "Scale Pack", credits: 250, pricePence: 4999, stripePriceId: process.env.STRIPE_PRICE_SCALE },
};
/** POST /api/stripe/checkout-session — create a Stripe Checkout session */
router.post("/checkout-session", auth_1.default, async (req, res) => {
    const { packCode, successUrl, cancelUrl } = req.body;
    const userId = req.user.id;
    const pack = PACKS[packCode?.toUpperCase()];
    if (!pack)
        return res.status(400).json({ error: "Unknown pack code", validCodes: Object.keys(PACKS) });
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
                email: req.user.email,
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
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/** POST /api/stripe/webhook — handle Stripe events */
router.post("/webhook", (req, res) => {
    if (!stripe || !WEBHOOK_SECRET) {
        // Dev fallback — accept unsigned webhook bodies for local testing
        return handleWebhookPayload(req.body, res);
    }
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody ?? JSON.stringify(req.body), sig, WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).json({ error: `Webhook signature failed: ${err.message}` });
    }
    return handleWebhookPayload(event, res);
});
async function handleWebhookPayload(event, res) {
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
            (0, ledger_1.recordLedger)({ type: "stripe_purchase", userId, purchaseId: purchase.id, packCode, credits: creditsNum });
            (0, eventBus_1.publish)("purchase.created", {
                userId,
                purchaseId: purchase.id,
                packCode,
                newBalance: updated.credits,
                source: "stripe",
            });
            console.log(`[Stripe] credits +${creditsNum} for user ${userId} → new balance ${updated.credits}`);
        }
        catch (err) {
            console.error("[Stripe webhook] DB error:", err.message);
            return res.status(500).json({ error: "DB update failed" });
        }
    }
    return res.json({ received: true, type: event.type });
}
/** GET /api/stripe/packs — list available packs */
router.get("/packs", (_req, res) => {
    return res.json(Object.entries(PACKS).map(([code, p]) => ({ code, ...p })));
});
exports.default = router;
