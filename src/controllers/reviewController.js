const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

const createReview = async (req,res)=>{
    try {
        let bookId = req.params.bookId
        let reviewerData = req.body
        let {review,reviewedAt,reviewedBy,rating} = reviewerData
        
        const findBook = await bookModel.findById({_id:bookId, isDeleted:false})
        if(!findBook) return res.status(400).send({status:false,message:"This book is not available"})
        
        const createReviews = await reviewModel.create(reviewerData)
        if(Object.keys(createReviews).length !== 0 ){
            const updateReviewCount = await bookModel.updateOne({_id:bookId},{$inc:{review:+1}},{new:true})
        }
        return res.status(201).send({status:true, message:"review created successfully", data:createReviews}) 
    } catch (err) {
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports.createReview = createReview