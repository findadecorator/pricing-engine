import { Router } from 'express';
import { buyPack, pricingInfo } from '../controllers/pricingController';

const router = Router();

router.get('/info', pricingInfo);
router.post('/buy-pack', buyPack);

export default router;
