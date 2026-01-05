const crypto = require("crypto");

class TwoFactorAuthHandler {
    constructor() {
        this.twoFactorMap = new Map();
    }

    getMap() {
        return this.twoFactorMap;
    }

    get(twoFactorId) {
        return this.twoFactorMap.get(twoFactorId);
    }

    exists(twoFactorId) {
        return this.twoFactorMap.has(twoFactorId);
    }

    isExpired(twoFactorId) {
        const twoFactor = this.get(twoFactorId);
        return twoFactor.expiresAt < Date.now();
    }

    isTooManyAttempts(twoFactorId) {
        const twoFactor = this.get(twoFactorId);
        return twoFactor.tries >= 3;
    }

    isCodeValid(twoFactorId, code) {
        const twoFactor = this.get(twoFactorId);
        return Number(twoFactor?.code) === Number(code);
    }

    incrementAttempts(twoFactorId) {
        const twoFactor = this.get(twoFactorId);
        twoFactor.tries++;
    }

    delete(twoFactorId) {
        this.twoFactorMap.delete(twoFactorId);
    }

    generate2FACode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    generateUUID() {
        return crypto.randomUUID();
    }

    setObject(twoFactorId, { email, code, tries, expiresAt }) {
        this.twoFactorMap.set(twoFactorId, { email, code, tries, expiresAt });
    }

}

module.exports = TwoFactorAuthHandler;
