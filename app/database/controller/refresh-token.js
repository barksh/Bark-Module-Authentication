"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidInquiryByIdentifier = exports.getRefreshTokenByIdentifier = exports.createUnsavedRefreshToken = exports.RefreshTokenEmptySymbol = void 0;
const uuid_1 = require("@sudoo/uuid");
const refresh_token_1 = require("../model/refresh-token");
exports.RefreshTokenEmptySymbol = Symbol('refresh-token-empty');
const createUnsavedRefreshToken = (accountIdentifier, inquiryIdentifier, domain) => {
    const refreshTokenIdentifier = uuid_1.UUIDVersion4.generate().toString();
    const issueDate = new Date();
    const expireDate = new Date();
    expireDate.setUTCHours(expireDate.getUTCHours() + 1);
    const refreshToken = new refresh_token_1.RefreshTokenModel({
        accountIdentifier,
        inquiryIdentifier,
        refreshTokenIdentifier,
        authenticationTokens: [],
        domain,
        issuedAt: issueDate,
        expireAt: expireDate,
    });
    return refreshToken;
};
exports.createUnsavedRefreshToken = createUnsavedRefreshToken;
const getRefreshTokenByIdentifier = async (refreshTokenIdentifier) => {
    const refreshToken = await refresh_token_1.RefreshTokenModel.findOne({
        refreshTokenIdentifier,
    }).exec();
    if (!refreshToken) {
        return exports.RefreshTokenEmptySymbol;
    }
    return refreshToken;
};
exports.getRefreshTokenByIdentifier = getRefreshTokenByIdentifier;
const getValidInquiryByIdentifier = async (refreshTokenIdentifier, currentTime = new Date()) => {
    const refreshToken = await refresh_token_1.RefreshTokenModel.findOne({
        refreshTokenIdentifier,
        expireAt: {
            $gt: currentTime,
        },
        issuedAt: {
            $lt: currentTime,
        },
    }).exec();
    if (!refreshToken) {
        return exports.RefreshTokenEmptySymbol;
    }
    return refreshToken;
};
exports.getValidInquiryByIdentifier = getValidInquiryByIdentifier;
