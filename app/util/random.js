"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomKey = void 0;
const Crypto = require("crypto");
const generateRandomKey = () => {
    return Crypto.randomBytes(16).toString("hex");
};
exports.generateRandomKey = generateRandomKey;
