const { success, error } = require("../utils/response");
const decoratorService = require("../services/decoratorService");

exports.create = async (req, res) => {
  try {
    const decorator = await decoratorService.createDecorator(req.user, req.body);
    return success(res, { decorator }, 201);
  } catch (e) {
    return error(res, e.message || "Decorator creation failed", e.status || 500);
  }
};

exports.update = async (req, res) => {
  try {
    const decorator = await decoratorService.updateDecorator(req.params.id, req.body);
    return success(res, { decorator }, 200);
  } catch (e) {
    return error(res, e.message || "Decorator update failed", e.status || 500);
  }
};

exports.remove = async (req, res) => {
  try {
    await decoratorService.deleteDecorator(req.params.id);
    return success(res, { message: "Decorator deleted" }, 200);
  } catch (e) {
    return error(res, e.message || "Decorator deletion failed", e.status || 500);
  }
};

exports.getOne = async (req, res) => {
  try {
    const decorator = await decoratorService.getDecoratorById(req.params.id);
    return success(res, { decorator }, 200);
  } catch (e) {
    return error(res, e.message || "Decorator fetch failed", e.status || 500);
  }
};

exports.getAll = async (req, res) => {
  try {
    const decorators = await decoratorService.getAllDecorators();
    return success(res, { decorators }, 200);
  } catch (e) {
    return error(res, e.message || "Decorators fetch failed", e.status || 500);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return error(res, "No file uploaded", 400);
    const imageUrl = `/uploads/${req.file.filename}`;
    const decorator = await decoratorService.setDecoratorImage(req.params.id, imageUrl);
    return success(res, { decorator }, 200);
  } catch (e) {
    return error(res, e.message || "Image upload failed", e.status || 500);
  }
};
