/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Preference
 */

import { DefaultPreference, PreferenceKey, PreferenceValueType } from "../declare/preference";
import { IPreference, IPreferenceConfig } from "../interface/preference";
import { IPreferenceModel, PreferenceModel } from "../model/preference";

export const PreferenceEmptySymbol = Symbol('preference-empty');

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

export const getOrDefaultPreferenceByKey = async <T extends PreferenceKey>(key: T): Promise<PreferenceValueType<T>> => {

    const preference: PreferenceValueType<T> | typeof PreferenceEmptySymbol = await getPreferenceByKey(key);

    if (preference === PreferenceEmptySymbol) {
        return DefaultPreference[key];
    }

    return preference;
};

export const getPreferenceByKey = async <T extends PreferenceKey>(key: T): Promise<PreferenceValueType<T> | typeof PreferenceEmptySymbol> => {


    const preference: IPreference<T> | null = await PreferenceModel.findOne({
        key,
    }).lean().exec();

    if (!preference) {
        return PreferenceEmptySymbol;
    }

    return preference.value;
};
