/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Inquiry
 */

import { Document, model, Model, Schema } from "mongoose";
import { IInquiry, InquiryAction } from "../interface/inquiry";

export const InquiryActionSchema: Schema<InquiryAction> = new Schema({

    type: {
        type: String,
        required: true,
    },
    payload: {
        type: Schema.Types.Mixed,
        required: false,
    },
}, { _id: false });

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

        actions: {
            type: [InquiryActionSchema],
            required: true,
            default: [],
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
    },
);

export interface IInquiryModel extends IInquiry, Document {
}

export const InquiryModel: Model<IInquiryModel> = model<IInquiryModel>('Inquiry', InquirySchema);
