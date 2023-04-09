import { Document, Model } from "mongoose";
import { IPreference } from "../interface/preference";
export interface IPreferenceModel extends IPreference<any>, Document {
}
export declare const PreferenceModel: Model<IPreferenceModel>;
