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
const { getSinglePostComments } = require("../controllers/commentController");

const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router.route("/uploadImage").post(authenticateUser, uploadImage);
router.route("/:id/comments").get(getSinglePostComments);
router
  .route("/:id")
  .get(getSinglePost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);

module.exports = router;
