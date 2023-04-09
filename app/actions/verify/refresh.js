"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.parseVerifyRefreshToken = void 0;
const jwt_1 = require("@sudoo/jwt");
const secret_1 = require("../../database/controller/secret");
const code_1 = require("../../error/code");
const panic_1 = require("../../error/panic");
const initializer_1 = require("../../initialize/initializer");
const log_1 = require("../../util/log/log");
const common_1 = require("./common");
const parseVerifyRefreshToken = async (token) => {
    const instance = jwt_1.JWTToken.fromTokenOrThrow(token);
    if (!(0, common_1.verifyCommonTokenFields)(instance, 'Refresh')) {
        log_1.logAgent.info('Inquiry Token common fields not match, Header:', instance.header, 'Body:', instance.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    const valid = instance.verifyExpiration(new Date());
    if (!valid) {
        log_1.logAgent.info('Refresh Token Expired, Header:', instance.header, 'Body:', instance.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    if (typeof instance.header.aud !== 'string') {
        log_1.logAgent.info('Refresh Token domain not exist, Header:', instance.header, 'Body:', instance.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    const domain = instance.header.aud;
    const secret = await (0, secret_1.getSecretByDomain)(domain);
    if (!secret) {
        log_1.logAgent.info('Refresh Token secret not exist, Header:', instance.header, 'Body:', instance.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    const signed = instance.verifySignature(secret.publicKey);
    if (!signed) {
        log_1.logAgent.info('Refresh Token signature not match, Header:', instance.header, 'Body:', instance.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    return instance;
};
exports.parseVerifyRefreshToken = parseVerifyRefreshToken;
const verifyRefreshToken = async (refreshToken) => {
    if (typeof refreshToken !== 'string') {
        log_1.logAgent.info('Refresh Token not string, Token:', refreshToken);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    const token = await (0, exports.parseVerifyRefreshToken)(refreshToken);
    const selfDomain = initializer_1.Initializer.getInstance().getSelfDomain();
    if (token.header.iss !== selfDomain) {
        log_1.logAgent.info('Refresh Token issuer not match, Header:', token.header, 'Body:', token.body, "Self Domain:", selfDomain);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    if (typeof token.header.jti !== 'string') {
        log_1.logAgent.info('Refresh Token identifier not exist, Header:', token.header, 'Body:', token.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    if (typeof token.body.identifier !== 'string') {
        log_1.logAgent.info('Refresh Token account identifier not exist, Header:', token.header, 'Body:', token.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    if (typeof token.body.inquiry !== 'string') {
        log_1.logAgent.info('Refresh Token inquiry not exist, Header:', token.header, 'Body:', token.body);
        throw panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN);
    }
    return token;
};
exports.verifyRefreshToken = verifyRefreshToken;
