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
    if(!reviewedBy) return res.status(400).send({Status: false, message:"Please provide reviewer's name inside the body"})
    if(!reviewedAt) return res.status(400).send({Status: false, message:"Please provide reviewing date inside the body"})
    if(!rating) return res.status(400).send({Status:false, Message:"Please provide rating inside the body"})


    //=============================== Checking validations for the body fields ============================
    if(!isValidObjectId(bookId)) return res.status(400).send({Status:false, message:"Invalid bookId in the body"})
    if(!valid.invalidInput(reviewedBy)) return res.status(400).send({Status:false, message:"Invalid reviewer's name"})
    if(!valid.isValidDate(reviewedAt)) return res.status(400).send({Status:false, Message:"Invalid date format!  (valid format : YYYY-MM-DD)"})
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

    let bookIdInParam = req.params.bookId;
    if(!isValidObjectId(bookIdInParam)) return res.status(400).send({Status:false, Message:"Invalid bookId in Param"})
    let reviewId=req.params.reviewId
    if(!isValidObjectId(reviewId)) return res.status(400).send({Status:false, Message:"Invalid reviewId in Param"})
    let reviewerData = req.body;
    if(!valid.isValidBody(reviewerData)) return res.status(400).send({Status:false, Message:"Please provide data inside body"})
    
    let bookToUpdate=await bookModel.findById({_id:bookIdInParam})
    if(!bookToUpdate || bookToUpdate.isDeleted==true) return res.status(404).send({Status:false, Message:"Book not found"})

    let reviewExist=await reviewModel.findById({_id:reviewId})
    if(!reviewExist || reviewExist.isDeleted==true) return res.status(404).send({Status:false, Message:"Review not found"})

    let {review, rating, reviewedBy}=reviewerData

    //====================== Checking the required updating data in body ================================
    if(!rating) return res.status(400).send({Status:false, Message:"Please provide rating inside the body"})
    if(!reviewedBy) return res.status(400).send({Status:false, Message:"Please provide reviewer's name inside the body"})



    //=============================== Checking validations for the body fields ============================
    if(!valid.isValidRating(rating)) return res.status(400).send({Status:false, Message:"Invalid ratings!... can be 1 to 5 only"})
    if(!valid.invalidInput(reviewedBy)) return res.status(400).send({Status:false, message:"Invalid reviewer's name"})



    let rev=await reviewModel.findByIdAndUpdate({_id : reviewId}, {$set : reviewerData}, {new:true})

    let objectBook={}
    objectBook.bookUpdated=bookToUpdate
    objectBook.reviewUpdated=rev

    res.status(200).send({Message:true, Message:"Success", Data:objectBook})

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =-----========================================deleteApi=======================================================================

const deleteReview = async function (req, res) {
  try {
    let bookIdInParam = req.params.bookId;
    if(!isValidObjectId(bookIdInParam)) return res.status(400).send({Status:false, Message:"Invalid bookId in Param"})
    let reviewId=req.params.reviewId
    if(!isValidObjectId(reviewId)) return res.status(400).send({Status:false, Message:"Invalid reviewId in Param"})
    
    let reviewExist=await reviewModel.findById({_id:reviewId})
    if(!reviewExist || reviewExist.isDeleted==true) return res.status(404).send({Status:false, Message:"Review not found"})
    
    let bookToUpdate=await bookModel.findById({_id:bookIdInParam})
    if(!bookToUpdate || bookToUpdate.isDeleted==true) return res.status(404).send({Status:false, Message:"Book not found"})

    await reviewModel.findByIdAndUpdate({_id:reviewId}, {$set:{isDeleted:true}},{new:true})
    
    await bookModel.findByIdAndUpdate({_id:bookIdInParam}, {$inc:{reviews:-1}},{new:true})
    
    return res.status(200).send({Status:true, Message:"Review deleted successfully"})
  
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;