const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const valid = require("../validator/validator");
const { isValidObjectId } = require("mongoose");
const createReview = async (req, res) => {
  try {
    let bookIdInParam = req.params.bookId;
    if(!isValidObjectId(bookIdInParam)) return res.status(400).send({Status:false, Message:"Invalid bookId in Param"})
    let reviewerData = req.body;
    if(!valid.isValidBody(reviewerData)) return res.status(400).send({Status:false, Message:"Please provide data inside body"})
    let {bookId,review, reviewedAt, reviewedBy, rating } = reviewerData;

    //=============================== Checking the Required fields in the Body ==============================//

    if(!bookId) return res.status(400).send({Status: false, message:"Please provide bookId inside the body"})
    if(!reviewedBy) return res.status(400).send({Status: false, message:"Please provide reviewr's name inside the body"})
    if(!reviewedAt) return res.status(400).send({Status: false, message:"Please provide reviewing date inside the body"})
    if(!rating) return res.status(400).send({Status:false, Message:"Please provide rating inside the body"})


    //=============================== Checking validations for the body fields ============================
    if(!isValidObjectId(bookId)) return res.status(400).send({Status:false, message:"Invalid bookId in the body"})
    if(!valid.invalidInput(reviewedBy)) return res.status(400).send({Status:false, message:"Invalid reviewer's name"})
    if(!valid.isValidDate(reviewedAt)) return res.status(400).send({Status:false, Message:"Invalid review date"})
    if(!valid.isValidRating(rating)) return res.status(400).send({Status:false, Message:"Invalid ratings!... can be 1 to 5 only"})

    const findBook = await bookModel.findById({
      _id: bookIdInParam,
      isDeleted: false,
    });
    if (!findBook || findBook.isDeleted==true)
      return res
        .status(404)
        .send({ status: false, message: "Book not found" });

    const createReviews = await reviewModel.create(reviewerData);
    if (Object.keys(createReviews).length !== 0) {
      const updateReviewCount = await bookModel.findByIdAndUpdate(
        { _id: bookIdInParam },
        { $inc: { reviews: +1 } },
        { new: true }
      );
    }
    return res
      .status(201)
      .send({
        status: true,
        message: "review created successfully",
        data: createReviews,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
// -------------------------------------updateReview-------------------------------------------------------------------------------------------------------------

const updateReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;
    const data = req.body;
    const { review, rating, reviewedBy } = data;

    // if (!valid.isValidObjectId(bookId)) {
    //   return res.status(400).send({ status: false, message: "userId not valid" });
    // }
    // if (!valid.isValidObjectId(reviewId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: " reviewId not valid" });
    // }
    // if (!valid.isValidRequestBody(data)) {
    //   return res
    //     .status(400)
    //     .send({
    //       status: false,
    //       message: "please provide some data to update review",
    //     });
    // }

    let Obj1 = {};

    if (reviewedBy) {
      if (!valid.invalidInput(reviewedBy)) {
        return res
          .status(400)
          .send({ status: false, message: "reviewers name is in proper format" });
      }
      if (!valid.isValidName(reviewedBy))
        return res
          .status(400)
          .send({ status: false, message: "reviewers name is invalid" });

      Obj1.reviewedBy = reviewedBy;
    } else {
      Obj1.reviewedBy = "Guest";
    }

    if (!rating) {
      return res.status(400).send({ status: false, message: "rating is required" });
    }
    if (rating) {
      if (!(typeof rating === "number")) {
        return res
          .status(400)
          .send({ status: false, message: "rating should be a number" });
      }
      if (!valid.onlyNumbers(rating))
        return res
          .status(400)
          .send({ status: false, message: "rating should be between 1 to 5" });
    }

    Obj1.rating = rating;

    Obj1.review = review;

    const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!findBook) {
      return res.status(404).send({ status: false, message: " book not found" });
    }
    const findReview = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!findReview) {
      return res
        .status(404)
        .send({ status: false, message: "review does not exist" });
    }
    if (findReview.bookId != bookId) {
      return res
        .status(404)
        .send({ status: false, message: "Review not found for this book" });
    }

    const updatedReviews = await reviewModel
      .findOneAndUpdate(
        { _id: reviewId, isDeleted: false },
        { $set: Obj1 },
        { new: true }
      )
      .select({ deletedAt: 0 });
    return res
      .status(200)
      .send({
        status: true,
        message: "Successfully updated the review of the book.",
        data: findBook,
        updatedReviews,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =-----========================================deleteApi=======================================================================

const deleteReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!valid.isValidObjectId(bookId))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid bookId...!" });

    const bookExist = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .select({ deletedAt: 0 });

    if (!bookExist)
      return res
        .status(404)
        .send({ status: false, message: "No such book found...!" });

    let reviewId = req.params.reviewId;

    if (!valid.isValidObjectId(reviewId))
      return res
        .status(400)
        .send({ status: false, message: "enter valid reviewId...!" });

    const reviewExist = await reviewModel.findOne({
      _id: reviewId,
      bookId: bookId,
    });

    if (!reviewExist)
      return res
        .status(404)
        .send({ status: false, message: "review not found...!" });

    if (reviewExist.isDeleted == true)
      return res
        .status(404)
        .send({ status: false, data: "review is already deleted...!" });
    if (reviewExist.isDeleted == false) {
      await reviewModel.findOneAndUpdate(
        { _id: reviewId, bookId: bookId, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
      );

      const addCount = await bookModel.findOneAndUpdate(
        { _id: bookId },
        { $inc: { reviews: -1 } },
        { new: true }
      );

      return res
        .status(200)
        .send({ status: true, message: "successfully deleted review" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;