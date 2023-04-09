import { JWTToken } from "@sudoo/jwt";
export declare const getAuthorizationField: (headers: any) => any;
export declare const verifyCommonTokenFields: (token: JWTToken<{
    readonly purpose: string;
}, any>, purpose: string) => boolean;
