"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationPostRefreshHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const magic_1 = require("@sudoo/magic");
const pattern_1 = require("@sudoo/pattern");
const authentication_refresh_token_1 = require("../../../actions/token/authentication-refresh-token");
const refresh_1 = require("../../../actions/verify/refresh");
const account_1 = require("../../../database/controller/account");
const refresh_token_1 = require("../../../database/controller/refresh-token");
const code_1 = require("../../../error/code");
const panic_1 = require("../../../error/panic");
const log_1 = require("../../../util/log/log");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    refreshToken: (0, pattern_1.createStringPattern)(),
}));
exports.authenticationPostRefreshHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
    const body = event.verifiedBody;
    const refreshToken = await (0, refresh_1.verifyRefreshToken)(body.refreshToken);
    if (typeof refreshToken.header.jti !== 'string') {
        log_1.logAgent.error('Invalid refresh token:', refreshToken.header.jti);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN));
    }
    const refreshTokenInstance = await (0, refresh_token_1.getRefreshTokenByIdentifier)(refreshToken.header.jti);
    if (refreshTokenInstance === refresh_token_1.RefreshTokenEmptySymbol) {
        log_1.logAgent.error('Refresh Token not found:', refreshToken.header.jti);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN));
    }
    if (refreshTokenInstance.inquiryIdentifier !== refreshToken.body.inquiry) {
        log_1.logAgent.error('Refresh Token inquiry not match:', refreshToken.header.jti, refreshToken.body.inquiry);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.INVALID_TOKEN));
    }
    const account = await (0, account_1.getAccountByIdentifier)(refreshToken.body.identifier);
    if (account === account_1.AccountEmptySymbol) {
        log_1.logAgent.error('Account not found:', refreshToken.body.identifier);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.ACCOUNT_NOT_FOUND_1, refreshToken.body.identifier));
    }
    if (account.automation) {
        log_1.logAgent.error('Account is automation when refresh token:', refreshToken.body.identifier);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.CANNOT_REFRESH_TOKEN_WITH_AUTOMATION_ACCOUNT_1, refreshToken.body.identifier));
    }
    const authenticationToken = await (0, authentication_refresh_token_1.generateUserAuthenticationTokenByRefreshToken)({
        account,
        refreshToken: refreshTokenInstance,
    });
    return (0, response_1.createSucceedLambdaResponse)({
        token: authenticationToken,
    });
});
