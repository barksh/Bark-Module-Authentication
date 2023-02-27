/**
 * @author WMXPY
 * @namespace Initialize
 * @description Initializer
 */

import * as Mongoose from "mongoose";
import { connectDatabase } from "../database/connect";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { AUTHENTICATION_MONGO_DB, SECRET_KEY } from "./environment";

export class Initializer {

    private static _instance: Initializer | null;

    public static async getInstance(): Promise<Initializer> {

        if (!this._instance) {
            this._instance = new Initializer();
        }
        return this._instance;
    }

    public static async initialize(): Promise<void> {

        const instance: Initializer = await this.getInstance();
        await instance.initialize();
    }

    public static async terminate(): Promise<void> {

        const instance: Initializer = await this.getInstance();
        await instance.terminate();
    }

    private _initialized: boolean = false;
    private _secretKey: string | undefined;

    private _connection: Mongoose.Connection | undefined;

    private constructor() {

        this.initialize();
    }

    public getSecretKey(): string {

        if (!this._initialized) {

            throw panic.code(
                ERROR_CODE.APPLICATION_NOT_INITIALIZED,
            );
        }

        if (!this._secretKey) {
            throw panic.code(
                ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1,
                'SECRET_KEY',
            );
        }
        return this._secretKey;
    }

    private async terminate(): Promise<void> {

        if (!this._connection) {
            return;
        }
        this._initialized = false;
        await this._connection.close();
    }

    private async initialize(): Promise<void> {

        if (this._initialized) {
            return;
        }
        this._initialized = true;

        if (!AUTHENTICATION_MONGO_DB) {

            throw panic.code(
                ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1,
                'AUTHENTICATION_MONGO_DB',
            );
        }
        if (!SECRET_KEY) {

            throw panic.code(
                ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1,
                'SECRET_KEY',
            );
        }

        try {

            const connection: Mongoose.Connection = await connectDatabase(AUTHENTICATION_MONGO_DB);

            this._connection = connection;
            this._secretKey = SECRET_KEY;
        } catch (err) {

            console.error("[Authentication Module] Error during initialization:", err);
            throw err;
        }
    }
}
