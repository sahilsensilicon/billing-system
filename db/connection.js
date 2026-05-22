require("dotenv").config();

const mongoose = require("mongoose");

const mongoURI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 30000
})
.then(() => {
    console.log("MongoDB connected!");
})
.catch((error) => {
    console.log(error);
});