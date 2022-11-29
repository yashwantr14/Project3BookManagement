const mongoose = require("mongoose")
const express = require("express")
const route = require("./src/routes/route")
const app = express()
app.use(express.json())
mongoose.connect("mongodb+srv://chanda:QYho3EZNKLny4znA@cluster0.gkrjc46.mongodb.net/faizan",
{useNewUrlParser: true})

.then(() => console.log(" MongoDB is connected"))
.catch(err => console.log(err))

app.use("/", route)

app.listen(3000, function(){
    console.log("Express port is running on"), 3000})