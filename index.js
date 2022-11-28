const mongoose = require("mongoose")
const express = require("express")
const route = require("./src/routes/route")
const app = express()
app.use(express.json())
mongoose.connect("mongodb+srv://group22:1234@group22databse.uvtoalh.mongodb.net/group28Database",
{newUrlParser:true})

.then(() => console.log(" MongoDB is connected"))
.catch(err => console.log(err))

app.use("/", route)

app.listen(3000, function(){
    console.log("Express port is running on"), 3000})