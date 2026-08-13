"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttachmentHandler = createAttachmentHandler;
exports.getUploadUrlHandler = getUploadUrlHandler;
exports.getDownloadUrlHandler = getDownloadUrlHandler;
const attachmentService_1 = require("../services/attachmentService");
async function createAttachmentHandler(req, res) {
    try {
        const data = await (0, attachmentService_1.createAttachmentRecord)(req.body);
        return res.status(201).json(data);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
async function getUploadUrlHandler(req, res) {
    const key = String(req.params.key || '');
    const r = await (0, attachmentService_1.getSignedUploadUrl)(key);
    return res.json(r);
}
async function getDownloadUrlHandler(req, res) {
    const key = String(req.params.key || '');
    const r = await (0, attachmentService_1.getSignedDownloadUrl)(key);
    return res.json(r);
}
