/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Preference
 */

import { PreferenceKey, PreferenceValueType } from "../declare/preference";

export interface IPreferenceConfig<T extends PreferenceKey> {

    readonly key: T;
    readonly value: PreferenceValueType<T>;
}

export interface IPreference<T extends PreferenceKey> extends IPreferenceConfig<T> {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
