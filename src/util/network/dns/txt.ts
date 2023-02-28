/**
 * @author WMXPY
 * @namespace Util_Network_DNS
 * @description Txt
 */

import * as DNS from "node:dns";

export const DNS_TXT_RECORD_NOT_FOUND_SYMBOL = Symbol('dns-txt-record-not-found');

const ALLOWED_CALLBACK_PREFIX: string =
    '_bark-allowed-callback-v1';

export const dnsLookupAuthModuleTxt = async (domain: string): Promise<string[]> => {

    const txtValue: string | typeof DNS_TXT_RECORD_NOT_FOUND_SYMBOL =
        await dnsLookupTxt(
            `${ALLOWED_CALLBACK_PREFIX}.${domain}`,
        );

    if (txtValue === DNS_TXT_RECORD_NOT_FOUND_SYMBOL) {
        return [domain];
    }

    const domainList: string[] = txtValue
        .split(',')
        .map((each: string) => each.trim());

    if (domainList.includes(domain)) {
        return domainList;
    }

    return [domain, ...domainList];
};

export const dnsLookupTxt = (domain: string): Promise<string | typeof DNS_TXT_RECORD_NOT_FOUND_SYMBOL> => {

    return new Promise((
        resolve: (
            value: string | typeof DNS_TXT_RECORD_NOT_FOUND_SYMBOL,
        ) => void,
    ) => {

        DNS.resolveTxt(domain, (
            error: Error | null,
            addresses: string[][] | undefined,
        ) => {

            if (error) {
                console.log("[BARK] DNS TXT Error:", error);
                resolve(DNS_TXT_RECORD_NOT_FOUND_SYMBOL);
                return;
            }

            if (Array.isArray(addresses)) {
                resolve(addresses[0][0]);
                return;
            }

            console.log("[BARK] DNS TXT Internal Error, addresses:", addresses);
            resolve(DNS_TXT_RECORD_NOT_FOUND_SYMBOL);
        });
    });
};
