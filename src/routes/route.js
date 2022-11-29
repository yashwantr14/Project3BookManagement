const express = require("express")
const router = express.Router()

const{createUser }=require('../controllers/userController')
const{createBook}=require('../controllers/bookController')


router.post("/register",createUser)
router.post('/books',createBook)

/***************************** Path not match**************************************/
router.all("/*", async function (req, res) {
    return res.status(404).send({ status: false, message: "Page Not Found" });
  });

  

  module.exports = router