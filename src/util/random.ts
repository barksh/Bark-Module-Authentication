/**
 * @author WMXPY
 * @namespace Util
 * @description Symmetric Encryption
 */

import * as Crypto from "crypto";

export const generateRandomKey = (): string => {

    return Crypto.randomBytes(16).toString("hex");
};
