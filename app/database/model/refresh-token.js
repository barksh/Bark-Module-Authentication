"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = void 0;
const mongoose_1 = require("mongoose");
const RefreshTokenSchema = new mongoose_1.Schema({
    accountIdentifier: {
        type: String,
        required: true,
        index: true,
    },
    inquiryIdentifier: {
        type: String,
        required: true,
        index: true,
    },
    refreshTokenIdentifier: {
        type: String,
        required: true,
        index: true,
    },
    authenticationTokens: {
        type: [String],
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    methods: {
        attachAuthenticationToken(authenticationTokenIdentifier) {
            this.authenticationTokens = [
                ...this.authenticationTokens,
                authenticationTokenIdentifier,
            ];
            return this;
        },
        containsAuthenticationToken(authenticationTokenIdentifier) {
            return this.authenticationTokens.includes(authenticationTokenIdentifier);
        }
    }
});
exports.RefreshTokenModel = (0, mongoose_1.model)('RefreshToken', RefreshTokenSchema);
