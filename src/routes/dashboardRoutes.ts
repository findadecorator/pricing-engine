import { Router } from 'express';
import { getCustomerDashboard, getProDashboard, getRealtimeDashboard } from '../controllers/dashboardController';

const router = Router();

router.get('/pro', getProDashboard);
router.get('/customer', getCustomerDashboard);
router.get('/realtime', getRealtimeDashboard);

export default router;
