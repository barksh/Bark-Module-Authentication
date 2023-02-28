/**
 * @author WMXPY
 * @namespace Database_Data
 * @description Account
 */

export enum IDENTIFIER_VALIDATE_RESPONSE {

    TOO_SHORT = "TOO_SHORT",
    NO_SPACE = "NO_SPACE",
    MUST_START_WITH_LETTER = "MUST_START_WITH_LETTER",
    ONLY_LETTERS_OR_NUMBERS = "ONLY_LETTERS_OR_NUMBERS",
    OK = "OK",
}

export const validateIdentifier = (
    username: string,
    length: number = 2,
    startWithLetter: boolean = true,
): IDENTIFIER_VALIDATE_RESPONSE => {

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


export enum PASSWORD_VALIDATE_RESPONSE {

    TOO_SHORT = "TOO_SHORT",
    ONLY_KEYBOARD_CHARACTER_AVAILABLE = "ONLY_KEYBOARD_CHARACTER_AVAILABLE",
    HAVE_TO_INCLUDE_LETTER = "HAVE_TO_INCLUDE_LETTER",
    HAVE_TO_INCLUDE_NUMBER = "HAVE_TO_INCLUDE_NUMBER",
    HAVE_TO_INCLUDE_SYMBOL = "HAVE_TO_INCLUDE_SYMBOL",
    OK = "OK",
}

export const validatePassword = (
    password: string,
    length: number = 8,
    haveToIncludeLetter: boolean = true,
    haveToIncludeNumber: boolean = true,
    haveToIncludeSymbol: boolean = false,
): PASSWORD_VALIDATE_RESPONSE => {

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
        if (!/.+[!@#$%^&*()[\]{};:'",./<>?~`-+_=].+/.test(password)) {
            return PASSWORD_VALIDATE_RESPONSE.HAVE_TO_INCLUDE_SYMBOL;
        }
    }

    return PASSWORD_VALIDATE_RESPONSE.OK;
};
