/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Refresh Token
 */


export interface IRefreshTokenConfig {

    readonly accountIdentifier: string;
    readonly inquiryIdentifier: string;
    readonly refreshTokenIdentifier: string;

    authenticationTokens: string[];

    readonly domain: string;
    readonly issuedAt: Date;
    readonly expireAt: Date;
}

export interface IRefreshToken extends IRefreshTokenConfig {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
