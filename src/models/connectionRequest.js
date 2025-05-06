const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["accepted","rejected","ignore","interested"],
            message:`{VALUE} is not a valid data`
        },
        required:true
    }
},{
    timestamps:true
})

connectionRequest.index({fromUserId:1,toUserId:1})

connectionRequest.pre("save",function(next){
    const connectionRequestData = this;
    if(connectionRequestData.fromUserId.equals(connectionRequestData.toUserId)){
        throw new Error("cannot send connection to yourself")
    }
    next()
})

module.exports =  mongoose.model("connectionRequest",connectionRequest)