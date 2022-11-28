//===============================>> String Validation <<==================================>>>
const isValid = function (value) {
    return (typeof value === "string" &&  value.trim().length > 0 && value.match(/^[\D]+$/)) 
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
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
  
    if (passwordRegex.test(pwd)) {
      return true;
    } else {
      return false;
    }
  };
  
  module.exports = { isValid, isValidEmail, isValidPhone, isValidPassword };
