/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Account
 */

import { Saltilizer } from "@sudoo/password";
import { randomUnique } from "@sudoo/random";
import { Document, model, Model, Schema } from "mongoose";
import { generateTwoFactorKey, generateTwoFactorURL, verifyTwoFactorCode } from "../../util/two-factor";
import { defaultInitialAttemptPoints } from "../declare/account";
import { IAccount, PreviousPassword, PreviousPasswordReason } from "../interface/account";

const PreviousPasswordSchema: Schema = new Schema({

    password: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    changedAt: {
        type: Date,
        required: true,
    },
}, { _id: false });

const AccountSchema: Schema<IAccountModel> = new Schema(
    {
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
        identifier: {
            type: String,
            required: true,
        },
        attemptPoints: {
            type: Number,
            required: true,
            default: defaultInitialAttemptPoints,
        },
        limbo: {
            type: Boolean,
            required: true,
            default: false,
        },
        twoFactor: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        previousPasswords: {
            type: [PreviousPasswordSchema],
            required: true,
            default: [],
        },

        mint: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    },
);

export interface IAccountModel extends IAccount, Document {

    resetAttempt(amount?: number): IAccountModel;
    useAttemptPoint(point: number): IAccountModel;
    addAttemptPoint(point: number): IAccountModel;
    generateAndSetTwoFA(systemName?: string): string;
    verifyTwoFA(code: string): boolean;
    setPassword(password: string, reason: PreviousPasswordReason): IAccountModel;
    addPreviousPassword(password: string, reason: PreviousPasswordReason): IAccountModel;
    resetMint(): IAccountModel;
    verifyPassword(password: string): boolean;
    verifyPreviousPassword(password: string): PreviousPassword | null;
}

AccountSchema.methods.useAttemptPoint = function (this: IAccountModel, point: number): IAccountModel {

    this.attemptPoints = this.attemptPoints - Math.abs(point);

    return this;
};

AccountSchema.methods.addAttemptPoint = function (this: IAccountModel, point: number): IAccountModel {

    this.attemptPoints = this.attemptPoints + Math.abs(point);

    return this;
};

AccountSchema.methods.resetAttempt = function (this: IAccountModel, amount: number = defaultInitialAttemptPoints): IAccountModel {

    this.attemptPoints = amount;

    return this;
};

AccountSchema.methods.generateAndSetTwoFA = function (this: IAccountModel, systemName: string): string {

    const key: string = generateTwoFactorKey();
    const url: string = generateTwoFactorURL(systemName, this.identifier, key);

    this.twoFactor = key;

    return url;
};

AccountSchema.methods.verifyTwoFA = function (this: IAccountModel, code: string): boolean {

    const key: string | undefined = this.twoFactor;

    if (!key) {
        return false;
    }

    return verifyTwoFactorCode(key, code);
};

AccountSchema.methods.setPassword = function (this: IAccountModel, password: string, reason: PreviousPasswordReason): IAccountModel {

    const saltilizer: Saltilizer = Saltilizer.create(this.salt);

    const oldPassword: string = this.password;
    const saltedPassword: string = saltilizer.encrypt(password);

    this.password = saltedPassword;
    this.addPreviousPassword(oldPassword, reason);

    this.resetMint();

    return this;
};

AccountSchema.methods.addPreviousPassword = function (this: IAccountModel, password: string, reason: PreviousPasswordReason): IAccountModel {

    this.previousPasswords = [
        ...this.previousPasswords,
        {
            password,
            reason,
            changedAt: new Date(),
        },
    ];

    return this;
};

AccountSchema.methods.resetMint = function (this: IAccountModel): IAccountModel {

    this.mint = randomUnique();

    return this;
};

AccountSchema.methods.verifyPassword = function (this: IAccountModel, password: string): boolean {

    const saltilizer: Saltilizer = Saltilizer.create(this.salt);
    const saltedPassword: string = saltilizer.encrypt(password);

    return this.password === saltedPassword;
};

AccountSchema.methods.verifyPreviousPassword = function (this: IAccountModel, password: string): PreviousPassword | null {

    const saltilizer: Saltilizer = Saltilizer.create(this.salt);
    const saltedPassword: string = saltilizer.encrypt(password);

    for (const previousPassword of this.previousPasswords) {
        if (previousPassword.password === saltedPassword) {
            return previousPassword;
        }
    }

    return null;
};

export const AccountModel: Model<IAccountModel> = model<IAccountModel>('Account', AccountSchema);
