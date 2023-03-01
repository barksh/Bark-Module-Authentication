/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Inquiry
 */


export interface IInquiryConfig {

    readonly inquiryIdentifier: string;
    readonly accountIdentifier: string;

    readonly domain: string;

    readonly issuedAt: Date;
    readonly expireAt: Date;
}

export interface IInquiry extends IInquiryConfig {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
