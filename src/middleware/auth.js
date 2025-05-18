const jwt = require("jsonwebtoken");
const User = require('../models/user')

const auth = (req, res,next) => {
    console.log("auth check");
    const token = "xyz";
    const isAuthorized = token === "xyz";

    if (!isAuthorized) {
        res.status(401).send("not authorized")
    } else {
        next()
    }
}


const authCheck = async (req,res,next) =>{
    try {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("unauthorized")
    }
    const passVerify = await jwt.verify(token, "Renga@123");
    const {id} = passVerify;
    const user = await User.findById(id)
    if(!user){
        throw new Error("error occured")
    }else{
        req.user = user
        next()
    }
    } catch (error) {
    console.log("error record", error);
    res.status(401).send("error message" + error.message);
    }
    

}
module.exports = {auth,authCheck}