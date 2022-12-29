const mongoose = require("mongoose");
const express = require("express");
const route = require("./src/routes/route");
const app = express();
const multer=require('multer')

app.use(express.json());
app.use(multer().any())

mongoose
  .connect(
    "mongodb+srv://yashwantr_14:Yashu_1410@cluster0.uic9809.mongodb.net/Project-Book_Management",
    { useNewUrlParser: true }
  )

  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(3000, function () {
  console.log("Express port is running on " + 3000);
});
