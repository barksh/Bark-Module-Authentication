"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountByIdentifier = exports.createUnsavedAccount = exports.AccountEmptySymbol = void 0;
const password_1 = require("@sudoo/password");
const random_1 = require("@sudoo/random");
const uuid_1 = require("@sudoo/uuid");
const account_1 = require("../model/account");
exports.AccountEmptySymbol = Symbol('account-empty');
const createUnsavedAccount = (identifier, password, config) => {
    const salt = (0, random_1.randomUnique)();
    const mint = uuid_1.UUIDVersion1.generate().toString();
    const saltilizer = password_1.Saltilizer.create(salt);
    const saltedPassword = saltilizer.encrypt(password);
    const accountConfig = {
        identifier,
        password: saltedPassword,
        automation: config.automation,
        administrator: config.administrator,
        mint,
        salt,
    };
    return new account_1.AccountModel(accountConfig);
};
exports.createUnsavedAccount = createUnsavedAccount;
const getAccountByIdentifier = async (identifier) => {
    const account = await account_1.AccountModel.findOne({
        identifier,
    }).exec();
    if (!account) {
        return exports.AccountEmptySymbol;
    }
    return account;
};
exports.getAccountByIdentifier = getAccountByIdentifier;
