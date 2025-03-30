const express = require('express');

const app = express();


app.use("/test",(req,res)=>{
    res.send("test from server")
});

app.get('/',(req,res)=>{
    res.send("firstname:Renga")
})

app.get('/use?r',(req,res)=>{
    res.send("firstname:Renga")
})

app.get('/use+r',(req,res)=>{
    res.send("firstname:Renga")
})

app.get('/use*r',(req,res)=>{
    res.send("firstname:Renga")
})

app.post('/user',(req,res)=>{
    res.send("firstname:vikram")
})

app.patch('/user',(req,res)=>{
    res.send("firstname:Renga")
})

app.delete('/user',(req,res)=>{
    res.send("firstname:Renga")
})



app.listen(7777,()=>{
    console.log("server running port 7777")
})