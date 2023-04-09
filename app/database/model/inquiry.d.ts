import { Document, Model, Schema } from "mongoose";
import { IInquiry, InquiryAction } from "../interface/inquiry";
export declare const InquiryActionSchema: Schema<InquiryAction>;
export interface IInquiryModel extends IInquiry, Document {
}
export declare const InquiryModel: Model<IInquiryModel>;
