"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttachmentRecord = createAttachmentRecord;
exports.getSignedUploadUrl = getSignedUploadUrl;
exports.getSignedDownloadUrl = getSignedDownloadUrl;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = ['image/png', 'image/jpeg', 'application/pdf'];
async function createAttachmentRecord({ userId, filename, mime, size, storageKey }) {
    if (size > MAX_SIZE)
        throw new Error('FILE_TOO_LARGE');
    if (!ALLOWED.includes(mime))
        throw new Error('MIME_NOT_ALLOWED');
    try {
        await prisma.$connect();
        const att = await prisma.attachment.create({ data: { userId, filename, mime, size, storageKey } });
        return att;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function getSignedUploadUrl(storageKey) {
    // skeleton - in production would call S3
    return { url: `https://s3.example/upload/${storageKey}`, method: 'PUT' };
}
async function getSignedDownloadUrl(storageKey) {
    return { url: `https://s3.example/download/${storageKey}`, method: 'GET' };
}
