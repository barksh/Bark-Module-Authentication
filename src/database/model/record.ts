/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Record
 */

import { Document, model, Model, Schema } from "mongoose";
import { IRecord } from "../interface/record";

const RecordSchema: Schema<IRecordModel> = new Schema(
    {
        type: {
            type: String,
            required: true,
        },
        subType: {
            type: String,
            required: true,
        },
        payload: {
            type: Schema.Types.Mixed,
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

export interface IRecordModel extends IRecord<any>, Document {
}

export const RecordModel: Model<IRecordModel> = model<IRecordModel>('Record', RecordSchema);
