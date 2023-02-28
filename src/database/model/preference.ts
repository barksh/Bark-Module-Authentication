/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Preference
 */

import { Document, model, Model, Schema } from "mongoose";
import { IPreference } from "../interface/preference";

const PreferenceSchema: Schema<IPreferenceModel> = new Schema(
    {
        key: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        value: {
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

export interface IPreferenceModel extends IPreference<any>, Document {
}

export const PreferenceModel: Model<IPreferenceModel> = model<IPreferenceModel>('Preference', PreferenceSchema);
