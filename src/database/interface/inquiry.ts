/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Inquiry
 */

export enum InquiryActionType {

    CALLBACK = "CALLBACK",
    WEBHOOK = "WEBHOOK",
    CLOSE = "CLOSE",
}

export type InquiryActionPayloadType<T extends InquiryActionType>
    = T extends InquiryActionType.CALLBACK ? string
    : T extends InquiryActionType.WEBHOOK ? string
    : T extends InquiryActionType.CLOSE ? undefined
    : never;

export type InquiryAction<T extends InquiryActionType = any> = {

    readonly type: T;
    readonly payload: InquiryActionPayloadType<T>;
};

export interface IInquiryConfig {

    readonly inquiryIdentifier: string;

    readonly exposureKey: string;
    readonly hiddenKey: string;

    readonly actions: InquiryAction[];

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
