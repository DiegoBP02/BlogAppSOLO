const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: 25,
    },
    desc: {
      type: String,
      maxlength: 100,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Comments", CommentSchema);
