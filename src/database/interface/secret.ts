/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Secret
 */

export interface ISecretConfig {

    readonly domain: string;

    readonly publishKey: string;

    readonly encryptedPrivateKey: string;
    readonly initVector: string;
}

export interface ISecret extends ISecretConfig {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
