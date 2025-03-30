const express = require("express");
const connectDB = require('./config/database')
const User = require("./models/user");
const app = express();



app.post("/signUp", async (req, res) => {

    try {
        const user = new User({
            firstName: "virat",
            lastName: "Kholi",
            age: 35,
            emailID: "virat@gmail.com",
            gender: "male",
            password: "1234abcde",
        });

        await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.log("error record", error);
        res.status(400).send("error message", error.message)
    }

});

connectDB()
    .then(() => {
        console.log("database are connected")
        app.listen(7777, () => {
            console.log("server running port 7777");
        });
    }).catch((err) => {
        console.log("error on server", err);
    })