"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPreference = exports.PreferenceKey = void 0;
var PreferenceKey;
(function (PreferenceKey) {
    PreferenceKey["ALLOW_PUBLIC_REGISTER"] = "ALLOW_PUBLIC_REGISTER";
})(PreferenceKey = exports.PreferenceKey || (exports.PreferenceKey = {}));
exports.DefaultPreference = {
    [PreferenceKey.ALLOW_PUBLIC_REGISTER]: false,
};
