const validator = require("validator");

const validate = (data) => {
  const { firstName, lastName, emailID, password } = data;

  if (firstName === "" || lastName === "") {
    throw new Error("invalid firstname and lastname");
  } else if (!validator.isEmail(emailID)) {
    throw new Error("mail is not valid");
  } 
//   else if (!validator.isStrongPassword(password)) {
//     throw new Error("password was not strong");
//   }
};

const validateEditProfileData = (req) => {
  const allowedField = ["firstName","lastName"] 
  const profileEditAllowed = Object.keys(req.body).every((field)=> allowedField.includes(field))
  return profileEditAllowed;
}


module.exports = {
    validate,
    validateEditProfileData
}
