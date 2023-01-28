const express = require("express");
const router = express.Router();

const {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getAllPosts,
  uploadImage,
} = require("../controllers/postController");

const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router
  .route("/:id")
  .get(getSinglePost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);
router.route("/uploadImage").post(authenticateUser, uploadImage);

module.exports = router;
