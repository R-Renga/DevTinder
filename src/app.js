const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {
    validate
} = require("./utilis/validation");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const {
    authCheck
} = require("./middleware/auth")

app.use(express.json());
app.use(cookies());

app.post("/signup", async (req, res) => {
    try {
        validate(req.body);
        const {
            firstName,
            lastName,
            password,
            emailID,
            age,
            gender
        } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            password: passwordHash,
            emailID,
            age,
            gender,
        });
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.log("error record", error);
        res.status(400).send("error message" + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const {
            emailID,
            password
        } = req.body;

        const user = await User.findOne({
            emailID: emailID
        });

        if (!user) {
            throw new Error("error occured");
        }
        console.log(user,"userrrrrrrrrrrrrrrrrr");
        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
           const decoded = user.getJwt();
           console.log(decoded,"decoded");
            res.cookie("token", decoded,{maxAge: 1 * 60 * 60 * 1000});
            res.send("login successful");
        } else {
            throw new Error("Invalid password");
        }
    } catch (error) {
        console.log("error record", error);
        res.status(400).send("error message" + error.message);
    }
});

app.get("/profile", authCheck, async (req, res) => {
    try {

        const data = req.user
        res.send(data)
    } catch (error) {
        console.log("error record", error);
        res.status(400).send("error message" + error.message);
    }
});

//all record
app.get("/feed", async (req, res) => {
    try {
        const allRecords = await User.find({});
        if (allRecords === 0) {
            res.status(400).send("no records found");
        } else {
            res.status(200).send(allRecords);
        }
    } catch (error) {
        res.status(400).send("error on API");
    }
});

//feebbyMail - filter
app.get("/feedbyemail", async (req, res) => {
    try {
        const userMail = req.body.userEmail;
        console.log(userMail);
        const allRecords = await User.find({
            emailID: userMail
        });
        if (allRecords === 0) {
            res.status(400).send("no records found");
        } else {
            res.status(200).send(allRecords);
        }
    } catch (error) {
        res.status(400).send("error on API");
    }
});

//feedbyone

app.get("/feedbyone", async (req, res) => {
    try {
        const userMail = req.body.userEmail;
        console.log(userMail);
        const allRecords = await User.findOne({
            emailID: userMail
        });
        if (allRecords === 0) {
            res.status(400).send("no records found");
        } else {
            res.status(200).send(allRecords);
        }
    } catch (error) {
        res.status(400).send("error on API");
    }
});

//findByID

app.get("/feedbyID", async (req, res) => {
    try {
        const UserID = req.body.userID;
        console.log(UserID);
        const allRecords = await User.findById(UserID);
        if (allRecords === 0) {
            res.status(400).send("no records found");
        } else {
            res.status(200).send(allRecords);
        }
    } catch (error) {
        res.status(400).send("error on API");
    }
});

app.delete("/delete", async (req, res) => {
    try {
        const UserID = req.body.userID;
        console.log(UserID);
        const allRecords = await User.findByIdAndDelete(UserID);
        res.send("userdatadeletedsuccesfully");
    } catch (error) {
        res.status(400).send("error on API");
    }
});

app.patch("/update/:userID", async (req, res) => {
    try {
        const UserID = req.params.userID;
        const data = req.body;
        const restrictedFields = ["firstName", "lastName", "emailID"];
        const isAllowedUpdate = Object.keys(data).every(
            (k) => !restrictedFields.includes[k]
        );
        if (isAllowedUpdate) {
            throw new Error("these fields not alllowed to update");
        }
        console.log(UserID);
        const allRecords = await User.findByIdAndUpdate(UserID, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(allRecords);
        res.send("updated Successfully");
    } catch (error) {
        res.status(400).send("error on API " + error.message);
    }
});

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