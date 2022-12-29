const express = require("express")
const router = express.Router()
const aws=require('aws-sdk')


const{createUser, loginUser }=require('../controllers/userController')
const{createBook, getBooks, bookById, deleteBook, updateBook}=require('../controllers/bookController')
const {createReview,updateReview,deleteReview} = require("../controllers/reviewController")
const {authorisation, authentication} = require("../middleware/auth")
//****************************** User API's ***************************************/
router.post("/register",createUser)
router.post("/login",loginUser)

//********************************** Book API's ***************************************/

router.post('/books',authentication,authorisation,createBook)
router.get("/getBooks", authentication,getBooks)
router.get("/books/:bookId",authentication,bookById)
router.put("/books/:bookId",authentication,authorisation,updateBook)
router.delete("/books/:bookId",authentication,authorisation,deleteBook)

//************************************** Review API's *************************************/
router.post("/books/:bookId/review", createReview)
router.put("/books/:bookId/review/:reviewId",updateReview)
router.delete("/books/:bookId/review/:reviewId",deleteReview)


aws.config.update({
  accessKeyId: "AKIAY3L35MCRZNIRGT6N",
  secretAccessKey: "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",
  region:"ap-south-1"
})  

let uploadFile = async (file) =>{
  return new Promise (function(resolve,reject){
    let s3 = new aws.S3({apiVersion:"2006-03-01"});

    var uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket",
      Key: "abc/" + file.originalname,
      Body: file.buffer
    }

    s3.upload(uploadParams , function(err,data){
      if(err) {
        return reject({"error": err})
      }
      console.log(data)
      console.log("file uploaded successfully")
      return resolve(data.Location)
    })

  })
}



const bookCover = async function(req,res){
  try {
    let files = req.files
    
    if(files && files.length >0){
      let uploadFileUrl =await uploadFile(files[0])
      req.bookCover = uploadFileUrl
      res.status(201).send({msg: "file uploaded successfully", data: uploadFileUrl})
    }
    else{
      res.status(400).send({msg:"No file found"})
    }
  } catch (err) {
    res.status(500).send({msg:err})
  }
}

router.post("/write-file-aws", bookCover)

/***************************** Path not match**************************************/
router.all("/*", async function (req, res) { return res.status(404).send({ status: false, message: "Page Not Found" })});

module.exports = router