"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnsavedRecord = void 0;
const record_1 = require("../model/record");
const createUnsavedRecord = (type, subType, payload) => {
    const record = new record_1.RecordModel({
        type,
        subType,
        payload,
    });
    return record;
};
exports.createUnsavedRecord = createUnsavedRecord;
