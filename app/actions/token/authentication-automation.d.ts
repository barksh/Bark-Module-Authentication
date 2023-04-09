import { IAccount } from "../../database/interface/account";
export type GenerateAuthenticationTokenConfig = {
    readonly domain: string;
    readonly account: IAccount;
};
export declare const generateAutomationAuthenticationToken: (config: GenerateAuthenticationTokenConfig) => Promise<string>;
