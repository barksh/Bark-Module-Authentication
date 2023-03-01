/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Record
 */

import { RecordSubType, RecordType } from "../declare/record";
import { IRecordConfig } from "../interface/record";
import { IRecordModel, RecordModel } from "../model/record";

export const createUnsavedRecord = <T extends RecordType>(
    type: T,
    subType: RecordSubType<T>,
    payload: any,
): IRecordModel => {

    const record: IRecordModel = new RecordModel({
        type,
        subType,
        payload,
    } as IRecordConfig<T>);
    return record;
};
