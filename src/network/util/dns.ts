/**
 * @author WMXPY
 * @namespace Network_Util
 * @description DNS
 */

import * as DNS from "node:dns";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

export const dnsLookupIp = async (domain: string): Promise<string> => {

    return new Promise((
        resolve: (value: string) => void,
        reject: (reason: Error) => void,
    ) => {

        DNS.lookup(domain, (
            error: Error | null,
            address: string | undefined,
        ) => {

            if (error) {
                reject(error);
                return;
            }

            if (typeof address === 'string') {
                resolve(address);
                return;
            }

            reject(panic.code(ERROR_CODE.INVALID_DOMAIN_1, domain));
        });
    });
};

export const dnsLookupText = async (domain: string): Promise<string> => {

    return new Promise((
        resolve: (value: string) => void,
        reject: (reason: Error) => void,
    ) => {

        DNS.resolveTxt(domain, (
            error: Error | null,
            addresses: string[][] | undefined,
        ) => {

            if (error) {
                reject(error);
                return;
            }

            if (Array.isArray(addresses)) {
                resolve(addresses[0][0]);
                return;
            }

            reject(panic.code(ERROR_CODE.INVALID_DOMAIN_1, domain));

        });
    });
};

export const dnsLookupCName = async (domain: string): Promise<string> => {

    return new Promise((
        resolve: (value: string) => void,
        reject: (reason: Error) => void,
    ) => {

        DNS.resolveCname(domain, (
            error: Error | null,
            addresses: string[] | undefined,
        ) => {

            if (error) {
                reject(error);
                return;
            }

            if (Array.isArray(addresses)) {
                resolve(addresses[0]);
                return;
            }

            reject(panic.code(ERROR_CODE.INVALID_DOMAIN_1, domain));
        });
    });
};
