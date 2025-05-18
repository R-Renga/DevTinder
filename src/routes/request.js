const {
  authCheck
} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const User = require("../models/user");
const express = require("express");
const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId", authCheck, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status

    const allowedStatus = ["interested", "ignore"];

    if (!allowedStatus.includes(status)) {
      throw new Error("invalid status")
    }

    const checkUser = await User.findById(toUserId);

    if (!checkUser) {
      throw new Error("user not found")
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or: [{
          fromUserId,
          toUserId
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId
        }
      ]
    });

    if (existingConnection) {
      throw new Error("connection already exists")
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const data = await connectionRequest.save();
    res.json({
      message: "connection request successfully initiated",
      data
    })
  } catch (error) {
    res.status(400).json({
      error: "Error processing connection request",
      message: error.message,
    });
  }
});

requestRouter.post("/request/review/:status/:requestId", authCheck, async (req, res) => {
  try {
    const {
      status,
      requestId
    } = req.params;
    const loggedUser = req.user

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      throw new Error("invalid status")
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: "interested",
      toUserId: loggedUser._id
    })

    if (!connectionRequest) {
      throw new Error("invalid connection request")
    }

    connectionRequest.status = status;

    await connectionRequest.save();

    res.send("request accepted or rejected")

  } catch (error) {
    console.log(error, "error occured")
    res.status(400).json({
      error: "error processing in connection request"
    })
  }
});



module.exports = requestRouter;