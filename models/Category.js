const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 10,
    required: true,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
