"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateDecryptedSecretByDomain = exports.getOrCreateSecretByDomain = void 0;
const secret_1 = require("../../database/controller/secret");
const initializer_1 = require("../../initialize/initializer");
const symmetric_encryption_1 = require("../../util/symmetric-encryption");
const getOrCreateSecretByDomain = async (domain) => {
    const secret = await (0, secret_1.getSecretByDomain)(domain);
    if (secret) {
        return secret;
    }
    const secretKey = initializer_1.Initializer.getInstance().getSecretKey();
    const newSecret = (0, secret_1.createRandomUnsavedSecret)(domain, secretKey);
    await newSecret.save();
    return newSecret.toObject();
};
exports.getOrCreateSecretByDomain = getOrCreateSecretByDomain;
const getOrCreateDecryptedSecretByDomain = async (domain) => {
    const secretKey = initializer_1.Initializer.getInstance().getSecretKey();
    const secret = await (0, secret_1.getDecryptedSecretByDomain)(domain, secretKey);
    if (secret) {
        return secret;
    }
    const newSecret = (0, secret_1.createRandomUnsavedSecret)(domain, secretKey);
    await newSecret.save();
    const privateKey = (0, symmetric_encryption_1.decryptPrivateKey)(newSecret.encryptedPrivateKey, secretKey, newSecret.initVector);
    const secretObject = newSecret.toObject();
    return {
        ...secretObject,
        privateKey,
    };
};
exports.getOrCreateDecryptedSecretByDomain = getOrCreateDecryptedSecretByDomain;
