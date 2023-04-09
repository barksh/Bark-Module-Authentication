import { RefreshAuthToken } from "../token/refresh";
export declare const parseVerifyRefreshToken: (token: string) => Promise<RefreshAuthToken>;
export declare const verifyRefreshToken: (refreshToken: string) => Promise<RefreshAuthToken>;
