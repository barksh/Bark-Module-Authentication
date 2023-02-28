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
import { logAgent } from "../../util/log/log";
import { InquiryAuthToken } from "../token/inquiry";

export const parseVerifyInquiryToken = async (token: string): Promise<InquiryAuthToken> => {

    const instance: InquiryAuthToken = JWTToken.fromTokenOrThrow(token);
    const valid: boolean = instance.verifyExpiration(new Date());

    if (!valid) {
        logAgent.info('Inquiry Token Expired, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof instance.header.aud !== 'string') {
        logAgent.info('Inquiry Token domain not exist, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const domain: string = instance.header.aud;

    const secret: ISecret | null = await getSecretByDomain(
        domain,
    );

    if (!secret) {
        logAgent.info('Inquiry Token secret not exist, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const signed: boolean = instance.verifySignature(secret.publicKey);

    if (!signed) {
        logAgent.info('Inquiry Token signature not match, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }
    return instance;
};

export const verifyInquiryToken = async (inquiryToken: string): Promise<InquiryAuthToken> => {

    if (typeof inquiryToken !== 'string') {
        logAgent.info('Inquiry Token not string, Token:', inquiryToken);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const token: InquiryAuthToken = await parseVerifyInquiryToken(inquiryToken);

    const selfDomain: string = Initializer.getInstance().getSelfDomain();

    if (token.header.iss !== selfDomain) {
        logAgent.info('Inquiry Token issuer not match, Header:', token.header, 'Body:', token.body, "Self Domain:", selfDomain);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof token.header.jti !== 'string') {
        logAgent.info('Inquiry Token identifier not exist, Header:', token.header, 'Body:', token.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    return token;
};
