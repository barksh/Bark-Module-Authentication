import { JWTToken } from "@sudoo/jwt";
export type AuthenticationTokenHeader = {
    readonly purpose: 'Authentication';
};
export type AuthenticationTokenBody = {
    readonly identifier: string;
    readonly automation: boolean;
    readonly administrator: boolean;
};
export type AuthenticationAuthToken = JWTToken<AuthenticationTokenHeader, AuthenticationTokenBody>;
