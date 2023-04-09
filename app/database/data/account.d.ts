export declare enum IDENTIFIER_VALIDATE_RESPONSE {
    TOO_SHORT = "TOO_SHORT",
    NO_SPACE = "NO_SPACE",
    MUST_START_WITH_LETTER = "MUST_START_WITH_LETTER",
    ONLY_LETTERS_OR_NUMBERS = "ONLY_LETTERS_OR_NUMBERS",
    OK = "OK"
}
export declare const validateIdentifier: (username: string, length?: number, startWithLetter?: boolean) => IDENTIFIER_VALIDATE_RESPONSE;
export declare enum PASSWORD_VALIDATE_RESPONSE {
    TOO_SHORT = "TOO_SHORT",
    ONLY_KEYBOARD_CHARACTER_AVAILABLE = "ONLY_KEYBOARD_CHARACTER_AVAILABLE",
    HAVE_TO_INCLUDE_LETTER = "HAVE_TO_INCLUDE_LETTER",
    HAVE_TO_INCLUDE_NUMBER = "HAVE_TO_INCLUDE_NUMBER",
    HAVE_TO_INCLUDE_SYMBOL = "HAVE_TO_INCLUDE_SYMBOL",
    OK = "OK"
}
export declare const validatePassword: (password: string, length?: number, haveToIncludeLetter?: boolean, haveToIncludeNumber?: boolean, haveToIncludeSymbol?: boolean) => PASSWORD_VALIDATE_RESPONSE;
