const userModel = require("../models/userModel")
const booksModel = require("../models/booksModel")
const{isValid,isValidTitle,isValidBody,validateISBN}=require('../validator/validator')
const {isValidObjectId}=require('mongoose')


const createBook = async function (req, res){

    try{
        const requestBody = req.body
       
        let { title, excerpt, userId, ISBN, category, subCategory, releasedAt } = requestBody
        if(!isValidBody(requestBody)){return res.status(400).send({status:false,message:"plz provide request body"})}
        if(!isValid(title)){return res.status(400).send({status:false,message:"plz provide title"})}
        if(!isValidTitle(title)){return res.status(400).send({status:false,message:"plz provide valid title"})}
        const titleUsed = await booksModel.findOne({ title: title })
        if (titleUsed){return res.status(400).send({ status: false, msg: "This title is already Used" })}
        if(!isValid(excerpt)){return res.status(400).send({status:false,message:"plz provide excerpt"})}
        if(!isValid(ISBN)){return res.status(400).send({status:false,message:"plz provide ISBN"})}
        if(!validateISBN(ISBN)){return res.status(400).send({status:false,message:"plz provide valid ISBN"})}
        const isISBNAlreadyUsed = await booksModel.findOne({ ISBN: ISBN })
        if (isISBNAlreadyUsed) {return res.status(400).send({ status: false, msg: "ISBN already register" })}
        if(!isValid(category)){return res.status(400).send({status:false,message:"plz provide category"})}
        if(!isValid(subCategory)){return res.status(400).send({status:false,message:"plz provide subCategory"})}
        if(!isValid(releasedAt)){return res.status(400).send({status:false,message:"plz provide realeasedAt"})}
        if(!isValidObjectId(userId)){return res.status(400).send({status:false,message:"plz provide valid userId"})}
        const validId = await userModel.findById({ _id: userId })
        if(!validId) {return res.status(400).send({ status: false, msg: "userId does not exist" })}
        const bookData = await booksModel.create({ title, excerpt, userId, ISBN, category, subCategory, releasedAt })
        return res.status(201).send({ status: true, msg: "created successfully", data: bookData })
    }
    catch(err){
        return res.status(500).send({status:false,messege:err.messege})}
}

module.exports={createBook}
    