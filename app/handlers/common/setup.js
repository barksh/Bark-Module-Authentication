"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapHandler = void 0;
const magic_1 = require("@sudoo/magic");
const initializer_1 = require("../../initialize/initializer");
const response_1 = require("./response");
const wrapHandler = (verifier, handler) => {
    const newHandler = verifier.warpAPIGateWayProxyHandler(async (event, context, callback) => {
        await initializer_1.Initializer.initialize();
        const result = await handler(event, context, callback);
        await initializer_1.Initializer.terminate();
        if (typeof result === 'undefined') {
            return response_1.responseManager
                .createBuilder()
                .build(magic_1.HTTP_RESPONSE_CODE.NO_CONTENT);
        }
        return result;
    });
    return newHandler;
};
exports.wrapHandler = wrapHandler;
