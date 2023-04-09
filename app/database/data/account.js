"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.PASSWORD_VALIDATE_RESPONSE = exports.validateIdentifier = exports.IDENTIFIER_VALIDATE_RESPONSE = void 0;
var IDENTIFIER_VALIDATE_RESPONSE;
(function (IDENTIFIER_VALIDATE_RESPONSE) {
    IDENTIFIER_VALIDATE_RESPONSE["TOO_SHORT"] = "TOO_SHORT";
    IDENTIFIER_VALIDATE_RESPONSE["NO_SPACE"] = "NO_SPACE";
    IDENTIFIER_VALIDATE_RESPONSE["MUST_START_WITH_LETTER"] = "MUST_START_WITH_LETTER";
    IDENTIFIER_VALIDATE_RESPONSE["ONLY_LETTERS_OR_NUMBERS"] = "ONLY_LETTERS_OR_NUMBERS";
    IDENTIFIER_VALIDATE_RESPONSE["OK"] = "OK";
})(IDENTIFIER_VALIDATE_RESPONSE = exports.IDENTIFIER_VALIDATE_RESPONSE || (exports.IDENTIFIER_VALIDATE_RESPONSE = {}));
const validateIdentifier = (username, length = 2, startWithLetter = true) => {
    if (username.length < length) {
        return IDENTIFIER_VALIDATE_RESPONSE.TOO_SHORT;
    }
    if (startWithLetter) {
        if (!/^[A-Za-z]$/.test(username.substring(0, 1))) {
            return IDENTIFIER_VALIDATE_RESPONSE.MUST_START_WITH_LETTER;
        }
    }
    if (username.includes(' ')) {
        return IDENTIFIER_VALIDATE_RESPONSE.NO_SPACE;
    }
    if (!/^([A-Za-z0-9]|-)+$/.test(username)) {
        return IDENTIFIER_VALIDATE_RESPONSE.ONLY_LETTERS_OR_NUMBERS;
    }
    return IDENTIFIER_VALIDATE_RESPONSE.OK;
};
exports.validateIdentifier = validateIdentifier;
var PASSWORD_VALIDATE_RESPONSE;
(function (PASSWORD_VALIDATE_RESPONSE) {
    PASSWORD_VALIDATE_RESPONSE["TOO_SHORT"] = "TOO_SHORT";
    PASSWORD_VALIDATE_RESPONSE["ONLY_KEYBOARD_CHARACTER_AVAILABLE"] = "ONLY_KEYBOARD_CHARACTER_AVAILABLE";
    PASSWORD_VALIDATE_RESPONSE["HAVE_TO_INCLUDE_LETTER"] = "HAVE_TO_INCLUDE_LETTER";
    PASSWORD_VALIDATE_RESPONSE["HAVE_TO_INCLUDE_NUMBER"] = "HAVE_TO_INCLUDE_NUMBER";
    PASSWORD_VALIDATE_RESPONSE["HAVE_TO_INCLUDE_SYMBOL"] = "HAVE_TO_INCLUDE_SYMBOL";
    PASSWORD_VALIDATE_RESPONSE["OK"] = "OK";
})(PASSWORD_VALIDATE_RESPONSE = exports.PASSWORD_VALIDATE_RESPONSE || (exports.PASSWORD_VALIDATE_RESPONSE = {}));
const validatePassword = (password, length = 8, haveToIncludeLetter = true, haveToIncludeNumber = true, haveToIncludeSymbol = false) => {
    if (password.length < length) {
        return PASSWORD_VALIDATE_RESPONSE.TOO_SHORT;
    }
    if (!/^([A-Za-z0-9]|[!@#$%^&*()[\]{};:'",./<>?~`\-+_=\\| ])+$/.test(password)) {
        return PASSWORD_VALIDATE_RESPONSE.ONLY_KEYBOARD_CHARACTER_AVAILABLE;
    }
    if (haveToIncludeLetter) {
        if (!/^.*[A-Za-z].*$/.test(password)) {
            return PASSWORD_VALIDATE_RESPONSE.HAVE_TO_INCLUDE_LETTER;
        }
    }
    if (haveToIncludeNumber) {
        if (!/^.*[0-9].*$/.test(password)) {
            return PASSWORD_VALIDATE_RESPONSE.HAVE_TO_INCLUDE_NUMBER;
        }
    }
    if (haveToIncludeSymbol) {
        if (!/^.*[!@#$%^&*()[\]{};:'",./<>?~`\-+_=\\| ].*$/.test(password)) {
            return PASSWORD_VALIDATE_RESPONSE.HAVE_TO_INCLUDE_SYMBOL;
        }
    }
    return PASSWORD_VALIDATE_RESPONSE.OK;
};
exports.validatePassword = validatePassword;
