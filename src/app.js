const express = require('express');

const app = express();


app.use("/test",(req,res)=>{
    res.send("test from server")
});

app.use('/hello',(req,res)=>{
    res.send("hello from server")
});



app.listen(7777,()=>{
    console.log("server running port 7777")
})