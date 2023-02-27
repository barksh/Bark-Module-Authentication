/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Record
 */

import { RecordSubType, RecordType } from "../declare/record";

export interface IRecordConfig<T extends RecordType> {

    readonly type: T;
    readonly subType: RecordSubType<T>;
    readonly data: any;
}

export interface IRecord<T extends RecordType> extends IRecordConfig<T> {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
