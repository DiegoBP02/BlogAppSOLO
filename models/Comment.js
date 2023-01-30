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

CommentSchema.statics.calculateAverageRating = async function (postId) {
  const result = await this.aggregate([
    { $match: { post: postId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfComments: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Posts").findOneAndUpdate(
      { _id: postId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfComments: result[0]?.numOfComments || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

CommentSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.post);
});

module.exports = mongoose.model("Comments", CommentSchema);
