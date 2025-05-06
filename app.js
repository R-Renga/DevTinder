const express = require("express");
const connectDB = require("./src/config/database");
const app = express();
const cookies = require("cookie-parser");
const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const requestRouter = require("./src/routes/request");
app.use(express.json());
app.use(cookies());



app.use("/",authRouter);
app.use("/",profileRouter)
app.use("/",requestRouter)


connectDB()
    .then(() => {
        console.log("database are connected");
        app.listen(7777, () => {
            console.log("server running port 7777");
        });
    })
    .catch((err) => {
        console.log("error on server", err);
    });