const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: '.env.local' });
const app = express();
const PORT = process.env.PORT || 4000;
const authRouter = require("./modules/auth/auth.router");
const ErrorHandler = require("./shared/ErrorHandler.class");
const errorMiddleware = require("./middlewares/error.middleware");

// middlewares
app.use(cors({ origin: [process.env.FRONTEND_URL, "http://localhost:3000"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use(errorMiddleware)

const connect = async (next) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`[Server] ✅ Server running on port ${PORT}`);
        })
    } catch (err) {
        return next(ErrorHandler.throw("🚫 Failed to connect to MongoDB", 500, "Database", err));
    }
}

connect();