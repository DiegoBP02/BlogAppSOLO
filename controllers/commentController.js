const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");
const CustomError = require("../errors");

const createComment = async (req, res) => {
  const { post: postId } = req.body;
  const isValidPost = await Post.findOne({ _id: postId });
  if (!isValidPost) {
    throw new CustomError.NotFoundError(`Post not found!`);
  }

  const alreadySubmitted = await Comment.findOne({
    post: postId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      `You can send only 1 comment per post`
    );
  }

  req.body.user = req.user.userId;

  const comment = await Comment.create(req.body);
  res.status(StatusCodes.CREATED).json(comment);
};
const getAllComments = async (req, res) => {
  const comments = await Comment.find({})
    .populate({
      path: "post",
      select: "title desc image categories",
    })
    .populate({
      path: "user",
      select: "name",
    });
  res.status(StatusCodes.OK).json({ comments, count: comments.length });
};
const getSingleComment = async (req, res) => {
  const { id: commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(
      `There is no comment with ${commentId} id!`
    );
  }
  res.status(StatusCodes.OK).json({ comment });
};
const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(
      `There is no comment with ${commentId} id!`
    );
  }

  checkPermissions(req.user, comment.user);
  await comment.remove();
  res.status(StatusCodes.OK).json({ msg: "Successful! Comment deleted!" });
};
const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { rating, title, desc } = req.body;

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(
      `There is no comment with ${commentId} id!`
    );
  }

  checkPermissions(req.user, comment.user);

  comment.rating = rating;
  comment.title = title;
  comment.desc = desc;

  await comment.save();
  res.status(StatusCodes.OK).json(comment);
};

module.exports = {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
};
