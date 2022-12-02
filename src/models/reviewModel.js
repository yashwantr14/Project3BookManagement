const mongoose = require("mongoose");

const reviewerSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "book",
  },
  reviewedBy: {
    type: String,
    required: true,
     default :"Guest",
    // value:
  },
  reviewedAt: {
    type: Date,
    required: true
  },
  rating: {
    type: Number//min 1, max 5, mandatory
  },
  review: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("reviewer", reviewerSchema);
