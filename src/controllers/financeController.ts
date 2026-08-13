import { Request, Response } from 'express';
import { createExpense, createInvoice, createTaxRecord, listExpensesByUser, listInvoicesByUser, listTaxRecordsByUser } from '../services/financeService';

export async function createInvoiceHandler(req: Request, res: Response) {
  try {
    const invoice = await createInvoice(req.body);
    return res.status(201).json({ success: true, invoice });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function listInvoicesHandler(req: Request, res: Response) {
  const userId = req.query.userId as string | undefined;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId query is required' });
  }

  const invoices = await listInvoicesByUser(userId);
  return res.json({ success: true, invoices });
}

export async function createTaxRecordHandler(req: Request, res: Response) {
  try {
    const taxRecord = await createTaxRecord(req.body);
    return res.status(201).json({ success: true, taxRecord });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function listTaxRecordsHandler(req: Request, res: Response) {
  const userId = req.query.userId as string | undefined;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId query is required' });
  }

  const taxRecords = await listTaxRecordsByUser(userId);
  return res.json({ success: true, taxRecords });
}

export async function createExpenseHandler(req: Request, res: Response) {
  try {
    const expense = await createExpense(req.body);
    return res.status(201).json({ success: true, expense });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function listExpensesHandler(req: Request, res: Response) {
  const userId = req.query.userId as string | undefined;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId query is required' });
  }

  const expenses = await listExpensesByUser(userId);
  return res.json({ success: true, expenses });
}
