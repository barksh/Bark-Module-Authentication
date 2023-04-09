"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationPostInquiryHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const magic_1 = require("@sudoo/magic");
const pattern_1 = require("@sudoo/pattern");
const inquiry_1 = require("../../../database/controller/inquiry");
const code_1 = require("../../../error/code");
const panic_1 = require("../../../error/panic");
const domain_1 = require("../../../util/network/domain");
const inquiry_action_1 = require("../../../util/verify/inquiry-action");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    domain: (0, pattern_1.createCustomPattern)((domain) => {
        return (0, domain_1.validateDomainName)(domain);
    }),
    actions: (0, pattern_1.createListPattern)((0, pattern_1.createStrictMapPattern)({
        type: (0, pattern_1.createStringPattern)(),
        payload: (0, pattern_1.createAnyPattern)(),
    }), {
        optional: true,
    }),
}));
exports.authenticationPostInquiryHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
    const body = event.verifiedBody;
    if (body.actions && body.actions.length > 0) {
        for (const action of body.actions) {
            const verifyResult = await (0, inquiry_action_1.verifyInquiryAction)(body.domain, action);
            if (!verifyResult) {
                return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.NOT_FOUND, panic_1.panic.code(code_1.ERROR_CODE.INVALID_INQUIRY_ACTION_1, JSON.stringify(action)));
            }
        }
    }
    const inquiryInstance = (0, inquiry_1.createUnsavedInquiry)(body.domain, {
        actions: body.actions,
    });
    await inquiryInstance.save();
    return (0, response_1.createSucceedLambdaResponse)({
        exposureKey: inquiryInstance.exposureKey,
        hiddenKey: inquiryInstance.hiddenKey,
    });
});
