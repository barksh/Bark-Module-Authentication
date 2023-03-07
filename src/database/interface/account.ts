/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Account
 */

export interface IAccountConfig {

    readonly identifier: string;

    readonly automation: boolean;
    readonly administrator: boolean;

    password: string;
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
