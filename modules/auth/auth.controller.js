const mongoose = require("mongoose");
const User = require("../../models/user.model");
require("dotenv").config({ path: '.env.local' });


const ErrorHandler = require("../../shared/ErrorHandler.class");
const TwoFactorAuthHandler = require("../../shared/TwoFactorAuthHandler.class");
const Encrypter = require("../../shared/Encrypter.class");

const twoFactorService = new TwoFactorAuthHandler();

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

        const code = twoFactorService.generate2FACode();
        const twoFactorId = twoFactorService.generateUUID();
        const twoFactorObject = { id: twoFactorId, email: email, code: code, tries: 0, expiresAt: Date.now() + 60 * 1000 };

        twoFactorService.setObject(twoFactorId, twoFactorObject);

        console.log("[Login] 2FA code generated successfully", twoFactorObject.code);
        return res.status(200).json({ message: "2FA code generated successfully", id: twoFactorId });

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
    const { code, twoFactorId } = req.body;

    if (!twoFactorService.exists(twoFactorId)) {
        ErrorHandler.throw("👀 2FA code not found", 404, "Verify2FA", null);
    }

    if (twoFactorService.isExpired(twoFactorId)) {
        twoFactorService.delete(twoFactorId);
        ErrorHandler.throw("⌛️ 2FA code expired", 400, "Verify2FA", null);
    }

    if (twoFactorService.isTooManyAttempts(twoFactorId)) {
        twoFactorService.delete(twoFactorId);
        ErrorHandler.throw("🚫 Too many attempts", 400, "Verify2FA", null);
    }

    if (!twoFactorService.isCodeValid(twoFactorId, code)) {
        twoFactorService.incrementAttempts(twoFactorId);
        ErrorHandler.throw("🚫 Invalid 2FA code", 400, "Verify2FA", null);
    }

    twoFactorService.delete(twoFactorId);

    console.log("[Verify2FA] 2FA code verified successfully");
    return res.status(200).json({ message: "2FA code verified successfully" });

}


const authController = {
    login,
    register,
    verify2FA
}

module.exports = authController
