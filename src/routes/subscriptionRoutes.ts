import { Router } from 'express';
import { subscribeHandler, renewHandler, cancelHandler } from '../controllers/subscriptionController';
const router = Router();
router.post('/subscribe', subscribeHandler);
router.post('/renew', renewHandler);
router.post('/cancel', cancelHandler);
export default router;
