const express = require("express")
const router = express.Router()

const{createUser }=require('../controllers/userController')
const{createBook, getBooks}=require('../controllers/bookController')

//****************************** Post API's ***************************************/
router.post("/register",createUser)
router.post('/books',createBook)

//********************************** GET API's *************************************/
router.get("/getBooks", getBooks)

/***************************** Path not match**************************************/
router.all("/*", async function (req, res) {
    return res.status(404).send({ status: false, message: "Page Not Found" });
  });

  module.exports = router