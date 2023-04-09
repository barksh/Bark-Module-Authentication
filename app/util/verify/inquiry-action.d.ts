import { InquiryAction, InquiryActionType } from "../../database/interface/inquiry";
export declare const verifyInquiryAction: <T extends InquiryActionType>(domain: string, action: InquiryAction<T>) => Promise<boolean>;
