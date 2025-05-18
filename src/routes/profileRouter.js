const { authCheck } = require("../middleware/auth");
const express = require("express");
const { validateEditProfileData } = require("../utilis/validation");
const User = require("../models/user");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", authCheck, async (req, res) => {
  try {
    const data = req.user;
    res.send(data);
  } catch (error) {
    console.log("error record", error);
    res.status(401).send("error message" + error.message);
  }
});

profileRouter.patch("/profile/edit", authCheck, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("InvalidEdit");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach(
      (keys) => (loggedUser[keys] = req.body[keys])
    );
    loggedUser.save();
    res.json({
      message: "logged succesfully",
      data: loggedUser,
    });
  } catch (error) {
    console.log("error record", error);
    res.status(401).send("error message" + error.message);
  }
});

profileRouter.post("/profile/forgotPassword", async (req, res) => {
  try {
    const { emailID, password } = req.body;
    if (!emailID || !password) {
      return res.status(400).send("Email and password are required");
    }
    const user = await User.findOne({ emailID });
    if (!user) {
      return res.status(404).send("Email does not exist");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password updated successfully");
  } catch (error) {
    console.log("error record", error);
    res.status(400).send("Error message: " + error.message);
  }
});

module.exports = profileRouter;
