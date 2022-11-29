const userModel = require('../models/userModel')
const { isValidEmail, isValid, isValidPhone,isValidPassword } = require("../validator/validator")


const createUser = async function(req,res){
    try {
        let data = req.body
        const {title,name,phone,email,password,address} = data
        if(Object.keys(data).length == 0){res.status(404).send({status:false,message:"Data not found"})}
        if(!title){res.status(400).send({status:false,message:"Please provide the title"})}
        let titles = ["Mr", "Mrs", "Miss"];
        if (!titles.includes(title)) return res.status(400).send({ status: false,msg: "Please Provide valid title from :  Mr || Mrs || Miss" });

        if(!name){res.status(400).send({status:false,message:"Please provide the name"})}
        if (!isValid(name)) return res.status(400).send({ status: false, msg: "please provide the valid name" })

        if(!phone){res.status(400).send({status:false,message:"Please provide the phone number"})}
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, msg: "please provide the valid phone number" })

        if(!email){res.status(400).send({status:false,message:"Please provide the email"})}
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "please provide valid email" })
        const findEmail = await userModel.findOne({ email: email });
        if (findEmail) return res.status(400).send({ status: false, message: "Enter Unique email Id" });

        if(!password){res.status(400).send({status:false,message:"Please provide the passsord"})}
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: " please provide valid password" });

        if(!address){res.status(400).send({status:false,message:"Please provide the address"})}
       // if (!isValid(address)) return res.status(400).send({ status: false, msg: "please provide the valid address" })

        

       const created  = await userModel.create(data)
       return res.status(201).send({status:true , message:created})

    } catch (error) {
        return res.status(500).send({status:false , message:error.message})
    }
}

module.exports.createUser = createUser