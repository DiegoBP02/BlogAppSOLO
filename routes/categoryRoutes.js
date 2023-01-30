const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
} = require("../controllers/categoryController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticateUser, authorizePermissions("admin"), createCategory)
  .get(getAllCategories);

module.exports = router;
