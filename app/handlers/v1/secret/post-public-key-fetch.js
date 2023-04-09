"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretPostPublicKeyFetchHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const pattern_1 = require("@sudoo/pattern");
const get_or_create_1 = require("../../../actions/secret/get-or-create");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    domain: (0, pattern_1.createStringPattern)(),
}));
exports.secretPostPublicKeyFetchHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
    const body = event.verifiedBody;
    const secret = await (0, get_or_create_1.getOrCreateSecretByDomain)(body.domain);
    return (0, response_1.createSucceedLambdaResponse)({
        domain: body.domain,
        publicKey: secret.publicKey,
    });
});
