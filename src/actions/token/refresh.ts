/**
 * @author WMXPY
 * @namespace Actions_Token
 * @description Refresh
 */

import { JWTCreator, JWTToken } from "@sudoo/jwt";
import { createUnsavedRefreshToken } from "../../database/controller/refresh-token";
import { IDecryptedSecretConfig } from "../../database/interface/secret";
import { IInquiryModel } from "../../database/model/inquiry";
import { IRefreshTokenModel } from "../../database/model/refresh-token";
import { Initializer } from "../../initialize/initializer";
import { logAgent } from "../../util/log/log";
import { getOrCreateDecryptedSecretByDomain } from "../secret/get-or-create";

export const UnableToGenerateRefreshTokenSymbol = Symbol('unable-to-generate-refresh-token-symbol');

export type GenerateRefreshTokenConfig = {

    readonly inquiry: IInquiryModel;
};

export type RefreshTokenHeader = {

    readonly purpose: 'Refresh';
};

export type RefreshTokenBody = {

    readonly identifier: string;
    readonly inquiry: string;
};

export type RefreshAuthToken = JWTToken<RefreshTokenHeader, RefreshTokenBody>;

export const generateRefreshToken = async (
    config: GenerateRefreshTokenConfig,
): Promise<string | typeof UnableToGenerateRefreshTokenSymbol> => {

    const inquiry: IInquiryModel = config.inquiry;

    if (!inquiry.realized
        || typeof inquiry.accountIdentifier !== 'string') {

        logAgent.error('Inquiry not realized, inquiry identifier:', inquiry.inquiryIdentifier);
        return UnableToGenerateRefreshTokenSymbol;
    }

    const secret: IDecryptedSecretConfig = await getOrCreateDecryptedSecretByDomain(
        inquiry.domain,
    );

    const creator: JWTCreator<RefreshTokenHeader, RefreshTokenBody> =
        JWTCreator.instantiate(secret.privateKey);

    const issueDate: Date = new Date();
    const expireDate: Date = new Date();
    expireDate.setUTCMonth(expireDate.getUTCMonth() + 1);

    const refreshTokenInstance: IRefreshTokenModel = createUnsavedRefreshToken(
        inquiry.accountIdentifier,
        inquiry.inquiryIdentifier,
        inquiry.domain,
    );

    const token: string = creator.create({
        issuedAt: issueDate,
        expirationAt: expireDate,
        identifier: refreshTokenInstance.refreshTokenIdentifier,
        keyType: 'Bark',
        issuer: Initializer.getInstance().getSelfDomain(),
        audience: inquiry.domain,
        header: {
            purpose: 'Refresh',
        },
        body: {
            identifier: inquiry.accountIdentifier,
            inquiry: inquiry.inquiryIdentifier,
        },
    });

    await refreshTokenInstance.save();
    await inquiry.save();

    return token;
};
