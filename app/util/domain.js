"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDomainName = exports.getDomainHostOfURL = void 0;
const node_url_1 = require("node:url");
const fixDomainUrl = (url) => {
    if (!url.startsWith('http://')
        && !url.startsWith('https://')) {
        return new node_url_1.URL(`https://${url}`);
    }
    return new node_url_1.URL(url);
};
const getDomainHostOfURL = (url) => {
    const parsed = fixDomainUrl(url);
    if (typeof parsed.port === 'string'
        && parsed.port.length > 0) {
        return `${parsed.hostname}:${parsed.port}`;
    }
    return parsed.hostname;
};
exports.getDomainHostOfURL = getDomainHostOfURL;
const validateDomainName = (host) => {
    const localhostRegexp = /^localhost:\d{3,5}$/;
    if (localhostRegexp.test(host)) {
        return true;
    }
    const regexp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    return regexp.test(host);
};
exports.validateDomainName = validateDomainName;
