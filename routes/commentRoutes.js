const express = require("express");
const router = express.Router();

const {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllComments).post(authenticateUser, createComment);
router
  .route("/:id")
  .get(getSingleComment)
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);

module.exports = router;
