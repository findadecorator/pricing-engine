import { Request, Response } from 'express';
import { createAttachmentRecord, getSignedUploadUrl, getSignedDownloadUrl } from '../services/attachmentService';

export async function createAttachmentHandler(req: Request, res: Response) {
  try {
    const data = await createAttachmentRecord(req.body);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

export async function getUploadUrlHandler(req: Request, res: Response) {
  const key = String(req.params.key || '');
  const r = await getSignedUploadUrl(key);
  return res.json(r);
}

export async function getDownloadUrlHandler(req: Request, res: Response) {
  const key = String(req.params.key || '');
  const r = await getSignedDownloadUrl(key);
  return res.json(r);
}
