"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoiceHandler = createInvoiceHandler;
exports.listInvoicesHandler = listInvoicesHandler;
exports.createTaxRecordHandler = createTaxRecordHandler;
exports.listTaxRecordsHandler = listTaxRecordsHandler;
exports.createExpenseHandler = createExpenseHandler;
exports.listExpensesHandler = listExpensesHandler;
const financeService_1 = require("../services/financeService");
async function createInvoiceHandler(req, res) {
    try {
        const invoice = await (0, financeService_1.createInvoice)(req.body);
        return res.status(201).json({ success: true, invoice });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}
async function listInvoicesHandler(req, res) {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId query is required' });
    }
    const invoices = await (0, financeService_1.listInvoicesByUser)(userId);
    return res.json({ success: true, invoices });
}
async function createTaxRecordHandler(req, res) {
    try {
        const taxRecord = await (0, financeService_1.createTaxRecord)(req.body);
        return res.status(201).json({ success: true, taxRecord });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}
async function listTaxRecordsHandler(req, res) {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId query is required' });
    }
    const taxRecords = await (0, financeService_1.listTaxRecordsByUser)(userId);
    return res.json({ success: true, taxRecords });
}
async function createExpenseHandler(req, res) {
    try {
        const expense = await (0, financeService_1.createExpense)(req.body);
        return res.status(201).json({ success: true, expense });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}
async function listExpensesHandler(req, res) {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId query is required' });
    }
    const expenses = await (0, financeService_1.listExpensesByUser)(userId);
    return res.json({ success: true, expenses });
}
