"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_LIST = void 0;
const code_1 = require("./code");
exports.ERROR_LIST = {
    [code_1.ERROR_CODE.INVALID_IDENTIFIER_1]: 'Invalid Identifier, {}',
    [code_1.ERROR_CODE.INVALID_PASSWORD_1]: 'Invalid Password, {}',
    [code_1.ERROR_CODE.INVALID_DOMAIN_1]: 'Invalid Domain, {}',
    [code_1.ERROR_CODE.INVALID_INQUIRY_ACTION_1]: 'Invalid Inquiry Action, {}',
    [code_1.ERROR_CODE.INVALID_TOKEN]: 'Invalid Token',
    [code_1.ERROR_CODE.INQUIRY_NOT_REALIZED_1]: 'Inquiry Not Realized, {}',
    [code_1.ERROR_CODE.CANNOT_REALIZE_INQUIRY_WITH_AUTOMATION_ACCOUNT_1]: 'Cannot Realize Inquiry With Automation Account, {}',
    [code_1.ERROR_CODE.CANNOT_REFRESH_TOKEN_WITH_AUTOMATION_ACCOUNT_1]: 'Cannot Refresh Token With Automation Account, {}',
    [code_1.ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1]: 'Account Not Found Or Incorrect Password, {}',
    [code_1.ERROR_CODE.ACCOUNT_NOT_FOUND_1]: 'Account Not Found, {}',
    [code_1.ERROR_CODE.INQUIRY_NOT_FOUND_BY_EXPOSURE_KEY_1]: 'Inquiry Not Found By Exposure Key, {}',
    [code_1.ERROR_CODE.INQUIRY_NOT_FOUND_BY_HIDDEN_KEY_1]: 'Inquiry Not Found By Hidden Key, {}',
    [code_1.ERROR_CODE.PREFERENCE_NOT_FOUND_1]: 'Preference Not Found, {}',
    [code_1.ERROR_CODE.RECORD_NOT_FOUND_1]: 'Record Not Found, {}',
    [code_1.ERROR_CODE.REFRESH_TOKEN_NOT_FOUND_1]: 'Refresh Token Not Found, {}',
    [code_1.ERROR_CODE.SECRET_NOT_FOUND_1]: 'Secret Not Found, {}',
    [code_1.ERROR_CODE.PUBLIC_REGISTER_IS_NOT_ALLOWED]: 'Public Register Is Not Allowed',
    [code_1.ERROR_CODE.APPLICATION_NOT_INITIALIZED]: 'Application Not Initialized',
    [code_1.ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1]: 'Environment Variable Required But Not Found, {}',
    [code_1.ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1]: 'Application Initialized With Info Missing, {}',
    [code_1.ERROR_CODE.CANNOT_GENERATE_AUTOMATION_TOKEN_BY_REFRESH_TOKEN_1]: 'Cannot Generate Automation Token By Refresh Token, {}',
    [code_1.ERROR_CODE.CANNOT_GENERATE_USER_AUTHENTICATION_TOKEN_BY_ACCOUNT_1]: 'Cannot Generate User Authentication Token By Account, {}',
};
