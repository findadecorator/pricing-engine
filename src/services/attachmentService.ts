import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = ['image/png','image/jpeg','application/pdf'];

export async function createAttachmentRecord({ userId, filename, mime, size, storageKey }: any) {
  if (size > MAX_SIZE) throw new Error('FILE_TOO_LARGE');
  if (!ALLOWED.includes(mime)) throw new Error('MIME_NOT_ALLOWED');
  try {
    await prisma.$connect();
    const att = await prisma.attachment.create({ data: { userId, filename, mime, size, storageKey } });
    return att;
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function getSignedUploadUrl(storageKey: string) {
  // skeleton - in production would call S3
  return { url: `https://s3.example/upload/${storageKey}`, method: 'PUT' };
}

export async function getSignedDownloadUrl(storageKey: string) {
  return { url: `https://s3.example/download/${storageKey}`, method: 'GET' };
}
