/**
 * @author WMXPY
 * @namespace Initialize
 * @description Initializer
 */

import { connectDatabase } from "../database/connect";
import * as Mongoose from "mongoose";

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
            throw new Error("[Sudoo-Authentication] Initializer not initialized");
        }

        if (!this._secretKey) {
            throw new Error("[Sudoo-Authentication] Secret Key not found");
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

        const AUTHENTICATION_MONGO_DB: string | undefined = process.env.AUTHENTICATION_MONGO_DB;
        const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

        if (!AUTHENTICATION_MONGO_DB) {
            throw new Error("[Sudoo-Authentication] Authentication Mongo DB not found");
        }
        if (!SECRET_KEY) {
            throw new Error("[Sudoo-Authentication] Secret Key not found");
        }

        try {

            const connection: Mongoose.Connection = await connectDatabase(AUTHENTICATION_MONGO_DB);

            this._connection = connection;
            this._secretKey = SECRET_KEY;
        } catch (err) {

            console.log("[Sudoo-Authentication] Error", err);
            throw err;
        }
    }
}
