/**
 * @author WMXPY
 * @namespace Util_Network_DNS
 * @description IP
 */

import * as DNS from "node:dns";
import { logAgent } from "../../log/log";

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
                logAgent.error("DNS IP Error:", error);
                resolve(DNS_IP_RECORD_NOT_FOUND_SYMBOL);
                return;
            }

            if (typeof address === 'string') {
                resolve(address);
                return;
            }

            logAgent.error("DNS IP Internal Error, addresses:", error);
            resolve(DNS_IP_RECORD_NOT_FOUND_SYMBOL);
        });
    });
};
