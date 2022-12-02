const express = require("express")
const router = express.Router()

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
/***************************** Path not match**************************************/
router.all("/*", async function (req, res) { return res.status(404).send({ status: false, message: "Page Not Found" })});

  module.exports = router