"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceModel = void 0;
const mongoose_1 = require("mongoose");
const PreferenceSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    value: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
});
exports.PreferenceModel = (0, mongoose_1.model)('Preference', PreferenceSchema);
