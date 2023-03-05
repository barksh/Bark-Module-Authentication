/**
 * @author WMXPY
 * @namespace Util
 * @description Symmetric Encryption
 */

import * as Crypto from "crypto";

export const generateInitVector = (): string => {

    return Crypto.randomBytes(16).toString("hex");
};

export const generateSecretKey = (): string => {

    return Crypto.randomBytes(32).toString("hex");
};

export const encryptPrivateKey = (
    privateKey: string,
    securityKey: string,
    initVector: string,
): string => {

    const algorithm = "aes-256-cbc";

    const securityKeyBuffer: Buffer = Buffer.from(securityKey, "hex");
    const initVectorBuffer: Buffer = Buffer.from(initVector, "hex");

    const cipher = Crypto.createCipheriv(algorithm, securityKeyBuffer, initVectorBuffer);

    let encryptedData = cipher.update(privateKey, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    return encryptedData;
};

export const decryptPrivateKey = (
    encryptedPrivateKey: string,
    securityKey: string,
    initVector: string,
): string => {

    const algorithm = "aes-256-cbc";

    const securityKeyBuffer: Buffer = Buffer.from(securityKey, "hex");
    const initVectorBuffer: Buffer = Buffer.from(initVector, "hex");

    const decipher = Crypto.createDecipheriv(algorithm, securityKeyBuffer, initVectorBuffer);

    let decryptedData = decipher.update(encryptedPrivateKey, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");

    return decryptedData;
};
