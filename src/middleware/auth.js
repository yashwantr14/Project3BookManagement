const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const userController = require('../controllers/userController')
const bookModel = require("../models/bookModel")

const authentication = async (req,res,next)=>{
    try {
        const checkToken = req.headers['x-api-key'] || req.headers['X-API-KEY']
        if(!checkToken) return res.status(400).send({status:false, message:"Token must be present inside the header"})

        const verifyToken = jwt.verify(checkToken,'Secret-Key')
        if(!verifyToken) return res.status(401).send({status:false, message:"Invalid token, you are not authenticated!"})
        req.identity = verifyToken.userId
        next()
    } catch (err) {
        return res.status(500).send({status:false, message:err.message})       
    }
}

const authorization = async (req,res,next) => {
    // let requestedUserId = req.params.userId || req.query.userId
    let bookId = req.params.bookId
    if(!isValidObjectId(bookId)) return res.status(400).send({status:false, message:"Invalid ObjectId"})
    const verifyBookId = await bookModel.findById({_id:bookId})
    let requestedUserId = verifyBookId.userId
    if(requestedUserId != req.identity) return res.status(403).send({status:false, message:"You're unauthorized to do this "})
    next()
}
module.exports.authentication = authentication
module.exports.authorization = authorization