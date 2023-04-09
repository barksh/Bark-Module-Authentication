import { RecordSubType, RecordType } from "../declare/record";
import { IRecordModel } from "../model/record";
export declare const createUnsavedRecord: <T extends RecordType>(type: T, subType: RecordSubType<T>, payload: any) => IRecordModel;
