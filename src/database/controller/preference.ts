/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Preference
 */

import { PreferenceKey, PreferenceValueType } from "../declare/preference";
import { IPreferenceConfig } from "../interface/preference";
import { IPreferenceModel, PreferenceModel } from "../model/preference";

export const createUnsavedPreference = <T extends PreferenceKey>(
    key: T,
    value: PreferenceValueType<T>,
): IPreferenceModel => {

    const config: IPreferenceConfig<T> = {
        key,
        value,
    };
    return new PreferenceModel(config);
};
