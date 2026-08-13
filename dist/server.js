"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http = __importStar(require("http"));
const pricingRoutes_1 = __importDefault(require("./routes/pricingRoutes"));
const financeRoutes_1 = __importDefault(require("./routes/financeRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const attachmentRoutes_1 = __importDefault(require("./routes/attachmentRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const stripeRoutes_1 = __importDefault(require("./routes/stripeRoutes"));
const websocketService_1 = require("./services/websocketService");
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? 4000);
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({ origin: '*' }));
// Stripe webhook needs the raw body for signature verification — must come before express.json()
app.use('/api/stripe/webhook', express_1.default.raw({ type: 'application/json' }), (req, _res, next) => {
    req.rawBody = req.body;
    next();
});
app.use(express_1.default.json());
app.get('/health', async (_req, res) => {
    let dbStatus = 'unknown';
    try {
        await prisma.$queryRaw `SELECT 1`;
        dbStatus = 'ok';
    }
    catch {
        dbStatus = 'fallback';
    }
    res.json({ status: 'ok', db: dbStatus, ts: new Date().toISOString() });
});
// Public routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/pricing', pricingRoutes_1.default);
app.use('/api/stripe', stripeRoutes_1.default);
// Protected routes (auth middleware applied inside each router)
app.use('/api/finance', financeRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/attachments', attachmentRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/campaigns', campaignRoutes_1.default);
app.use('/api/leads', leadRoutes_1.default);
// user/me convenience alias
app.use('/api/user', authRoutes_1.default);
const httpServer = http.createServer(app);
(0, websocketService_1.initWS)(httpServer);
httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Pricing engine listening on port ${port}`);
});
