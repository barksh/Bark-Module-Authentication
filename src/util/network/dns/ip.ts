/**
 * @author WMXPY
 * @namespace Util_Network_DNS
 * @description IP
 */

import * as DNS from "node:dns";

export const DNS_IP_RECORD_NOT_FOUND_SYMBOL = Symbol('dns-ip-record-not-found');

export const dnsLookupIp = (domain: string): Promise<string | typeof DNS_IP_RECORD_NOT_FOUND_SYMBOL> => {

    return new Promise((
        resolve: (
            value: string | typeof DNS_IP_RECORD_NOT_FOUND_SYMBOL,
        ) => void,
    ) => {

        DNS.lookup(domain, (
            error: Error | null,
            address: string | undefined,
        ) => {

            if (error) {
                console.log("[BARK] DNS IP Error:", error);
                resolve(DNS_IP_RECORD_NOT_FOUND_SYMBOL);
                return;
            }

            if (typeof address === 'string') {
                resolve(address);
                return;
            }

            console.log("[BARK] DNS IP Internal Error, address:", address);
            resolve(DNS_IP_RECORD_NOT_FOUND_SYMBOL);
        });
    });
};
