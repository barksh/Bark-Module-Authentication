export declare enum RecordType {
    UPDATE_PASSWORD = "UPDATE_PASSWORD"
}
export declare enum RecordChangePasswordSubType {
    USER_INITIATED_UPDATE = "USER_INITIATED_UPDATE"
}
export type RecordSubType<T extends RecordType> = T extends RecordType.UPDATE_PASSWORD ? RecordChangePasswordSubType : never;
