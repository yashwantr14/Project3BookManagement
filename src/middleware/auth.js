const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const userController = require('../controllers/userController')
const bookModel = require("../models/bookModel")

const authentication =  (req,res,next)=>{
    try {
        const checkToken = req.headers["x-api-key"]|| req.headers['X-API-KEY']
            if(!checkToken) return res.status(400).send({status:false, message:"Token must be present inside the header"})
    
       let verifyToken = jwt.verify(checkToken, "Secret-Key",function(err,verifyToken){
            if(err) {
                return res.status(401).send({status: false,message:"You're not authenticated"})}
                else {
                req.identity= verifyToken.userId
                next()
            }
        })}
       
    catch(err){
        res.status(500).send({status:false, message: err.message})}
}

const authorisation = async (req,res,next) => {
    // let requestedUserId = req.params.userId || req.query.userId
    let userId = req.body.userId
    let bookId = req.params.bookId
    if(bookId){
        const verifyBookId = await bookModel.findById({_id:bookId})
        let requestedUserId = verifyBookId.userId
        if(requestedUserId != req.identity) return res.status(403).send({status:false, message:"You're unauthorized to do this "})
    }
    if(userId != req.identity) return res.status(403).send({status:false, message:"You're unauthorized to do this "})
    // if(!isValidObjectId(bookId)) return res.status(400).send({status:false, message:"Invalid ObjectId"})
    next()
}
module.exports.authentication = authentication
module.exports.authorisation = authorisation