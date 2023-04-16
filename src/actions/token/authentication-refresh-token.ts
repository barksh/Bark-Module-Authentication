/**
 * @author WMXPY
 * @namespace Actions_Token
 * @description Authentication Refresh Token
 */

import { JWTCreator } from "@sudoo/jwt";
import { UUIDVersion4 } from "@sudoo/uuid";
import { IAccount } from "../../database/interface/account";
import { IDecryptedSecretConfig } from "../../database/interface/secret";
import { IRefreshTokenModel } from "../../database/model/refresh-token";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { Initializer } from "../../initialize/initializer";
import { getOrCreateDecryptedSecretByDomain } from "../secret/get-or-create";
import { AuthenticationTokenBody, AuthenticationTokenHeader } from "./authentication";

export type GenerateUserAuthenticationTokenConfig = {

    readonly account: IAccount;
    readonly refreshToken: IRefreshTokenModel;
};

export const generateUserAuthenticationTokenByRefreshToken = async (
    config: GenerateUserAuthenticationTokenConfig,
): Promise<string> => {

    if (config.account.automation) {
        throw panic.code(
            ERROR_CODE.CANNOT_GENERATE_USER_AUTHENTICATION_TOKEN_BY_ACCOUNT_1,
            config.account.identifier,
        );
    }

    const refreshToken: IRefreshTokenModel = config.refreshToken;

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
            automation: config.account.automation,
            administrator: config.account.administrator,
        },
    });

    refreshToken.attachAuthenticationToken(authenticationTokenIdentifier);
    await refreshToken.save();

    return token;
};
