/**
 * @author WMXPY
 * @namespace Actions_Verify
 * @description Refresh
 */

import { JWTToken } from "@sudoo/jwt";
import { getSecretByDomain } from "../../database/controller/secret";
import { ISecret } from "../../database/interface/secret";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { Initializer } from "../../initialize/initializer";
import { logAgent } from "../../util/log/log";
import { RefreshAuthToken } from "../token/refresh";
import { verifyCommonTokenFields } from "./common";

export const parseVerifyRefreshToken = async (token: string): Promise<RefreshAuthToken> => {

    const instance: RefreshAuthToken = JWTToken.fromTokenOrThrow(token);

    if (!verifyCommonTokenFields(instance)) {
        logAgent.info('Inquiry Token common fields not match, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const valid: boolean = instance.verifyExpiration(new Date());

    if (!valid) {
        logAgent.info('Refresh Token Expired, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof instance.header.aud !== 'string') {
        logAgent.info('Refresh Token domain not exist, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const domain: string = instance.header.aud;

    const secret: ISecret | null = await getSecretByDomain(
        domain,
    );

    if (!secret) {
        logAgent.info('Refresh Token secret not exist, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const signed: boolean = instance.verifySignature(secret.publicKey);

    if (!signed) {
        logAgent.info('Refresh Token signature not match, Header:', instance.header, 'Body:', instance.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }
    return instance;
};

export const verifyRefreshToken = async (refreshToken: string): Promise<RefreshAuthToken> => {

    if (typeof refreshToken !== 'string') {
        logAgent.info('Refresh Token not string, Token:', refreshToken);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const token: RefreshAuthToken = await parseVerifyRefreshToken(refreshToken);

    const selfDomain: string = Initializer.getInstance().getSelfDomain();

    if (token.header.iss !== selfDomain) {
        logAgent.info('Refresh Token issuer not match, Header:', token.header, 'Body:', token.body, "Self Domain:", selfDomain);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof token.header.jti !== 'string') {
        logAgent.info('Refresh Token identifier not exist, Header:', token.header, 'Body:', token.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof token.body.identifier !== 'string') {
        logAgent.info('Refresh Token account identifier not exist, Header:', token.header, 'Body:', token.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    if (typeof token.body.inquiry !== 'string') {
        logAgent.info('Refresh Token inquiry not exist, Header:', token.header, 'Body:', token.body);
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    return token;
};
