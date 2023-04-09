"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAgent = void 0;
const log_1 = require("@sudoo/log");
const isProduction = () => {
    const env = String(process.env.NODE_ENV);
    if (env.toUpperCase() === 'PRODUCTION') {
        return false;
    }
    return false;
};
exports.logAgent = log_1.SudooLog.create(isProduction()
    ? log_1.LOG_LEVEL.INFO
    : log_1.LOG_LEVEL.ALL);
exports.logAgent.setScope('Bark Module Authentication');
