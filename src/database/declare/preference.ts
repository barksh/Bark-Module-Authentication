/**
 * @author WMXPY
 * @namespace Database_Declare
 * @description Preference
 */

export enum PreferenceKey {

    ALLOW_PUBLIC_REGISTER = "ALLOW_PUBLIC_REGISTER",
}

export type PreferenceRecord = {

    [PreferenceKey.ALLOW_PUBLIC_REGISTER]: boolean;
};

export type PreferenceValueType<T extends PreferenceKey> = PreferenceRecord[T];
