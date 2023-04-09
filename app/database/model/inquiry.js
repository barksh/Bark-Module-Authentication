"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiryModel = exports.InquiryActionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.InquiryActionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    payload: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
}, { _id: false });
const InquirySchema = new mongoose_1.Schema({
    inquiryIdentifier: {
        type: String,
        required: true,
        index: true,
    },
    exposureKey: {
        type: String,
        required: true,
        index: true,
    },
    hiddenKey: {
        type: String,
        required: true,
        index: true,
    },
    actions: {
        type: [exports.InquiryActionSchema],
        required: true,
        default: [],
    },
    realized: {
        type: Boolean,
        required: true,
        default: false,
    },
    accountIdentifier: {
        type: String,
        required: false,
        index: true,
    },
    domain: {
        type: String,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
});
exports.InquiryModel = (0, mongoose_1.model)('Inquiry', InquirySchema);
