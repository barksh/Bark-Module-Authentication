/**
 * @author WMXPY
 * @namespace Database_Declare
 * @description Record
 */

export enum RecordType {

    UPDATE_PASSWORD = "UPDATE_PASSWORD",
}

export enum RecordChangePasswordSubType {

    USER_INITIATED_UPDATE = "USER_INITIATED_UPDATE",
}

export type RecordSubType<T extends RecordType> =
    T extends RecordType.UPDATE_PASSWORD
    ? RecordChangePasswordSubType
    : never;
