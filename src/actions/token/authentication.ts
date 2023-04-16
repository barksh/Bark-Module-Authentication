/**
 * @author WMXPY
 * @namespace Actions_Token
 * @description Authentication Refresh Token
 */

import { JWTToken } from "@sudoo/jwt";

export type AuthenticationTokenHeader = {

    readonly purpose: 'Authentication';
};

export type AuthenticationTokenBody = {

    readonly identifier: string;

    readonly automation: boolean;
    readonly administrator: boolean;

    readonly refreshTokenIdentifier: string;
};

export type AuthenticationAuthToken = JWTToken<AuthenticationTokenHeader, AuthenticationTokenBody>;
