/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Record
 */

export enum RecordType {

    CHANGE_PASSWORD = "CHANGE_PASSWORD",
}

export enum 

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
