"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretModel = void 0;
const mongoose_1 = require("mongoose");
const SecretSchema = new mongoose_1.Schema({
    domain: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    encryptedPrivateKey: {
        type: String,
        required: true,
    },
    initVector: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
});
exports.SecretModel = (0, mongoose_1.model)('Secret', SecretSchema);
