/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Account
 */

import { Saltilizer } from "@sudoo/password";
import { UUIDVersion1 } from "@sudoo/uuid";
import { Document, model, Model, Schema } from "mongoose";
import { generateTwoFactorKey, generateTwoFactorURL, verifyTwoFactorCode } from "../../util/two-factor";
import { defaultInitialAttemptPoints } from "../declare/account";
import { IAccount } from "../interface/account";

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
            index: true,
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
        methods: {
            useAttemptPoint(this: IAccountModel, point: number): IAccountModel {

                this.attemptPoints = this.attemptPoints - Math.abs(point);

                return this;
            },
            addAttemptPoint(this: IAccountModel, point: number): IAccountModel {

                this.attemptPoints = this.attemptPoints + Math.abs(point);

                return this;
            },
            resetAttempt(this: IAccountModel, amount: number = defaultInitialAttemptPoints): IAccountModel {

                this.attemptPoints = amount;

                return this;
            },
            generateAndSetTwoFA(this: IAccountModel, systemName: string): string {

                const key: string = generateTwoFactorKey();
                const url: string = generateTwoFactorURL(systemName, this.identifier, key);

                this.twoFactor = key;

                return url;
            },
            verifyTwoFA(this: IAccountModel, code: string): boolean {

                const key: string | undefined = this.twoFactor;

                if (!key) {
                    return false;
                }

                return verifyTwoFactorCode(key, code);
            },
            setPassword(this: IAccountModel, password: string): IAccountModel {

                const saltilizer: Saltilizer = Saltilizer.create(this.salt);

                const saltedPassword: string = saltilizer.encrypt(password);

                this.password = saltedPassword;
                this.resetMint();

                return this;
            },
            resetMint(this: IAccountModel): IAccountModel {

                this.mint = UUIDVersion1.generate().toString();

                return this;
            },
            verifyPassword(this: IAccountModel, password: string): boolean {

                const saltilizer: Saltilizer = Saltilizer.create(this.salt);
                const saltedPassword: string = saltilizer.encrypt(password);

                return this.password === saltedPassword;
            },
        }
    },
);

export interface IAccountModel extends IAccount, Document {

    resetAttempt(amount?: number): IAccountModel;
    useAttemptPoint(point: number): IAccountModel;
    addAttemptPoint(point: number): IAccountModel;
    generateAndSetTwoFA(systemName?: string): string;
    verifyTwoFA(code: string): boolean;
    setPassword(password: string): IAccountModel;
    resetMint(): IAccountModel;
    verifyPassword(password: string): boolean;
}

export const AccountModel: Model<IAccountModel> = model<IAccountModel>('Account', AccountSchema);
