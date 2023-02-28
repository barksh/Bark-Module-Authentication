/**
 * @author WMXPY
 * @namespace Actions_Token
 * @description Inquiry
 */

import { JWTCreator, JWTToken } from "@sudoo/jwt";
import { createUnsavedInquiry } from "../../database/controller/inquiry";
import { IDecryptedSecretConfig } from "../../database/interface/secret";
import { IInquiryModel } from "../../database/model/inquiry";
import { Initializer } from "../../initialize/initializer";
import { getOrCreateDecryptedSecretByDomain } from "../secret/get-or-create";

export type GenerateInquiryTokenConfig = {

    readonly domain: string;

    readonly accountIdentifier: string;
};

export type InquiryTokenHeader = {

    readonly type: 'inquiry';
};

export type InquiryTokenBody = {

    readonly identifier: string;
};

export type InquiryAuthToken = JWTToken<InquiryTokenHeader, InquiryTokenBody>;

export const generateInquiryToken = async (
    config: GenerateInquiryTokenConfig,
): Promise<string> => {

    const secret: IDecryptedSecretConfig | null = await getOrCreateDecryptedSecretByDomain(
        config.domain,
    );

    const unsavedInquiry: IInquiryModel = createUnsavedInquiry(
        config.accountIdentifier,
        config.domain,
    );

    const creator: JWTCreator<InquiryTokenHeader, InquiryTokenBody> =
        JWTCreator.instantiate(secret.privateKey);

    const token: string = creator.create({
        issuedAt: unsavedInquiry.issuedAt,
        expirationAt: unsavedInquiry.expireAt,
        issuer: Initializer.getInstance().getSelfDomain(),
        audience: unsavedInquiry.domain,
        header: {
            type: 'inquiry',
        },
        body: {
            identifier: unsavedInquiry.accountIdentifier,
        },
    });

    await unsavedInquiry.save();

    return token;
};
