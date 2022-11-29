const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController");

//
router.post("/createUser",userController.createUser)

/***************************** Path not match**************************************/
router.all("/*", async function (req, res) {
    return res.status(404).send({ status: false, message: "Page Not Found" });
  });

  module.exports = router