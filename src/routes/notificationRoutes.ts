import { Router } from 'express';
import { enqueueHandler, deliverHandler } from '../controllers/notificationController';

const router = Router();
router.post('/', enqueueHandler);
router.post('/:id/deliver', deliverHandler);
export default router;
