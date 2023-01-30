const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 500,
    },
    image: {
      type: String,
      default: "images/default-post.jpg",
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

PostSchema.pre("remove", async function () {
  await this.model("Comments").deleteMany({ post: this._id });
});

module.exports = mongoose.model("Posts", PostSchema);
