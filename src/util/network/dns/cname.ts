/**
 * @author WMXPY
 * @namespace Util_Network_DNS
 * @description CName
 */

import * as DNS from "node:dns";
import { logAgent } from "../../log/log";

export const DNS_CNAME_RECORD_NOT_FOUND_SYMBOL = Symbol('dns-cname-record-not-found');

const AUTHENTICATION_MODULE_PREFIX: string =
    '_bark-module-authentication-v1';
const AUTHENTICATION_UI_PREFIX: string =
    '_bark-ui-authentication-v1';

export const dnsLookupAuthModuleCName = async (domain: string): Promise<string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL> => {

    return await dnsLookupCName(
        `${AUTHENTICATION_MODULE_PREFIX}.${domain}`,
    );
};

export const dnsLookupAuthUICName = async (domain: string): Promise<string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL> => {

    return await dnsLookupCName(
        `${AUTHENTICATION_UI_PREFIX}.${domain}`,
    );
};

export const dnsLookupCName = (domain: string): Promise<string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL> => {

    return new Promise((
        resolve: (
            value: string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL,
        ) => void,
    ) => {

        DNS.resolveCname(domain, (
            error: Error | null,
            addresses: string[] | undefined,
        ) => {

            if (error) {
                logAgent.error("DNS CNAME Error:", error);
                resolve(DNS_CNAME_RECORD_NOT_FOUND_SYMBOL);
                return;
            }

            if (Array.isArray(addresses)) {
                resolve(addresses[0]);
                return;
            }

            logAgent.error("DNS CNAME Internal Error, addresses:", error);
            resolve(DNS_CNAME_RECORD_NOT_FOUND_SYMBOL);
        });
    });
};
