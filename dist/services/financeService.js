"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = createInvoice;
exports.listInvoicesByUser = listInvoicesByUser;
exports.createTaxRecord = createTaxRecord;
exports.listTaxRecordsByUser = listTaxRecordsByUser;
exports.createExpense = createExpense;
exports.listExpensesByUser = listExpensesByUser;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
async function createInvoice(input) {
    const invoiceNumber = input.invoiceNumber ?? `INV-${(0, crypto_1.randomUUID)().slice(0, 8).toUpperCase()}`;
    const dueDate = new Date(input.dueDate);
    return prisma.invoice.create({
        data: {
            invoiceNumber,
            leadId: input.leadId ?? null,
            userId: input.userId,
            customerId: input.customerId,
            dueDate,
            currency: input.currency,
            subtotalPence: input.subtotalPence,
            vatPence: input.vatPence,
            totalPence: input.totalPence,
            status: input.status ?? 'UNPAID',
            lineItems: input.lineItems,
            metadata: input.metadata,
            pdfUrl: input.pdfUrl ?? null,
        },
    });
}
async function listInvoicesByUser(userId) {
    return prisma.invoice.findMany({ where: { userId } });
}
async function createTaxRecord(input) {
    return prisma.taxRecord.create({
        data: {
            userId: input.userId,
            periodStart: new Date(input.periodStart),
            periodEnd: new Date(input.periodEnd),
            totalSalesPence: input.totalSalesPence,
            totalVatPence: input.totalVatPence,
            country: input.country,
            currency: input.currency,
            exported: input.exported ?? false,
            exportMeta: input.exportMeta,
        },
    });
}
async function listTaxRecordsByUser(userId) {
    return prisma.taxRecord.findMany({ where: { userId } });
}
async function createExpense(input) {
    return prisma.expense.create({
        data: {
            userId: input.userId,
            description: input.description,
            amountPence: input.amountPence,
            vatPence: input.vatPence,
            receiptUrl: input.receiptUrl ?? null,
            category: input.category ?? null,
        },
    });
}
async function listExpensesByUser(userId) {
    return prisma.expense.findMany({ where: { userId } });
}
