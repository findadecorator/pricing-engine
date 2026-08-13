import { Router } from 'express';
import { purchaseAddonHandler, listAddonsHandler } from '../controllers/addonController';
const router = Router();
router.post('/purchase', purchaseAddonHandler);
router.get('/list', listAddonsHandler);
export default router;
