const express = require("express");
const {
    authCheck
} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", authCheck, async (req, res) => {
    try {
        const loggedUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastname"])

        if (!connectionRequest) {
            throw new Error("failed to get resposne request");
        }

        res.status(200).json({
            status: "total request",
            data: connectionRequest,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});


userRouter.get("/user/connections", authCheck, async (req, res) => {
    try {
        const loggedUser = req.user;

        const connectRequests = await ConnectionRequest.find({
                $or: [{
                        toUserId: loggedUser._id,
                        status: "accepted"
                    },
                    {
                        fromUserId: loggedUser._id,
                        status: "accepted"
                    }
                ]
            })
            .populate("fromUserId", ["firstName", "lastname"])
            .populate("toUserId", ["firstName", "lastName"])

        const data = connectRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
                return row.toUserId
            } else {
                return row.fromUserId
            }
        })

        res.json({
            data
        })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})


userRouter.get("/feed", authCheck, async (req, res) => {
    try {
        const loggedUser = req.user;
        

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page-1)*limit

        const allConnections = await ConnectionRequest.find({
            $or: [{
                    fromUserId: loggedUser._id
                },
                {
                    toUserId: loggedUser._id
                },
            ]
        }).select("fromUserId toUserId")

        const allUniqueConnections = new Set();

        allConnections.map(req => {
            allUniqueConnections.add(req.fromUserId.toString())
            allUniqueConnections.add(req.toUserId.toString())
        })

        const allFeedUser = await User.find({
            $and: [{
                    _id: {
                        $nin: Array.from(allUniqueConnections)
                    }
                },
                {
                    _id: {
                        $ne: loggedUser._id
                    }
                }
            ]
        })
        .select("firstName lastName photourl")
        .skip(skip)
        .limit(limit)

        console.log(allUniqueConnections)
        res.status(200).json({
           data: allFeedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

module.exports = userRouter;