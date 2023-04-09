import { IAccount } from "../../database/interface/account";
import { IRefreshToken } from "../../database/interface/refresh-token";
export type GenerateUserAuthenticationTokenConfig = {
    readonly account: IAccount;
    readonly refreshToken: IRefreshToken;
};
export declare const generateUserAuthenticationTokenByRefreshToken: (config: GenerateUserAuthenticationTokenConfig) => Promise<string>;
