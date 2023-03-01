/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Inquiry
 */


export interface IInquiryConfig {

    readonly inquiryIdentifier: string;

    readonly exposureKey: string;
    readonly hiddenKey: string;

    readonly webhookUrl?: string;
    readonly callbackUrl?: string;

    realized: boolean;
    accountIdentifier?: string;

    readonly domain: string;

    readonly issuedAt: Date;
    readonly expireAt: Date;
}

export interface IInquiry extends IInquiryConfig {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
