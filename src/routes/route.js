const express = require("express")
const router = express.Router()

const{createUser }=require('../controllers/userController')
const{createBook, getBooks, bookById, deleteBook, updateBook}=require('../controllers/bookController')
const {createReview} = require("../controllers/reviewController")

//****************************** Post API's ***************************************/
router.post("/register",createUser)
router.post('/books',createBook)
router.post("/books/:bookId/review", createReview)

//********************************** GET API's *************************************/
router.get("/getBooks", getBooks)
router.get("/books/:bookId",bookById)

//********************************** PUT API's ***************************************/
router.put("/books/:bookId",updateBook)

//************************************** DELETE API's *************************************/
router.delete("/books/:bookId",deleteBook)

/***************************** Path not match**************************************/
router.all("/*", async function (req, res) {
    return res.status(404).send({ status: false, message: "Page Not Found" });
  });

  module.exports = router