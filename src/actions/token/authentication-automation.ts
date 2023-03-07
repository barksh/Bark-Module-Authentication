/**
 * @author WMXPY
 * @namespace Actions_Token
 * @description Authentication Refresh Token
 */

import { JWTCreator } from "@sudoo/jwt";
import { UUIDVersion4 } from "@sudoo/uuid";
import { IAccount } from "../../database/interface/account";
import { IDecryptedSecretConfig } from "../../database/interface/secret";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { Initializer } from "../../initialize/initializer";
import { getOrCreateDecryptedSecretByDomain } from "../secret/get-or-create";
import { AuthenticationTokenBody, AuthenticationTokenHeader } from "./authentication";

export type GenerateAuthenticationTokenConfig = {

    readonly domain: string;
    readonly account: IAccount;
};

export const generateAutomationAuthenticationToken = async (
    config: GenerateAuthenticationTokenConfig,
): Promise<string> => {

    if (!config.account.automation) {
        throw panic.code(
            ERROR_CODE.CANNOT_GENERATE_AUTOMATION_TOKEN_BY_REFRESH_TOKEN_1,
            config.account.identifier,
        );
    }

    const secret: IDecryptedSecretConfig = await getOrCreateDecryptedSecretByDomain(
        config.domain,
    );

    const creator: JWTCreator<AuthenticationTokenHeader, AuthenticationTokenBody> =
        JWTCreator.instantiate(secret.privateKey);

    const issueDate: Date = new Date();
    const expireDate: Date = new Date();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expireDate.setUTCDate(expireDate.getUTCDate() + 60);

    const authenticationTokenIdentifier: string =
        UUIDVersion4.generateString().toString();

    const token: string = creator.create({
        issuedAt: issueDate,
        expirationAt: expireDate,
        identifier: authenticationTokenIdentifier,
        keyType: 'Bark',
        issuer: Initializer.getInstance().getSelfDomain(),
        audience: config.domain,
        header: {
            purpose: 'Authentication',
        },
        body: {
            identifier: config.account.identifier,
            automation: config.account.automation,
            administrator: config.account.administrator,
        },
    });

    return token;
};
