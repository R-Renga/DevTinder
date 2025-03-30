const express = require('express');
const {auth} = require('./middleware/auth')
const app = express();



app.use("/admin",auth)

app.get("/admin/alldata", (req, res) => {

    res.send("all data send")
});

app.delete("/admin/deletingData", (req, res) => {
    res.send("data deleted")
})



app.listen(7777, () => {
    console.log("server running port 7777")
})