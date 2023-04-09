"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationPostRedeemHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const magic_1 = require("@sudoo/magic");
const pattern_1 = require("@sudoo/pattern");
const refresh_1 = require("../../../actions/token/refresh");
const inquiry_1 = require("../../../database/controller/inquiry");
const code_1 = require("../../../error/code");
const panic_1 = require("../../../error/panic");
const log_1 = require("../../../util/log/log");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    hiddenKey: (0, pattern_1.createStringPattern)(),
}));
exports.authenticationPostRedeemHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
    const body = event.verifiedBody;
    const inquiry = await (0, inquiry_1.getValidInquiryByHiddenKey)(body.hiddenKey);
    if (inquiry === inquiry_1.InquiryEmptySymbol) {
        log_1.logAgent.error('Inquiry not found, hiddenKey:', body.hiddenKey);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.UNAUTHORIZED, panic_1.panic.code(code_1.ERROR_CODE.INQUIRY_NOT_FOUND_BY_HIDDEN_KEY_1, body.hiddenKey));
    }
    if (!inquiry.realized
        || typeof inquiry.accountIdentifier !== 'string') {
        log_1.logAgent.error('Inquiry not realized, hiddenKey:', body.hiddenKey);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.UNAUTHORIZED, panic_1.panic.code(code_1.ERROR_CODE.INQUIRY_NOT_REALIZED_1, body.hiddenKey));
    }
    const refreshToken = await (0, refresh_1.generateRefreshToken)({
        inquiry,
    });
    if (refreshToken === refresh_1.UnableToGenerateRefreshTokenSymbol) {
        log_1.logAgent.error('Unable to generate refresh token, hiddenKey:', body.hiddenKey);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.UNAUTHORIZED, panic_1.panic.code(code_1.ERROR_CODE.INQUIRY_NOT_REALIZED_1, body.hiddenKey));
    }
    return (0, response_1.createSucceedLambdaResponse)({
        refreshToken,
    });
});
