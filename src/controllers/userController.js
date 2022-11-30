const userModel = require('../models/userModel')
const { isValidEmail, isValid, isValidPhone,isValidPassword ,isValidPinCode} = require("../validator/validator")


const createUser = async function(req,res){
    try {
        let data = req.body
        const {title,name,phone,email,password,address} = data
        if(Object.keys(data).length == 0){res.status(404).send({status:false,message:"Data not found"})}
        let { street, city, pincode } = data.address;

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

        if(!data.address) {
            return res.status(400).send({ status: false, msg: "Address must contain street, city and pincode"});
        }
        if(!isValid(street)) {
            return res.status(400).send({ status: false, msg: "street must be present"});
        }
        if(!isValid(city)) {
            return res.status(400).send({ status: false, msg: "city must be present"});
        }
        if(!isValid(pincode)) {
            return res.status(400).send({ status: false, msg: "pincode must pe present"});
        }
        if(!isValidPinCode(pincode)) {
            return res.status(400).send({ status: false, msg: "Pincode must contain 6 digits only"});
        }


       const created  = await userModel.create(data)
       return res.status(201).send({status:true , message:created})

    } catch (error) {
        return res.status(500).send({status:false , message:error.message})
    }
}
const loginUser = async (req,res)=>{
        try {
            let credentials = req.body
            let {email, password} = credentials
            if(Object.keys(credentials).length == 0){
                return res.status(400).send({status: false, message:"Please provide credentials"})
            }
            if(!email) return res.status(400).send({status:false,message:"Please provide email to login" })
            if(!password) return res.status(400).send({message:"Please provide password to login"})
            let credentialsCheck = await userModel.findOne({
                email:email,
                password:password
            })
            if(!credentialsCheck){
                return res.status(400).send({status:false, message:"No user found with this email or password"})
            }
            let token  = jwt.sign({
                id: credentialsCheck._id,
                email:credentialsCheck.email,
                password:credentialsCheck.password
            }, "Secret-Key",{expiresIn:"1h"})
            res.setHeader("x-api-key",token)
            return res.status(200).send({ status:true, message:"token generated succesfully"})
        } catch (err) {
            res.status(500).send({status:false, message:err.message})
        }
    }

module.exports.createUser = createUser
module.exports.loginUser = loginUser