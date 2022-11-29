//===============================>> String Validation <<==================================>>>

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

  //isValidBody
const isValidBody = (data) => {
  if (Object.keys(data).length > 0)
      return true
  return false
};


//name
const isValidTitle = (name) => {
  const nm = name.trim()
  const regex =/^[a-z" "A-Z]+(([',. -][a-z" "A-Z ])?[a-z" "A-Z])$/.test(nm)
  return regex
}


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false;

  if (typeof value === 'string' && value.trim().length === 0) return false

  return true;
}
const validateISBN = function (ISBN) {
  //var re = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/ ;
  var re = /^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;  
  return re.test(ISBN.trim())
};
  
  module.exports = { isValid, isValidEmail, isValidPhone, isValidPassword,validateISBN,isValidTitle,isValidBody };
