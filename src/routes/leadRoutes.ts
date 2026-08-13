import { Router } from 'express';
import { unlockJobHandler } from '../controllers/leadController';
import requireAuth from '../middleware/auth';

const router = Router();
router.use(requireAuth);
router.post('/unlock', unlockJobHandler);
export default router;
