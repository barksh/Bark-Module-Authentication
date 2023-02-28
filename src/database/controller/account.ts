/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Account
 */

import { Saltilizer } from "@sudoo/password";
import { randomUnique } from "@sudoo/random";
import { UUIDVersion1 } from "@sudoo/uuid";
import { IAccountConfig } from "../interface/account";
import { AccountModel, IAccountModel } from "../model/account";

export const AccountEmptySymbol = Symbol('account-empty');

export const createUnsavedAccount = (
    identifier: string,
    password: string,
): IAccountModel => {

    const salt: string = randomUnique();
    const mint: string = UUIDVersion1.generate().toString();

    const saltilizer: Saltilizer = Saltilizer.create(salt);
    const saltedPassword: string = saltilizer.encrypt(password);

    const config: IAccountConfig = {

        identifier,
        password: saltedPassword,
        mint,
        salt,
    };
    return new AccountModel(config);
};

export const getAccountByIdentifier = async (identifier: string): Promise<IAccountModel | typeof AccountEmptySymbol> => {

    const account: IAccountModel | null = await AccountModel.findOne({
        identifier,
    }).exec();

    if (!account) {
        return AccountEmptySymbol;
    }

    return account;
};
