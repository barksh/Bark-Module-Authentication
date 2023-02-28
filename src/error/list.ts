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
    [ERROR_CODE.INVALID_CALLBACK_URL_1]: 'Invalid Callback Url, {}',

    [ERROR_CODE.INVALID_TOKEN]: 'Invalid Token',

    [ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1]: 'Account Not Found Or Incorrect Password, {}',

    [ERROR_CODE.APPLICATION_NOT_INITIALIZED]: 'Application Not Initialized',
    [ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1]: 'Environment Variable Required But Not Found, {}',

    [ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1]: 'Application Initialized With Info Missing, {}',
};
