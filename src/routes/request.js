const { authCheck } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const User = require("../models/user");
const express = require("express");
const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId", authCheck, async (req, res) => {
  try {
    const fromUserId = req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status

    const allowedStatus = ["interested","ignored"];

    if(!allowedStatus.includes(status)){
      throw new Error("invalid status")
    }

    const checkUser = await User.findById(toUserId);

    if(!checkUser){
      throw new Error("user not found")
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    });

    if(existingConnection){
      throw new Error("connection already exists")
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,toUserId,status
    })
    const data = await connectionRequest.save();
    res.json({
      message:"connection request successfully initiated",
      data
    })
  } catch (error) {
    res.status(400).json({
      error: "Error processing connection request",
      message: error.message,
    });
  }
});


module.exports = requestRouter;