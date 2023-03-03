/**
 * @author WMXPY
 * @namespace Actions_Token
 * @description Authentication
 */

import { JWTCreator, JWTToken } from "@sudoo/jwt";
import { UUIDVersion4 } from "@sudoo/uuid";
import { IRefreshToken } from "../../database/interface/refresh-token";
import { IDecryptedSecretConfig } from "../../database/interface/secret";
import { Initializer } from "../../initialize/initializer";
import { getOrCreateDecryptedSecretByDomain } from "../secret/get-or-create";

export type GenerateAuthenticationTokenConfig = {

    readonly refreshToken: IRefreshToken;
};

export type AuthenticationTokenHeader = {

    readonly purpose: 'Authentication';
};

export type AuthenticationTokenBody = {

    readonly identifier: string;
};

export type AuthenticationAuthToken = JWTToken<AuthenticationTokenHeader, AuthenticationTokenBody>;

export const generateAuthenticationToken = async (
    config: GenerateAuthenticationTokenConfig,
): Promise<string> => {

    const refreshToken: IRefreshToken = config.refreshToken;

    const secret: IDecryptedSecretConfig = await getOrCreateDecryptedSecretByDomain(
        refreshToken.domain,
    );

    const creator: JWTCreator<AuthenticationTokenHeader, AuthenticationTokenBody> =
        JWTCreator.instantiate(secret.privateKey);

    const issueDate: Date = new Date();
    const expireDate: Date = new Date();
    expireDate.setUTCDate(expireDate.getUTCDate() + 7);

    const authenticationTokenIdentifier: string =
        UUIDVersion4.generateString().toString();

    const token: string = creator.create({
        issuedAt: issueDate,
        expirationAt: expireDate,
        identifier: authenticationTokenIdentifier,
        keyType: 'Bark',
        issuer: Initializer.getInstance().getSelfDomain(),
        audience: refreshToken.domain,
        header: {
            purpose: 'Authentication',
        },
        body: {
            identifier: refreshToken.accountIdentifier,
        },
    });

    return token;
};