/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Inquiry
 */

import { Document, model, Model, Schema } from "mongoose";
import { IInquiry } from "../interface/inquiry";

const InquirySchema: Schema<IInquiryModel> = new Schema(
    {
        accountIdentifier: {
            type: String,
            required: true,
            index: true,
        },
        inquiryIdentifier: {
            type: String,
            required: true,
            index: true,
        },
        domain: {
            type: String,
            required: true,
        },
        issuedAt: {
            type: Date,
            required: true,
        },
        expireAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    },
);

export interface IInquiryModel extends IInquiry, Document {
}

export const InquiryModel: Model<IInquiryModel> = model<IInquiryModel>('Inquiry', InquirySchema);
