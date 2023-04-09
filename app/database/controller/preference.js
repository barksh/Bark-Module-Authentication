"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferenceByKey = exports.getOrDefaultPreferenceByKey = exports.createUnsavedPreference = exports.PreferenceEmptySymbol = void 0;
const preference_1 = require("../declare/preference");
const preference_2 = require("../model/preference");
exports.PreferenceEmptySymbol = Symbol('preference-empty');
const createUnsavedPreference = (key, value) => {
    const config = {
        key,
        value,
    };
    return new preference_2.PreferenceModel(config);
};
exports.createUnsavedPreference = createUnsavedPreference;
const getOrDefaultPreferenceByKey = async (key) => {
    const preference = await (0, exports.getPreferenceByKey)(key);
    if (preference === exports.PreferenceEmptySymbol) {
        return preference_1.DefaultPreference[key];
    }
    return preference;
};
exports.getOrDefaultPreferenceByKey = getOrDefaultPreferenceByKey;
const getPreferenceByKey = async (key) => {
    const preference = await preference_2.PreferenceModel.findOne({
        key,
    }).lean().exec();
    if (!preference) {
        return exports.PreferenceEmptySymbol;
    }
    return preference.value;
};
exports.getPreferenceByKey = getPreferenceByKey;
