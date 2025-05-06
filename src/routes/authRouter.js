const bcrypt = require("bcrypt");
const { validate } = require("../utilis/validation");
const User = require("../models/user");
const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validate(req.body);
    const { firstName, lastName, password, emailID, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailID,
      age,
      gender,
    });
    await user.save();
    res.send("user added successfully");
  } catch (error) {
    console.log("error record", error);
    res.status(400).send("error message" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({
      emailID: emailID,
    });

    if (!user) {
      throw new Error("error occured");
    }
    console.log(user, "user");
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      const decoded = await user.getJwt();
      console.log(decoded, "decoded");
      res.cookie("token", decoded, { maxAge: 1 * 60 * 60 * 1000 });
      res.send("login successful");
    } else {
      throw new Error("Invalid password");
    }
  } catch (error) {
    console.log("error record", error);
    res.status(400).send("error message" + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful");
});

module.exports = authRouter;
