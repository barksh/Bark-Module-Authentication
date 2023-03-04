/**
 * @author WMXPY
 * @namespace Error
 * @description List
 */

import { ERROR_CODE } from "./code";

export const ERROR_LIST: Record<ERROR_CODE, string> = {

    [ERROR_CODE.INVALID_IDENTIFIER_1]: 'Invalid Identifier, {}',
    [ERROR_CODE.INVALID_PASSWORD_1]: 'Invalid Password, {}',
    [ERROR_CODE.INVALID_DOMAIN_1]: 'Invalid Domain, {}',
    [ERROR_CODE.INVALID_INQUIRY_ACTION_1]: 'Invalid Inquiry Action, {}',

    [ERROR_CODE.INVALID_TOKEN]: 'Invalid Token',

    [ERROR_CODE.INQUIRY_NOT_REALIZED_1]: 'Inquiry Not Realized, {}',

    [ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1]: 'Account Not Found Or Incorrect Password, {}',
    [ERROR_CODE.ACCOUNT_NOT_FOUND_1]: 'Account Not Found, {}',
    [ERROR_CODE.INQUIRY_NOT_FOUND_BY_EXPOSURE_KEY_1]: 'Inquiry Not Found By Exposure Key, {}',
    [ERROR_CODE.INQUIRY_NOT_FOUND_BY_HIDDEN_KEY_1]: 'Inquiry Not Found By Hidden Key, {}',
    [ERROR_CODE.PREFERENCE_NOT_FOUND_1]: 'Preference Not Found, {}',
    [ERROR_CODE.RECORD_NOT_FOUND_1]: 'Record Not Found, {}',
    [ERROR_CODE.REFRESH_TOKEN_NOT_FOUND_1]: 'Refresh Token Not Found, {}',
    [ERROR_CODE.SECRET_NOT_FOUND_1]: 'Secret Not Found, {}',

    [ERROR_CODE.PUBLIC_REGISTER_IS_NOT_ALLOWED]: 'Public Register Is Not Allowed',

    [ERROR_CODE.APPLICATION_NOT_INITIALIZED]: 'Application Not Initialized',
    [ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1]: 'Environment Variable Required But Not Found, {}',

    [ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1]: 'Application Initialized With Info Missing, {}',
};
