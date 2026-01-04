const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: '.env.local' });
const app = express();
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;
const authRouter = require("./modules/auth.router");

const connect = async () => {

}

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    connect();
    console.log(`[Server] ✅ Server running on port ${PORT}`);
});

const twoFaCodes = new Map();


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/login", async (req, res) => {

});

app.post("/verify-2fa", (req, res) => {

});

// add a user
app.post("/register", (req, res) => {

});