import { Router } from 'express';
import { createCampaignHandler, performanceHandler, impressionHandler, clickHandler } from '../controllers/campaignController';
import requireAuth from '../middleware/auth';

const router = Router();
router.use(requireAuth);
router.post('/', createCampaignHandler);
router.get('/:id/performance', performanceHandler);
router.post('/impression', impressionHandler);
router.post('/click', clickHandler);

export default router;
