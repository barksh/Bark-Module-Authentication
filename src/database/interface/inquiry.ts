/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Inquiry
 */


export interface IInquiryConfig {

    readonly accountIdentifier: string;
    readonly inquiryIdentifier: string;

    refreshTokens: string[];

    readonly domain: string;
    readonly issuedAt: Date;
    readonly expireAt: Date;
}

export interface IInquiry extends IInquiryConfig {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
