/**
 * @author WMXPY
 * @namespace Actions_Secret
 * @description Get Or Create
 */

import { getSecretByDomain, createRandomUnsavedSecret, getDecryptedSecretByDomain } from "../../database/controller/secret";
import { IDecryptedSecretConfig, ISecret } from "../../database/interface/secret";
import { ISecretModel } from "../../database/model/secret";
import { Initializer } from "../../initialize/initializer";
import { decryptPrivateKey } from "../../util/symmetric-encryption";

export const getOrCreateSecretByDomain = async (domain: string): Promise<ISecret> => {

    const secret: ISecret | null = await getSecretByDomain(domain);

    if (secret) {
        return secret;
    }

    const secretKey: string = Initializer.getInstance().getSecretKey();

    const newSecret: ISecretModel = createRandomUnsavedSecret(
        domain,
        secretKey,
    );
    await newSecret.save();

    return newSecret.toObject();
};

export const getOrCreateDecryptedSecretByDomain = async (domain: string): Promise<IDecryptedSecretConfig> => {

    const secretKey: string = Initializer.getInstance().getSecretKey();

    const secret: IDecryptedSecretConfig | null = await getDecryptedSecretByDomain(
        domain,
        secretKey,
    );

    if (secret) {
        return secret;
    }

    const newSecret: ISecretModel = createRandomUnsavedSecret(
        domain,
        secretKey,
    );
    await newSecret.save();


    const privateKey: string = decryptPrivateKey(
        newSecret.encryptedPrivateKey,
        secretKey,
        newSecret.initVector,
    );

    const secretObject: ISecret = newSecret.toObject();
    return {
        ...secretObject,
        privateKey,
    };
};
