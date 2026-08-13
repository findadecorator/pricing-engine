const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const ownership = require("../middleware/ownership");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const decoratorController = require("../controllers/decoratorController");

router.get("/", decoratorController.getAll);
router.get("/:id", decoratorController.getOne);

router.post(
  "/",
  auth,
  role("user", "decorator", "admin", "superadmin"),
  decoratorController.create
);

router.put(
  "/:id",
  auth,
  role("user", "decorator", "admin", "superadmin"),
  ownership,
  decoratorController.update
);

router.delete(
  "/:id",
  auth,
  role("user", "decorator", "admin", "superadmin"),
  ownership,
  decoratorController.remove
);

router.post(
  "/:id/image",
  auth,
  role("user", "decorator", "admin", "superadmin"),
  ownership,
  upload.single("image"),
  decoratorController.uploadImage
);

module.exports = router;
