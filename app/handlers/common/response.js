"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErroredLambdaResponse = exports.createSucceedLambdaResponse = exports.responseManager = void 0;
const lambda_1 = require("@sudoo/lambda");
const magic_1 = require("@sudoo/magic");
exports.responseManager = lambda_1.LambdaResponseManager.create();
const createSucceedLambdaResponse = (body) => {
    const builder = exports.responseManager.createBuilder();
    if (typeof body === 'undefined') {
        return builder.build(magic_1.HTTP_RESPONSE_CODE.NO_CONTENT);
    }
    return builder.replaceBody(body).build(magic_1.HTTP_RESPONSE_CODE.OK);
};
exports.createSucceedLambdaResponse = createSucceedLambdaResponse;
const createErroredLambdaResponse = (code, reason) => {
    const builder = exports.responseManager.createBuilder();
    if (typeof reason === 'undefined') {
        return builder.build(code);
    }
    if (typeof reason === 'string') {
        return builder.addBody('reason', reason).build(code);
    }
    return builder.addBody('reason', reason.message).build(code);
};
exports.createErroredLambdaResponse = createErroredLambdaResponse;
