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



module.exports = {
    validate
}
