const bcrypt = require("bcrypt");
const {
  validate
} = require("../utilis/validation");
const User = require("../models/user");
const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validate(req.body);
    const {
      firstName,
      lastName,
      password,
      emailID,
      age,
      gender
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailID,
      age,
      gender,
    });
    const savedUser = await user.save();
    const decoded = await savedUser.getJwt();
    console.log(decoded, "decoded");
    res.cookie("token", decoded, {
      httpOnly: true,
      secure: false, // Only send over HTTPS
      sameSite: "lax", // Needed for cross-site cookies
      maxAge: 1 * 60 * 60 * 1000
    });
    res.json({
      data:savedUser,
      message:"user added successfully"
    })
  } catch (error) {
    console.log("error record", error);
    res.status(400).send("error message" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const {
      emailID,
      password
    } = req.body;

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
      res.cookie("token", decoded, {
        httpOnly: true,
        secure: false, // Only send over HTTPS
        sameSite: "lax", // Needed for cross-site cookies
        maxAge: 1 * 60 * 60 * 1000
      });
      res.send(user);
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
    expires: new Date(Date.now()),  // expire it immediately
    httpOnly: true,                 // recommended for security
    secure: true,                   // recommended for production (HTTPS)
    sameSite: "strict"              // adjust as needed
  });
  res.send("Logout Successful");
});

module.exports = authRouter;