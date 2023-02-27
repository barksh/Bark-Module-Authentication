/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Secret
 */

import { generateKeyPair, KeyPair } from "@sudoo/token";
import { encryptPrivateKey, generateInitVector } from "../../util/symmetric-encryption";
import { ISecretConfig } from "../interface/secret";
import { ISecretModel, SecretModel } from "../model/secret";

export const createRandomUnsavedSecret = (
    domain: string,
    securityKey: string,
): ISecretModel => {

    const keyPair: KeyPair = generateKeyPair();

    const publicKey: string = keyPair.public;
    const privateKey: string = keyPair.private;

    const initVector: string = generateInitVector();
    const encryptedPrivateKey: string = encryptPrivateKey(privateKey, securityKey, initVector);

    const config: ISecretConfig = {
        domain,
        publicKey,
        encryptedPrivateKey,
        initVector,
    };
    return new SecretModel(config);
};
