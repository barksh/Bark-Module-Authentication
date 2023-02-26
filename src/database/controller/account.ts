/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Account
 */

import { AccountModel, IAccountModel } from "../model/account";
import { randomUnique } from "@sudoo/random";
import { IAccountConfig } from "../interface/account";
import { Saltilizer } from "@sudoo/password";

export const createUnsavedAccount = (
    identifier: string,
    password: string,
): IAccountModel => {

    const salt: string = randomUnique();
    const mint: string = randomUnique();

    const saltilizer: Saltilizer = Saltilizer.create(salt);
    const saltedPassword: string = saltilizer.encrypt(password);

    const config: IAccountConfig = {

        identifier,
        password: saltedPassword,
        previousPasswords: [],
        mint,
        salt,
    };
    return new AccountModel(config);
};
