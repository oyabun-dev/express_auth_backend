const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: '.env.local' });
const mongoUri = process.env.MONGODB_URI;

const ErrorHandler = require("../shared/ErrorHandler.class");
const TwoFactorAuthHandler = require("../shared/TwoFactorAuthHandler.class");
const Encrypter = require("../shared/Encrypter.class");

const connect = async () => {
    try {
        await mongoose.connect(mongoUri);
    } catch (err) {
        ErrorHandler.throw("🚫 Failed to connect to MongoDB", 500, "Database", err);
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            ErrorHandler.throw("🥷🏽 User not found", 404, "Login", null);
        }

        const isPasswordValid = Encrypter.compare(password, user.password);

        if (!isPasswordValid) {
            ErrorHandler.throw("🔐 Invalid password", 401, "Login", null);
        }

        const code = TwoFactorAuthHandler.generate2FACode();
        const twoFaId = TwoFactorAuthHandler.generateUUID();

        twoFaCodes.set(twoFaId, { email: email, code: code, tries: 0, expiresAt: Date.now() + 60 * 1000 });

        console.log("[Login] 2FA code generated successfully");
        return res.status(200).json({ message: "2FA code generated successfully", id: twoFaId });

    } catch (err) {
        ErrorHandler.throw("🗄️ Internal Server Error", 500, "Login", err);
    }
}

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = Encrypter.hash(password);

        const user = new User({ fullName, email, password: hashedPassword });
        user.save();

        console.log("[Register] User created successfully");
        return res.status(200).json({ message: "User created successfully", user });

    } catch (error) {
        ErrorHandler.throw("🗄️ Internal Server Error", 500, "Register", error);
    }
}

const verify2FA = async (req, res) => {

    const { code, twoFaId } = req.body;

    if (!TwoFactorAuthHandler.exists(twoFaId)) {
        ErrorHandler.throw("👀 2FA code not found", 404, "Verify2FA", null);
    }

    if (TwoFactorAuthHandler.isExpired(twoFaId)) {
        TwoFactorAuthHandler.delete(twoFaId);
        ErrorHandler.throw("⌛️ 2FA code expired", 400, "Verify2FA", null);
    }

    if (TwoFactorAuthHandler.isTooManyAttempts(twoFaId)) {
        TwoFactorAuthHandler.delete(twoFaId);
        ErrorHandler.throw("🚫 Too many attempts", 400, "Verify2FA", null);
    }

    if (!TwoFactorAuthHandler.isCodeValid(twoFaId, code)) {
        TwoFactorAuthHandler.incrementAttempts(twoFaId);
        ErrorHandler.throw("🚫 Invalid 2FA code", 400, "Verify2FA", null);
    }

    TwoFactorAuthHandler.delete(twoFaId);

    console.log("[Verify2FA] 2FA code verified successfully");
    return res.status(200).json({ message: "2FA code verified successfully" });

}

const authController = {
    login,
    register,
    verify2FA
}

module.exports = authController
