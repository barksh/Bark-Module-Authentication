import { PreferenceKey, PreferenceValueType } from "../declare/preference";
import { IPreferenceModel } from "../model/preference";
export declare const PreferenceEmptySymbol: unique symbol;
export declare const createUnsavedPreference: <T extends PreferenceKey>(key: T, value: PreferenceValueType<T>) => IPreferenceModel;
export declare const getOrDefaultPreferenceByKey: <T extends PreferenceKey>(key: T) => Promise<PreferenceValueType<T>>;
export declare const getPreferenceByKey: <T extends PreferenceKey>(key: T) => Promise<typeof PreferenceEmptySymbol | PreferenceValueType<T>>;
