"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationPostTouchHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const magic_1 = require("@sudoo/magic");
const pattern_1 = require("@sudoo/pattern");
const inquiry_1 = require("../../../database/controller/inquiry");
const code_1 = require("../../../error/code");
const panic_1 = require("../../../error/panic");
const log_1 = require("../../../util/log/log");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    exposureKey: (0, pattern_1.createStringPattern)(),
}));
exports.authenticationPostTouchHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
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
    return (0, response_1.createSucceedLambdaResponse)({
        exposureKey: inquiry.exposureKey,
        domain: inquiry.domain,
    });
});
