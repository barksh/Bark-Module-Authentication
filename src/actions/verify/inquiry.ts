/**
 * @author WMXPY
 * @namespace Actions_Verify
 * @description Inquiry
 */

import { JWTToken } from "@sudoo/jwt";
import { getSecretByDomain } from "../../database/controller/secret";
import { ISecret } from "../../database/interface/secret";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { Initializer } from "../../initialize/initializer";
import { InquiryAuthToken } from "../token/inquiry";

export const parseVerifyInquiryToken = async (token: string): Promise<InquiryAuthToken> => {

    const instance: InquiryAuthToken = JWTToken.fromTokenOrThrow(token);
    const valid: boolean = instance.verifyExpiration(new Date());

    if (!valid) {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof instance.header.aud !== 'string') {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const domain: string = instance.header.aud;

    const secret: ISecret | null = await getSecretByDomain(
        domain,
    );

    if (!secret) {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const signed: boolean = instance.verifySignature(secret.publicKey);

    if (!signed) {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }
    return instance;
};

export const verifyInquiryToken = async (inquiryToken: string): Promise<InquiryAuthToken> => {

    if (typeof inquiryToken !== 'string') {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const token: InquiryAuthToken = await parseVerifyInquiryToken(inquiryToken);

    if (typeof token.header.iss !== Initializer.getInstance().getSelfDomain()) {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof token.header.jti !== 'string') {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    return token;
};
