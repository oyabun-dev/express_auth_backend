const crypto = require("crypto");

class TwoFactorAuthHandler {
    constructor(twoFaCodes) {
        this.twoFaCodes = twoFaCodes;
    }

    get(twoFaId) {
        return this.twoFaCodes.get(twoFaId);
    }

    exists(twoFaId) {
        return this.twoFaCodes.has(twoFaId);
    }

    isExpired(twoFaId) {
        const twoFa = this.get(twoFaId);
        return twoFa.expiresAt < Date.now();
    }

    isTooManyAttempts(twoFaId) {
        const twoFa = this.get(twoFaId);
        return twoFa.tries >= 3;
    }

    isCodeValid(twoFaId, code) {
        const twoFa = this.get(twoFaId);
        return Number(twoFa?.code) === Number(code);
    }

    incrementAttempts(twoFaId) {
        const twoFa = this.get(twoFaId);
        twoFa.tries++;
    }

    delete(twoFaId) {
        this.twoFaCodes.delete(twoFaId);
    }

    generate2FACode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    generateUUID() {
        return crypto.randomUUID();
    }
}

module.exports = TwoFactorAuthHandler;
