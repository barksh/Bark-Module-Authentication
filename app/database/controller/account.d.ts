import { IAccountModel } from "../model/account";
export declare const AccountEmptySymbol: unique symbol;
export type CreateUnsavedAccountConfig = {
    readonly automation: boolean;
    readonly administrator: boolean;
};
export declare const createUnsavedAccount: (identifier: string, password: string, config: CreateUnsavedAccountConfig) => IAccountModel;
export declare const getAccountByIdentifier: (identifier: string) => Promise<IAccountModel | typeof AccountEmptySymbol>;
