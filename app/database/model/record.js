"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordModel = void 0;
const mongoose_1 = require("mongoose");
const RecordSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    subType: {
        type: String,
        required: true,
    },
    payload: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
});
exports.RecordModel = (0, mongoose_1.model)('Record', RecordSchema);
