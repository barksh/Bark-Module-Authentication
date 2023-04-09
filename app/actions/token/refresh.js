"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.UnableToGenerateRefreshTokenSymbol = void 0;
const jwt_1 = require("@sudoo/jwt");
const refresh_token_1 = require("../../database/controller/refresh-token");
const initializer_1 = require("../../initialize/initializer");
const log_1 = require("../../util/log/log");
const get_or_create_1 = require("../secret/get-or-create");
exports.UnableToGenerateRefreshTokenSymbol = Symbol('unable-to-generate-refresh-token-symbol');
const generateRefreshToken = async (config) => {
    const inquiry = config.inquiry;
    if (!inquiry.realized
        || typeof inquiry.accountIdentifier !== 'string') {
        log_1.logAgent.error('Inquiry not realized, inquiry identifier:', inquiry.inquiryIdentifier);
        return exports.UnableToGenerateRefreshTokenSymbol;
    }
    const secret = await (0, get_or_create_1.getOrCreateDecryptedSecretByDomain)(inquiry.domain);
    const creator = jwt_1.JWTCreator.instantiate(secret.privateKey);
    const issueDate = new Date();
    const expireDate = new Date();
    expireDate.setUTCMonth(expireDate.getUTCMonth() + 1);
    const refreshTokenInstance = (0, refresh_token_1.createUnsavedRefreshToken)(inquiry.accountIdentifier, inquiry.inquiryIdentifier, inquiry.domain);
    const token = creator.create({
        issuedAt: issueDate,
        expirationAt: expireDate,
        identifier: refreshTokenInstance.refreshTokenIdentifier,
        keyType: 'Bark',
        issuer: initializer_1.Initializer.getInstance().getSelfDomain(),
        audience: inquiry.domain,
        header: {
            purpose: 'Refresh',
        },
        body: {
            identifier: inquiry.accountIdentifier,
            inquiry: inquiry.inquiryIdentifier,
        },
    });
    await refreshTokenInstance.save();
    await inquiry.save();
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
