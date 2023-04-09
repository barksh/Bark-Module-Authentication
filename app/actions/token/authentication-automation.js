"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAutomationAuthenticationToken = void 0;
const jwt_1 = require("@sudoo/jwt");
const uuid_1 = require("@sudoo/uuid");
const code_1 = require("../../error/code");
const panic_1 = require("../../error/panic");
const initializer_1 = require("../../initialize/initializer");
const get_or_create_1 = require("../secret/get-or-create");
const generateAutomationAuthenticationToken = async (config) => {
    if (!config.account.automation) {
        throw panic_1.panic.code(code_1.ERROR_CODE.CANNOT_GENERATE_AUTOMATION_TOKEN_BY_REFRESH_TOKEN_1, config.account.identifier);
    }
    const secret = await (0, get_or_create_1.getOrCreateDecryptedSecretByDomain)(config.domain);
    const creator = jwt_1.JWTCreator.instantiate(secret.privateKey);
    const issueDate = new Date();
    const expireDate = new Date();
    expireDate.setUTCDate(expireDate.getUTCDate() + 60);
    const authenticationTokenIdentifier = uuid_1.UUIDVersion4.generateString().toString();
    const token = creator.create({
        issuedAt: issueDate,
        expirationAt: expireDate,
        identifier: authenticationTokenIdentifier,
        keyType: 'Bark',
        issuer: initializer_1.Initializer.getInstance().getSelfDomain(),
        audience: config.domain,
        header: {
            purpose: 'Authentication',
        },
        body: {
            identifier: config.account.identifier,
            automation: config.account.automation,
            administrator: config.account.administrator,
        },
    });
    return token;
};
exports.generateAutomationAuthenticationToken = generateAutomationAuthenticationToken;
