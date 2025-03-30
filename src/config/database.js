const mongoose = require("mongoose");


const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rengaraja2608:0ihS3to19co9oAvv@namasterenga.twmnsxd.mongodb.net/devtinder"
  );
};

module.exports = connectDB;
