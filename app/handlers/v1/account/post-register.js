"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountPostRegisterHandler = void 0;
const lambda_verify_1 = require("@sudoo/lambda-verify");
const magic_1 = require("@sudoo/magic");
const pattern_1 = require("@sudoo/pattern");
const account_1 = require("../../../database/controller/account");
const preference_1 = require("../../../database/controller/preference");
const account_2 = require("../../../database/data/account");
const preference_2 = require("../../../database/declare/preference");
const code_1 = require("../../../error/code");
const panic_1 = require("../../../error/panic");
const response_1 = require("../../common/response");
const setup_1 = require("../../common/setup");
const verifier = lambda_verify_1.LambdaVerifier.create()
    .setBodyPattern((0, pattern_1.createStrictMapPattern)({
    identifier: (0, pattern_1.createStringPattern)(),
    password: (0, pattern_1.createStringPattern)(),
}));
exports.accountPostRegisterHandler = (0, setup_1.wrapHandler)(verifier, async (event, _context) => {
    const body = event.verifiedBody;
    const allowPublicRegister = await (0, preference_1.getOrDefaultPreferenceByKey)(preference_2.PreferenceKey.ALLOW_PUBLIC_REGISTER);
    if (!allowPublicRegister) {
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.METHOD_NOT_ALLOWED, panic_1.panic.code(code_1.ERROR_CODE.PUBLIC_REGISTER_IS_NOT_ALLOWED));
    }
    const identifierValidationResult = (0, account_2.validateIdentifier)(body.identifier);
    if (identifierValidationResult !== account_2.IDENTIFIER_VALIDATE_RESPONSE.OK) {
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.BAD_REQUEST, panic_1.panic.code(code_1.ERROR_CODE.INVALID_IDENTIFIER_1, identifierValidationResult));
    }
    const passwordValidationResult = (0, account_2.validatePassword)(body.password);
    if (passwordValidationResult !== account_2.PASSWORD_VALIDATE_RESPONSE.OK) {
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.BAD_REQUEST, panic_1.panic.code(code_1.ERROR_CODE.INVALID_PASSWORD_1, passwordValidationResult));
    }
    const existAccount = await (0, account_1.getAccountByIdentifier)(body.identifier);
    if (existAccount !== account_1.AccountEmptySymbol) {
        return (0, response_1.createErroredLambdaResponse)(magic_1.HTTP_RESPONSE_CODE.CONFLICT);
    }
    const account = (0, account_1.createUnsavedAccount)(body.identifier, body.password, {
        automation: false,
        administrator: false,
    });
    await account.save();
    return (0, response_1.createSucceedLambdaResponse)({
        identifier: account.identifier,
    });
});
