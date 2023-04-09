import { Document, Model } from "mongoose";
import { IAccount } from "../interface/account";
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
export declare const AccountModel: Model<IAccountModel>;
