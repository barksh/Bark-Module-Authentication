/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Account
 */

export const defaultInitialAttemptPoints: number = 100;

export enum PreviousPasswordReason {

    CHANGE = "CHANGE",
    RESET = "RESET",
    TEMP = "TEMP",
}

export type PreviousPassword = {

    readonly password: string;
    readonly reason: PreviousPasswordReason;
    readonly changedAt: Date;
};

export interface IAccountConfig {

    readonly identifier: string;

    password: string;
    previousPasswords: PreviousPassword[];
    mint: string;
    salt: string;
}

export interface IAccount extends IAccountConfig {

    active: boolean;
    attemptPoints: number;
    limbo: boolean;
    twoFactor?: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
