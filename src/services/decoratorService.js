const decoratorModel = require("../models/decoratorModel");
const { NotFoundError } = require("../utils/errors");

const createDecorator = async (user, data) => {
  const { business_name, description, city } = data;
  if (!business_name || !city) {
    throw new Error("Missing required fields");
  }

  let owner_user_id = null;
  let owner_decorator_id = null;

  if (user.role === "user") owner_user_id = user.id;
  else if (user.role === "decorator") owner_decorator_id = user.id;
  else if (user.role === "admin" || user.role === "superadmin") owner_user_id = user.id;

  const decorator = await decoratorModel.create({
    business_name,
    description,
    city,
    owner_user_id,
    owner_decorator_id
  });

  return decorator;
};

const updateDecorator = async (id, data) => {
  const decorator = await decoratorModel.update(id, data);
  if (!decorator) throw new NotFoundError("Decorator not found");
  return decorator;
};

const deleteDecorator = async (id) => {
  const ok = await decoratorModel.remove(id);
  if (!ok) throw new NotFoundError("Decorator not found");
  return true;
};

const getDecoratorById = async (id) => {
  const decorator = await decoratorModel.findById(id);
  if (!decorator) throw new NotFoundError("Decorator not found");
  return decorator;
};

const getAllDecorators = async () => {
  return await decoratorModel.list();
};

const setDecoratorImage = async (id, imageUrl) => {
  const decorator = await decoratorModel.setImage(id, imageUrl);
  if (!decorator) throw new NotFoundError("Decorator not found");
  return decorator;
};

module.exports = {
  createDecorator,
  updateDecorator,
  deleteDecorator,
  getDecoratorById,
  getAllDecorators,
  setDecoratorImage
};
