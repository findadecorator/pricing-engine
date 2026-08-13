import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

type InvoiceInput = {
  invoiceNumber?: string;
  leadId?: string | null;
  userId: string;
  customerId: string;
  dueDate: string;
  currency: string;
  subtotalPence: number;
  vatPence: number;
  totalPence: number;
  status?: 'UNPAID' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED' | 'REFUNDED';
  lineItems: unknown;
  metadata?: unknown;
  pdfUrl?: string | null;
};

type TaxRecordInput = {
  userId: string;
  periodStart: string;
  periodEnd: string;
  totalSalesPence: number;
  totalVatPence: number;
  country: string;
  currency: string;
  exported?: boolean;
  exportMeta?: unknown;
};

type ExpenseInput = {
  userId: string;
  description: string;
  amountPence: number;
  vatPence: number;
  receiptUrl?: string | null;
  category?: string | null;
};

const prisma = new PrismaClient();

export async function createInvoice(input: InvoiceInput) {
  const invoiceNumber = input.invoiceNumber ?? `INV-${randomUUID().slice(0, 8).toUpperCase()}`;
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
      lineItems: input.lineItems as never,
      metadata: input.metadata as never,
      pdfUrl: input.pdfUrl ?? null,
    },
  });
}

export async function listInvoicesByUser(userId: string) {
  return prisma.invoice.findMany({ where: { userId } });
}

export async function createTaxRecord(input: TaxRecordInput) {
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
      exportMeta: input.exportMeta as never,
    },
  });
}

export async function listTaxRecordsByUser(userId: string) {
  return prisma.taxRecord.findMany({ where: { userId } });
}

export async function createExpense(input: ExpenseInput) {
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

export async function listExpensesByUser(userId: string) {
  return prisma.expense.findMany({ where: { userId } });
}
