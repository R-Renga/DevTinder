const express = require("express");
const connectDB = require("./src/config/database");
const app = express();
const cookies = require("cookie-parser");
const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/userRoutes");
const cors = require("cors");
const premiumRouter = require("./src/routes/premium");
require('dotenv').config();
require("./src/utilis/cronjobs")

app.use(cors({
    origin:"http://13.60.88.118",
    credentials:true
}))
app.use(express.json());
app.use(cookies());



app.use("/",authRouter);
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter);
app.use("/",premiumRouter)


connectDB()
    .then(() => {
        console.log("database are connected");
        app.listen(process.env.PORT, () => {
            console.log("server running port 7777");
        });
    })
    .catch((err) => {
        console.log("error on server", err);
    });