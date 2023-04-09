"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPrivateKey = exports.encryptPrivateKey = exports.generateSecretKey = exports.generateInitVector = void 0;
const Crypto = require("crypto");
const generateInitVector = () => {
    return Crypto.randomBytes(16).toString("hex");
};
exports.generateInitVector = generateInitVector;
const generateSecretKey = () => {
    return Crypto.randomBytes(32).toString("hex");
};
exports.generateSecretKey = generateSecretKey;
const encryptPrivateKey = (privateKey, securityKey, initVector) => {
    const algorithm = "aes-256-cbc";
    const securityKeyBuffer = Buffer.from(securityKey, "hex");
    const initVectorBuffer = Buffer.from(initVector, "hex");
    const cipher = Crypto.createCipheriv(algorithm, securityKeyBuffer, initVectorBuffer);
    let encryptedData = cipher.update(privateKey, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
};
exports.encryptPrivateKey = encryptPrivateKey;
const decryptPrivateKey = (encryptedPrivateKey, securityKey, initVector) => {
    const algorithm = "aes-256-cbc";
    const securityKeyBuffer = Buffer.from(securityKey, "hex");
    const initVectorBuffer = Buffer.from(initVector, "hex");
    const decipher = Crypto.createDecipheriv(algorithm, securityKeyBuffer, initVectorBuffer);
    let decryptedData = decipher.update(encryptedPrivateKey, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
};
exports.decryptPrivateKey = decryptPrivateKey;
