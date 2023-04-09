import { Document, Model } from "mongoose";
import { IRecord } from "../interface/record";
export interface IRecordModel extends IRecord<any>, Document {
}
export declare const RecordModel: Model<IRecordModel>;
