/**
 * @author WMXPY
 * @namespace Actions_Verify
 * @description Verify
 */

export const getAuthorizationField = (headers: any): any => {

    if (headers.Authorization) {
        return headers.Authorization;
    }
    return headers.authorization;
};
