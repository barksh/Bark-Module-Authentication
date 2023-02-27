/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Secret
 */

import { generateKeyPair, KeyPair } from "@sudoo/token";
import { decryptPrivateKey, encryptPrivateKey, generateInitVector } from "../../util/symmetric-encryption";
import { IDecryptedSecretConfig, ISecret, ISecretConfig } from "../interface/secret";
import { ISecretModel, SecretModel } from "../model/secret";

export const createRandomUnsavedSecret = (
    domain: string,
    securityKey: string,
): ISecretModel => {

    const keyPair: KeyPair = generateKeyPair();

    const publicKey: string = keyPair.public;
    const privateKey: string = keyPair.private;

    const initVector: string = generateInitVector();
    const encryptedPrivateKey: string = encryptPrivateKey(
        privateKey,
        securityKey,
        initVector,
    );

    const config: ISecretConfig = {
        domain,
        publicKey,
        encryptedPrivateKey,
        initVector,
    };
    return new SecretModel(config);
};

export const getDecryptedSecretByDomain = async (
    domain: string,
    securityKey: string,
): Promise<IDecryptedSecretConfig | null> => {

    const secret: ISecretModel | null = await SecretModel.findOne({
        domain,
    }).exec();

    if (!secret) {
        return null;
    }

    const privateKey: string = decryptPrivateKey(
        secret.encryptedPrivateKey,
        securityKey,
        secret.initVector,
    );

    return {
        ...secret.toObject(),
        privateKey,
    };
};

export const getSecretByDomain = async (
    domain: string,
): Promise<ISecret | null> => {

    const secret: ISecretModel | null = await SecretModel.findOne({
        domain,
    }).exec();

    if (!secret) {
        return null;
    }

    return {
        ...secret.toObject(),
    };
};
