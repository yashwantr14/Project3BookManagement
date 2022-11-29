const {mongoose} = require('mongoose')

//===============================>> String Validation <<==================================>>>
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

  //================================>> Email Validation <<===================================>>>

const isValidEmail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
//===============================>> Mobile Validation <<====================================>>>

const isValidPhone = function (phone) {
    return /^([+]\d{2})?\d{10}$/.test(phone);
}


//===============================>> Password Validation <<====================================>>>

const isValidPassword = function (pwd) {
    let passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
  
    if (passwordRegex.test(pwd)) {
      return true;
    } else {
      return false;
    }
  };

//===============================>> Pincode Validation <<====================================>>>

const isValidPinCode = function (pinCode) {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.test(pinCode);
};
  
  module.exports = { isValid, isValidEmail, isValidPhone, isValidPassword,isValidPinCode };
