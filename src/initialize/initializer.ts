/**
 * @author WMXPY
 * @namespace Initialize
 * @description Initializer
 */

import * as Mongoose from "mongoose";
import { connectDatabase } from "../database/connect";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { logAgent } from "../util/log/log";
import { AUTHENTICATION_MONGO_DB, AUTHENTICATION_SECRET_KEY, AUTHENTICATION_SELF_DOMAIN } from "./environment";

export class Initializer {

    private static _instance: Initializer | null;

    public static getInstance(): Initializer {

        if (!this._instance) {
            this._instance = new Initializer();
        }
        return this._instance;
    }

    public static async initialize(): Promise<void> {

        const instance: Initializer = this.getInstance();
        return await instance.initialize();
    }

    public static async terminate(): Promise<void> {

        const instance: Initializer = this.getInstance();
        return await instance.terminate();
    }

    private _initialized: boolean = false;

    private _secretKey: string | undefined;
    private _selfDomain: string | undefined;

    private _connection: Mongoose.Connection | undefined;

    private constructor() {

        // Do nothing
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

    public getSelfDomain(): string {

        if (!this._initialized) {

            throw panic.code(
                ERROR_CODE.APPLICATION_NOT_INITIALIZED,
            );
        }

        if (!this._selfDomain) {
            throw panic.code(
                ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1,
                'SELF_DOMAIN',
            );
        }
        return this._selfDomain;
    }

    private async terminate(): Promise<void> {

        if (!this._connection) {
            logAgent.warning("Already terminated");
            return;
        }

        logAgent.debug("Terminating");

        this._initialized = false;
        await this._connection.close();

        logAgent.debug("Terminated");
    }

    private async initialize(): Promise<void> {

        if (this._initialized) {
            logAgent.warning("Already initialized");
            return;
        }
        this._initialized = true;

        if (!AUTHENTICATION_MONGO_DB) {

            throw panic.code(
                ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1,
                'AUTHENTICATION_MONGO_DB',
            );
        }

        if (!AUTHENTICATION_SECRET_KEY) {

            throw panic.code(
                ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1,
                'AUTHENTICATION_SECRET_KEY',
            );
        }

        if (!AUTHENTICATION_SELF_DOMAIN) {

            throw panic.code(
                ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1,
                'AUTHENTICATION_SELF_DOMAIN',
            );
        }

        try {

            logAgent.debug("Initializing");

            const connection: Mongoose.Connection = await connectDatabase(AUTHENTICATION_MONGO_DB);

            logAgent.debug("Initialized");

            this._connection = connection;
            this._secretKey = AUTHENTICATION_SECRET_KEY;
            this._selfDomain = AUTHENTICATION_SELF_DOMAIN;

            return;
        } catch (err) {

            logAgent.error("Error during initialization:", err);
            throw err;
        }
    }
}
