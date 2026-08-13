import { Router } from 'express';
import { allowedRegionsHandler, isAllowedHandler } from '../controllers/regionController';
const router = Router();
router.get('/allowed', allowedRegionsHandler);
router.post('/check', isAllowedHandler);
export default router;
