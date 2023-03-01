/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Inquiry
 */

import { Document, model, Model, Schema } from "mongoose";
import { IInquiry } from "../interface/inquiry";

const InquirySchema: Schema<IInquiryModel> = new Schema(
    {
        inquiryIdentifier: {
            type: String,
            required: true,
            index: true,
        },

        exposureKey: {
            type: String,
            required: true,
            index: true,
        },
        hiddenKey: {
            type: String,
            required: true,
            index: true,
        },

        webhookUrl: {
            type: String,
            required: false,
        },
        callbackUrl: {
            type: String,
            required: false,
        },

        realized: {
            type: Boolean,
            required: true,
            default: false,
        },
        accountIdentifier: {
            type: String,
            required: false,
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
        id: false,
        _id: false,
    },
);

export interface IInquiryModel extends IInquiry, Document {
}

export const InquiryModel: Model<IInquiryModel> = model<IInquiryModel>('Inquiry', InquirySchema);
