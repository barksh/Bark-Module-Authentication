"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidInquiryByHiddenKey = exports.getInquiryByHiddenKey = exports.getValidInquiryByExposureKey = exports.getInquiryByExposureKey = exports.getValidInquiryByIdentifier = exports.getInquiryByIdentifier = exports.createUnsavedInquiry = exports.InquiryEmptySymbol = void 0;
const uuid_1 = require("@sudoo/uuid");
const random_1 = require("../../util/random");
const inquiry_1 = require("../model/inquiry");
exports.InquiryEmptySymbol = Symbol('inquiry-empty');
const createUnsavedInquiry = (domain, config = {}) => {
    const inquiryIdentifier = uuid_1.UUIDVersion4.generate().toString();
    const issueDate = new Date();
    const expireDate = new Date();
    expireDate.setUTCHours(expireDate.getUTCHours() + 1);
    const exposureKey = (0, random_1.generateRandomKey)();
    const hiddenKey = (0, random_1.generateRandomKey)();
    const inquiry = new inquiry_1.InquiryModel({
        inquiryIdentifier,
        exposureKey,
        hiddenKey,
        actions: config.actions ?? [],
        realized: false,
        domain,
        issuedAt: issueDate,
        expireAt: expireDate,
    });
    return inquiry;
};
exports.createUnsavedInquiry = createUnsavedInquiry;
const getInquiryByIdentifier = async (inquiryIdentifier) => {
    const inquiry = await inquiry_1.InquiryModel.findOne({
        inquiryIdentifier,
    }).exec();
    if (!inquiry) {
        return exports.InquiryEmptySymbol;
    }
    return inquiry;
};
exports.getInquiryByIdentifier = getInquiryByIdentifier;
const getValidInquiryByIdentifier = async (inquiryIdentifier, currentTime = new Date()) => {
    const inquiry = await inquiry_1.InquiryModel.findOne({
        inquiryIdentifier,
        expireAt: {
            $gt: currentTime,
        },
        issuedAt: {
            $lt: currentTime,
        },
    }).exec();
    if (!inquiry) {
        return exports.InquiryEmptySymbol;
    }
    return inquiry;
};
exports.getValidInquiryByIdentifier = getValidInquiryByIdentifier;
const getInquiryByExposureKey = async (exposureKey) => {
    const inquiry = await inquiry_1.InquiryModel.findOne({
        exposureKey,
    }).exec();
    if (!inquiry) {
        return exports.InquiryEmptySymbol;
    }
    return inquiry;
};
exports.getInquiryByExposureKey = getInquiryByExposureKey;
const getValidInquiryByExposureKey = async (exposureKey, currentTime = new Date()) => {
    const inquiry = await inquiry_1.InquiryModel.findOne({
        exposureKey,
        expireAt: {
            $gt: currentTime,
        },
        issuedAt: {
            $lt: currentTime,
        },
    }).exec();
    if (!inquiry) {
        return exports.InquiryEmptySymbol;
    }
    return inquiry;
};
exports.getValidInquiryByExposureKey = getValidInquiryByExposureKey;
const getInquiryByHiddenKey = async (hiddenKey) => {
    const inquiry = await inquiry_1.InquiryModel.findOne({
        hiddenKey,
    }).exec();
    if (!inquiry) {
        return exports.InquiryEmptySymbol;
    }
    return inquiry;
};
exports.getInquiryByHiddenKey = getInquiryByHiddenKey;
const getValidInquiryByHiddenKey = async (hiddenKey, currentTime = new Date()) => {
    const inquiry = await inquiry_1.InquiryModel.findOne({
        hiddenKey,
        expireAt: {
            $gt: currentTime,
        },
        issuedAt: {
            $lt: currentTime,
        },
    }).exec();
    if (!inquiry) {
        return exports.InquiryEmptySymbol;
    }
    return inquiry;
};
exports.getValidInquiryByHiddenKey = getValidInquiryByHiddenKey;
