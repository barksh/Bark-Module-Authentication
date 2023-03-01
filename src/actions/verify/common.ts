/**
 * @author WMXPY
 * @namespace Actions_Verify
 * @description Verify
 */

import { JWTToken } from "@sudoo/jwt";
import { logAgent } from "../../util/log/log";

export const getAuthorizationField = (headers: any): any => {

    if (headers.Authorization) {
        return headers.Authorization;
    }
    return headers.authorization;
};

export const verifyCommonTokenFields = (token: JWTToken<{
    readonly purpose: string;
}, any>, purpose: string): boolean => {

    if (typeof token.header.exp !== 'number') {
        logAgent.error('Token ExpiredAt not exist, Header:', token.header, 'Body:', token.body);
        return false;
    }

    if (typeof token.header.iat !== 'number') {
        logAgent.error('Token IssuedAt not exist, Header:', token.header, 'Body:', token.body);
        return false;
    }

    if (token.header.kty !== 'Bark') {
        logAgent.error('Token Key Type Invalid, Header:', token.header, 'Body:', token.body);
        return false;
    }

    if (token.header.purpose !== purpose) {
        logAgent.error('Token Purpose Invalid, Header:', token.header, 'Body:', token.body);
        return false;
    }

    return true;
};
