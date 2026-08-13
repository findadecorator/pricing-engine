import { Router } from 'express';
import { createAttachmentHandler, getUploadUrlHandler, getDownloadUrlHandler } from '../controllers/attachmentController';

const router = Router();

router.post('/', createAttachmentHandler);
router.get('/upload/:key', getUploadUrlHandler);
router.get('/download/:key', getDownloadUrlHandler);

export default router;
