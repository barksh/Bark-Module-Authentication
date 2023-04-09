export declare enum PreferenceKey {
    ALLOW_PUBLIC_REGISTER = "ALLOW_PUBLIC_REGISTER"
}
export type PreferenceRecord = {
    [PreferenceKey.ALLOW_PUBLIC_REGISTER]: boolean;
};
export declare const DefaultPreference: PreferenceRecord;
export type PreferenceValueType<T extends PreferenceKey> = PreferenceRecord[T];
