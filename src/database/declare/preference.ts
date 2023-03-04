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

export const DefaultPreference: PreferenceRecord = {

    [PreferenceKey.ALLOW_PUBLIC_REGISTER]: false,
};

export type PreferenceValueType<T extends PreferenceKey> = PreferenceRecord[T];
