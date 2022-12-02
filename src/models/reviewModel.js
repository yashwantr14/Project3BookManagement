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
  },
  reviewedAt: {
    type: String,
    required: true
  },
  rating: {
    type: Number, //min 1, max 5, mandatory
    required:true
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
