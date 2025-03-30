const express = require("express");

const app = express();



app.get("/admin",(req,res)=>{
    throw new Error("errorr")
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("error occured")
    }
})


app.listen(7777, () => {
  console.log("server running port 7777");
});
