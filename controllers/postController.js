const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createPost = async (req, res) => {
  req.body.user = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json(post);
};
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOneAndUpdate({ _id: postId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new CustomError.BadRequestError(`There is no post with ${postId}id `);
  }
  res.status(StatusCodes.OK).json(post);
};
const deletePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new CustomError.BadRequestError(`There is no post with ${postId} id`);
  }
  await post.remove();
  res.status(StatusCodes.OK).json({ msg: "Successful! Post removed!" });
};
const getSinglePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId }).populate("comments");
  if (!post) {
    throw new CustomError.BadRequestError(`There is no post with ${postId} id`);
  }
  res.status(StatusCodes.OK).json(post);
};
const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded!");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image!");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Image can not be bigger than 1MB!");
  }

  const imagePath = path.join(__dirname, "../images/" + `${productImage.name}`);
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/images/${productImage.name}` });
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getAllPosts,
  uploadImage,
};
