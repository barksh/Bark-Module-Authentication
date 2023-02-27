/**
 * @author WMXPY
 * @namespace Util
 * @description Symmetric Encryption
 */

import * as Crypto from "crypto";

export const encryptPrivateKey = (
    privateKey: string,
    securityKey: string,
    initVector: string,
): string => {

    const algorithm = "aes-256-cbc";

    const cipher = Crypto.createCipheriv(algorithm, securityKey, initVector);

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

    const decipher = Crypto.createDecipheriv(algorithm, securityKey, initVector);

    let decryptedData = decipher.update(encryptedPrivateKey, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");

    return decryptedData;
};
