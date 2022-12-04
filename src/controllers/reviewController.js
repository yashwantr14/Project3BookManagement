const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const moment = require("moment")
const { isValidBody, isValid, isValidDate, isValidRating, isValidName } = require("../validator/validator");
const { isValidObjectId } = require("mongoose");


const createReview = async function(req, res){
  try{
  let bookId = req.params.bookId
  if(!isValidObjectId(bookId))
  return res.status(400).send({status: false, message:  " please provide valid bookId"})

  let checkId = await bookModel.findById(bookId)
  if(!checkId) return res.status(404).send({status: false, message : "book not found"} )
  if(checkId.isDeleted==true){
      return res.status(404).send({status: false, message: "book is already deleted"})
  }
  let data= req.body
  let {  reviewedBy, reviewedAt, rating, isDeleted, review } = data

  let Obj={}

      if (!isValidBody(data)) {
          return res.status(400).send({ status: false, message: "please provide some data to create review" })
      } 
       Obj.bookId=bookId
       
       
      if(reviewedBy){
          if (!isValid(reviewedBy)) {
              return res.status(400).send({ status: false, message: "reviewers name is in proper format" })
          }
           if(!isValidName(reviewedBy))
           return res.status(400).send({ status: false, message: "reviewers name is invalid" })
         
              Obj.reviewedBy=reviewedBy
      }else{
          Obj.reviewedBy="Guest"
      }
      let today = moment().format("YYYY-MM-DD, hh:mm:ss a");
      if (!reviewedAt) {
          Obj.reviewedAt= today
  }
  if (!rating) {
      return res.status(400).send({ status: false, message: "rating is required" })
  }
  if (rating){

  if(!(typeof rating ==="number")){
    return res.status(400).send({status:false, message:"rating should be a number"})
  }
    if (!isValidRating(rating))
    return res.status(400).send({status:false, message:"rating should be between 1 to 5"})
    }

  
  Obj.rating=rating

    Obj.review=review

  if (isDeleted == true) {
      return res.status(400).send({ status: false, message: "you are deleting your data on the time of creation" })
  }
  Obj.isDeleted=isDeleted
  const reviewCreate = await reviewModel.create(Obj)
  
 const addCount= await bookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:1}},  {new:true}).select({deletedAt:0})
  return res.status(201).send({ status: true, message: "review is successfully done", data: addCount, reviewCreate })

} catch (error) {
  return res.status(500).send({ status: false, message: error.message })
}

}
// -------------------------------------updateReview-------------------------------------------------------------------------------------------------------------

const updateReview = async function (req, res) {
  try {

    let bookIdInParam = req.params.bookId;
    if(!isValidObjectId(bookIdInParam)) return res.status(400).send({Status:false, Message:"Invalid bookId in Param"})
    let reviewId=req.params.reviewId
    if(!isValidObjectId(reviewId)) return res.status(400).send({Status:false, Message:"Invalid reviewId in Param"})
    let reviewerData = req.body;
    if(!isValidBody(reviewerData)) return res.status(400).send({Status:false, Message:"Please provide data inside body"})
    
    let bookToUpdate=await bookModel.findById({_id:bookIdInParam})
    if(!bookToUpdate || bookToUpdate.isDeleted==true) return res.status(404).send({Status:false, Message:"Book not found"})

    let reviewExist=await reviewModel.findById({_id:reviewId})
    if(!reviewExist || reviewExist.isDeleted==true) return res.status(404).send({Status:false, Message:"Review not found"})

    let {review, rating, reviewedBy}=reviewerData

    //====================== Checking the required updating data in body ================================
    if(!rating) return res.status(400).send({Status:false, Message:"Please provide rating inside the body"})
    if(!reviewedBy) return res.status(400).send({Status:false, Message:"Please provide reviewer's name inside the body"})



    //=============================== Checking validations for the body fields ============================
    if(!isValidRating(rating)) return res.status(400).send({Status:false, Message:"Invalid ratings!... can be 1 to 5 only"})
    if(!isValid(reviewedBy)) return res.status(400).send({Status:false, message:"Invalid reviewer's name"})



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