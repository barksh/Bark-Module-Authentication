"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretByDomain = exports.getDecryptedSecretByDomain = exports.createRandomUnsavedSecret = void 0;
const token_1 = require("@sudoo/token");
const symmetric_encryption_1 = require("../../util/symmetric-encryption");
const secret_1 = require("../model/secret");
const createRandomUnsavedSecret = (domain, securityKey) => {
    const keyPair = (0, token_1.generateKeyPair)();
    const publicKey = keyPair.public;
    const privateKey = keyPair.private;
    const initVector = (0, symmetric_encryption_1.generateInitVector)();
    const encryptedPrivateKey = (0, symmetric_encryption_1.encryptPrivateKey)(privateKey, securityKey, initVector);
    const config = {
        domain,
        publicKey,
        encryptedPrivateKey,
        initVector,
    };
    return new secret_1.SecretModel(config);
};
exports.createRandomUnsavedSecret = createRandomUnsavedSecret;
const getDecryptedSecretByDomain = async (domain, securityKey) => {
    const secret = await secret_1.SecretModel.findOne({
        domain,
    }).exec();
    if (!secret) {
        return null;
    }
    const privateKey = (0, symmetric_encryption_1.decryptPrivateKey)(secret.encryptedPrivateKey, securityKey, secret.initVector);
    const secretObject = secret.toObject();
    return {
        ...secretObject,
        privateKey,
    };
};
exports.getDecryptedSecretByDomain = getDecryptedSecretByDomain;
const getSecretByDomain = async (domain) => {
    const secret = await secret_1.SecretModel.findOne({
        domain,
    }).exec();
    if (!secret) {
        return null;
    }
    const secretObject = secret.toObject();
    return {
        ...secretObject,
    };
};
exports.getSecretByDomain = getSecretByDomain;
