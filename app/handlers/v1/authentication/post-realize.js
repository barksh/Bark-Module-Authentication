"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationPostRealizeHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const magic_1 = require("@sudoo/magic");
const pattern_1 = require("@sudoo/pattern");
const account_1 = require("../../../database/controller/account");
const inquiry_1 = require("../../../database/controller/inquiry");
const code_1 = require("../../../error/code");
const panic_1 = require("../../../error/panic");
const log_1 = require("../../../util/log/log");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    exposureKey: (0, pattern_1.createStringPattern)(),
    accountIdentifier: (0, pattern_1.createStringPattern)(),
    password: (0, pattern_1.createStringPattern)(),
}));
exports.authenticationPostRealizeHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
    const body = event.verifiedBody;
    const inquiry = await (0, inquiry_1.getValidInquiryByExposureKey)(body.exposureKey);
    if (inquiry === inquiry_1.InquiryEmptySymbol) {
        log_1.logAgent.error('Inquiry not found, exposureKey:', body.exposureKey);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.INQUIRY_NOT_FOUND_BY_EXPOSURE_KEY_1, body.exposureKey));
    }
    if (inquiry.realized) {
        log_1.logAgent.error('Inquiry already realized, exposureKey:', body.exposureKey);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.INQUIRY_NOT_FOUND_BY_EXPOSURE_KEY_1, body.exposureKey));
    }
    const account = await (0, account_1.getAccountByIdentifier)(body.accountIdentifier);
    if (account === account_1.AccountEmptySymbol) {
        log_1.logAgent.error('Account not found, identifier:', body.accountIdentifier);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1, body.accountIdentifier));
    }
    const verifyResult = account.verifyPassword(body.password);
    if (!verifyResult) {
        log_1.logAgent.error('Account password incorrect, identifier:', body.accountIdentifier);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1, body.accountIdentifier));
    }
    if (account.automation) {
        log_1.logAgent.error('Account is automation during realize, identifier:', body.accountIdentifier);
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.UNAUTHORIZED, panic_1.panic.code(code_1.ERROR_CODE.CANNOT_REALIZE_INQUIRY_WITH_AUTOMATION_ACCOUNT_1, body.accountIdentifier));
    }
    inquiry.realized = true;
    inquiry.accountIdentifier = account.identifier;
    await inquiry.save();
    return (0, response_1.createSucceedLambdaResponse)({
        exposureKey: inquiry.exposureKey,
        accountIdentifier: account.identifier,
        actions: inquiry.actions,
    });
});
