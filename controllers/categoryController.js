const Category = require("../models/Category");
const { StatusCodes } = require("http-status-codes");

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(StatusCodes.CREATED).json(category);
};
const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ categories, count: categories.length });
};

module.exports = { createCategory, getAllCategories };
