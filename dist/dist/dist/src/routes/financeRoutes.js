"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financeController_1 = require("../controllers/financeController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.post('/invoices', financeController_1.createInvoiceHandler);
router.get('/invoices', financeController_1.listInvoicesHandler);
router.post('/tax-records', financeController_1.createTaxRecordHandler);
router.get('/tax-records', financeController_1.listTaxRecordsHandler);
router.post('/expenses', financeController_1.createExpenseHandler);
router.get('/expenses', financeController_1.listExpensesHandler);
exports.default = router;
