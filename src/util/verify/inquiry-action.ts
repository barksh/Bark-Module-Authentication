/**
 * @author WMXPY
 * @namespace Util_Verify
 * @description Inquiry Action
 */

import { InquiryAction, InquiryActionType } from "../../database/interface/inquiry";
import { dnsResolver } from "../dns";
import { getDomainHostOfURL } from "../domain";
import { logAgent } from "../log/log";

const availableCallbackCache: Map<string, string[]> = new Map();

const getAvailableCallbackUrls = async (domain: string): Promise<string[]> => {

    if (availableCallbackCache.has(domain)) {
        return availableCallbackCache.get(domain) as string[];
    }

    const availableCallbackUrls: string[] = await dnsResolver.V1.resolveAllowedCallback(domain);
    availableCallbackCache.set(domain, availableCallbackUrls);

    return availableCallbackUrls;
};

export const verifyInquiryAction = async <T extends InquiryActionType>(domain: string, action: InquiryAction<T>): Promise<boolean> => {

    switch (action.type) {

        case InquiryActionType.CALLBACK: {

            const fixedAction: InquiryAction<InquiryActionType.CALLBACK> = action as InquiryAction<InquiryActionType.CALLBACK>;

            const availableCallbackUrls: string[] = await getAvailableCallbackUrls(domain);

            const callbackUrlDomain: string = getDomainHostOfURL(fixedAction.payload);

            if (!availableCallbackUrls.includes(callbackUrlDomain)) {

                logAgent.error('Invalid callback url:', callbackUrlDomain, 'available callback urls:', availableCallbackUrls);
                return false;
            }
            return true;
        }
        case InquiryActionType.WEBHOOK: {
            return true;
        }
        case InquiryActionType.CLOSE: {
            return true;
        }
        default: {
            return false;
        }
    }
};
