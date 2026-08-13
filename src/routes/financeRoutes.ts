import { Router } from 'express';
import { createExpenseHandler, createInvoiceHandler, createTaxRecordHandler, listExpensesHandler, listInvoicesHandler, listTaxRecordsHandler } from '../controllers/financeController';
import requireAuth from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.post('/invoices', createInvoiceHandler);
router.get('/invoices', listInvoicesHandler);
router.post('/tax-records', createTaxRecordHandler);
router.get('/tax-records', listTaxRecordsHandler);
router.post('/expenses', createExpenseHandler);
router.get('/expenses', listExpensesHandler);

export default router;
