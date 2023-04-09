"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInquiryAction = void 0;
const inquiry_1 = require("../../database/interface/inquiry");
const dns_1 = require("../dns");
const domain_1 = require("../domain");
const log_1 = require("../log/log");
const availableCallbackCache = new Map();
const getAvailableCallbackUrls = async (domain) => {
    if (availableCallbackCache.has(domain)) {
        return availableCallbackCache.get(domain);
    }
    const availableCallbackUrls = await dns_1.dnsResolver.V1.resolveAllowedCallback(domain);
    availableCallbackCache.set(domain, availableCallbackUrls);
    return availableCallbackUrls;
};
const verifyInquiryAction = async (domain, action) => {
    switch (action.type) {
        case inquiry_1.InquiryActionType.CALLBACK: {
            const fixedAction = action;
            const availableCallbackUrls = await getAvailableCallbackUrls(domain);
            const callbackUrlDomain = (0, domain_1.getDomainHostOfURL)(fixedAction.payload);
            if (!availableCallbackUrls.includes(callbackUrlDomain)) {
                log_1.logAgent.error('Invalid callback url:', callbackUrlDomain, 'available callback urls:', availableCallbackUrls);
                return false;
            }
            return true;
        }
        case inquiry_1.InquiryActionType.WEBHOOK: {
            return true;
        }
        case inquiry_1.InquiryActionType.CLOSE: {
            return true;
        }
        default: {
            return false;
        }
    }
};
exports.verifyInquiryAction = verifyInquiryAction;
