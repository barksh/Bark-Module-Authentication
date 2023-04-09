import { InquiryAction } from "../interface/inquiry";
import { IInquiryModel } from "../model/inquiry";
export declare const InquiryEmptySymbol: unique symbol;
export type CreateInquiryConfig = {
    readonly actions?: InquiryAction[];
};
export declare const createUnsavedInquiry: (domain: string, config?: CreateInquiryConfig) => IInquiryModel;
export declare const getInquiryByIdentifier: (inquiryIdentifier: string) => Promise<IInquiryModel | typeof InquiryEmptySymbol>;
export declare const getValidInquiryByIdentifier: (inquiryIdentifier: string, currentTime?: Date) => Promise<IInquiryModel | typeof InquiryEmptySymbol>;
export declare const getInquiryByExposureKey: (exposureKey: string) => Promise<IInquiryModel | typeof InquiryEmptySymbol>;
export declare const getValidInquiryByExposureKey: (exposureKey: string, currentTime?: Date) => Promise<IInquiryModel | typeof InquiryEmptySymbol>;
export declare const getInquiryByHiddenKey: (hiddenKey: string) => Promise<IInquiryModel | typeof InquiryEmptySymbol>;
export declare const getValidInquiryByHiddenKey: (hiddenKey: string, currentTime?: Date) => Promise<IInquiryModel | typeof InquiryEmptySymbol>;
