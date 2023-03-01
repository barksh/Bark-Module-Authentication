/**
 * @author WMXPY
 * @namespace Util_Network
 * @description Domain
 */

import { URL } from 'node:url';

export const getDomainHostOfURL = (url: string): string => {

    if (!url.startsWith('http://')
        && !url.startsWith('https://')) {

        const parsedAdded: URL = new URL(`https://${url}`);
        return parsedAdded.hostname;
    }

    const parsed: URL = new URL(url);
    return parsed.hostname;
};

export const validateDomainName = (host: string): boolean => {

    const regexp: RegExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    return regexp.test(host);
};
