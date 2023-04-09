"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCommonTokenFields = exports.getAuthorizationField = void 0;
const log_1 = require("../../util/log/log");
const getAuthorizationField = (headers) => {
    if (headers.Authorization) {
        return headers.Authorization;
    }
    return headers.authorization;
};
exports.getAuthorizationField = getAuthorizationField;
const verifyCommonTokenFields = (token, purpose) => {
    if (typeof token.header.exp !== 'number') {
        log_1.logAgent.error('Token ExpiredAt not exist, Header:', token.header, 'Body:', token.body);
        return false;
    }
    if (typeof token.header.iat !== 'number') {
        log_1.logAgent.error('Token IssuedAt not exist, Header:', token.header, 'Body:', token.body);
        return false;
    }
    if (token.header.kty !== 'Bark') {
        log_1.logAgent.error('Token Key Type Invalid, Header:', token.header, 'Body:', token.body);
        return false;
    }
    if (token.header.purpose !== purpose) {
        log_1.logAgent.error('Token Purpose Invalid, Header:', token.header, 'Body:', token.body);
        return false;
    }
    return true;
};
exports.verifyCommonTokenFields = verifyCommonTokenFields;
