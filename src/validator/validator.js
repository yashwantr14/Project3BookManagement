const { mongoose } = require("mongoose");

//================================================Empty Body Validation=============================================================================================================
const isValidBody = (data) => {
  if (Object.keys(data).length > 0) {
    return true;
  }
  return false;
};
//==============================================String Validation===========================================================================================================================

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value !== "string") return false;
  return true;
};
//=================================================Name validation========================================================================================
const isValidName = (value) => {
  const regex = /^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ])$/.test(value);
  return regex;
};


//===============================================Email Validation=========================================================================================================================

const isValidEmail = function (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};
//===============================================Mobile Validation========================================================================================================================

const isValidPhone = function (phone) {
  return /^([+]\d{2})?\d{10}$/.test(phone);
};

//===============================================Password Validation===========================================================================================================================

const isValidPassword = function (pwd) {
  let passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W]).{8,15}$/;

  if (passwordRegex.test(pwd)) {
    return true;
  } else {
    return false;
  }
};

//================================================Title Validation===================================================================================================================
const isValidTitle = (name) => {
  const nm = name.trim();
  const regex = /^[a-z" "A-Z]+(([',. -][a-z" "A-Z ])?[a-z" "A-Z])$/.test(nm);
  return regex;
};
//================================================ISBN Validation===================================================================================================================
const validateISBN = function (ISBN) {
  //var re = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/ ;
  var re =
    /^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;
  return re.test(ISBN.trim());
};

//================================================Pincode Validation===================================================================================================================

const isValidPinCode = function (pinCode) {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.test(pinCode);
};
//================================================Date Validation===================================================================================================================
const isValidDate = function (date) {
  let dateReg = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/gm;
  return dateReg.test(date);
};
//================================================Rating Validation===================================================================================================================
const isValidRating = function(rating){
  let ratingReg= /^([1-5]|1[05])$/
  return ratingReg.test(rating)
}

module.exports = {
  isValidBody,
  isValid,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidTitle,
  validateISBN,
  isValidPinCode,
  isValidDate,
  isValidRating
}
