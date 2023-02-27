/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Secret
 */

export interface ISecretConfig {

    readonly domain: string;

    readonly publicKey: string;

    readonly encryptedPrivateKey: string;
    readonly initVector: string;
}

export interface IDecryptedSecretConfig extends ISecretConfig {

    readonly privateKey: string;
}

export interface ISecret extends ISecretConfig {

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
