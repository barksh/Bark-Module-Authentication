"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTwoFactorURL = exports.verifyTwoFactorCode = exports.generateTwoFactorCode = exports.generateTwoFactorKey = void 0;
const SpeakEasy = require("speakeasy");
const generateTwoFactorKey = () => {
    const secret = SpeakEasy.generateSecret({ length: 32 });
    return secret.base32;
};
exports.generateTwoFactorKey = generateTwoFactorKey;
const generateTwoFactorCode = (key) => {
    return SpeakEasy.totp({
        secret: key,
        encoding: 'base32',
    });
};
exports.generateTwoFactorCode = generateTwoFactorCode;
const verifyTwoFactorCode = (key, code) => {
    return SpeakEasy.totp.verify({
        secret: key,
        encoding: 'base32',
        token: code,
    });
};
exports.verifyTwoFactorCode = verifyTwoFactorCode;
const generateTwoFactorURL = (name, account, key) => {
    const parsedName = encodeURIComponent(name);
    const parsedAccount = encodeURIComponent(account);
    return 'otpauth://totp/' + parsedAccount + '?issuer=' + parsedName + '&secret=' + key;
};
exports.generateTwoFactorURL = generateTwoFactorURL;
