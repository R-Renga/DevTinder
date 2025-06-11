const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
    firstName : {
        type: String,
        required:true,
        minlength:4,
        maxlength:20
    },
    lastName : {
        type : String,
        required:true
    },
    age :{
        type:Number
    },
    emailID :{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("not a valid email")
            }
        }
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("gender is not valid")
            }
        }
    },
    password:{
        type:String
    },
    photourl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNNuTRmqexAWygTFKwsCeIfD8gu19RTLjJXw&s"
    },
    skills:{
        type:[String]
    },
    premium:{
        type:Boolean,
        default:false
    },
    memberShipType:{
        type:String
    },
},{
    timestamps:true
},);

userSchema.methods.getJwt = async function(){
   const user = this;
   console.log(this,"thisobejct");

    const decoded = await jwt.sign({
        id: user._id
    },process.env.JWT_SECRET,{expiresIn:"1h"});

    return decoded;
}


module.exports = mongoose.model("User",userSchema);