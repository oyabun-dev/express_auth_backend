const User = require("../../models/user.model");
require("dotenv").config({ path: '.env.local' });


const ErrorHandler = require("../../shared/ErrorHandler.class");
const TwoFactorAuthHandler = require("../../shared/TwoFactorAuthHandler.class");
const Encrypter = require("../../shared/Encrypter.class");
const errorMiddleware = require("../../middlewares/error.middleware");

const twoFactorService = new TwoFactorAuthHandler();

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(ErrorHandler.create("Invalid email", 404, "Login", null));
        }

        const isPasswordValid = Encrypter.compare(password, user.password);

        if (!isPasswordValid) {
            return next(ErrorHandler.create("Invalid password", 401, "Login", null));
        }

        const code = twoFactorService.generate2FACode();
        const twoFactorId = twoFactorService.generateUUID();
        const twoFactorObject = { id: twoFactorId, email: email, code: code, tries: 0, expiresAt: Date.now() + 60 * 1000 };

        twoFactorService.setObject(twoFactorId, twoFactorObject);

        console.log("[Login] 2FA code generated successfully", twoFactorObject.code);
        return res.status(200).json({ message: "2FA code generated successfully", id: twoFactorId });

    } catch (err) {
        if (err instanceof ErrorHandler) {
            return next(err);
        }
        return next(ErrorHandler.create("🗄️ Internal Server Error", 500, "Login", err));
    }
}


const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(ErrorHandler.create("User already exists", 409, "Register", null));
        }

        const hashedPassword = Encrypter.hash(password);

        const user = new User({ fullName, email, password: hashedPassword });
        user.save();

        console.log("[Register] User created successfully");
        return res.status(200).json({ message: "User created successfully", user });

    } catch (err) {
        if (err instanceof ErrorHandler) {
            return next(err);
        }
        return next(ErrorHandler.create("🗄️ Internal Server Error", 500, "Register", err));
    }
}


const verify2FA = async (req, res, next) => {
    const { code, twoFactorId } = req.body;

    if (!twoFactorService.exists(twoFactorId)) {
        return next(ErrorHandler.create("👀 2FA code not found", 404, "Verify2FA", null));
    }

    if (twoFactorService.isExpired(twoFactorId)) {
        twoFactorService.delete(twoFactorId);
        return next(ErrorHandler.create("⌛️ 2FA code expired", 400, "Verify2FA", null));
    }

    if (twoFactorService.isTooManyAttempts(twoFactorId)) {
        twoFactorService.delete(twoFactorId);
        return next(ErrorHandler.create("🚫 Too many attempts", 400, "Verify2FA", null));
    }

    if (!twoFactorService.isCodeValid(twoFactorId, code)) {
        twoFactorService.incrementAttempts(twoFactorId);
        return next(ErrorHandler.create("🚫 Invalid 2FA code", 400, "Verify2FA", null));
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
