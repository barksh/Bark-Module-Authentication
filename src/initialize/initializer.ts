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
            await this._instance.initialize();
        }
        return this._instance;
    }

    private _secretKey: string | undefined;

    private constructor() {

        this.initialize();
    }

    public getSecretKey(): string {

        if (!this._secretKey) {
            throw new Error("[Sudoo-Authentication] Secret Key not found");
        }
        return this._secretKey;
    }

    private async initialize(): Promise<void> {

        const AUTHENTICATION_MONGO_DB: string | undefined = process.env.AUTHENTICATION_MONGO_DB;
        const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

        if (!AUTHENTICATION_MONGO_DB) {
            throw new Error("[Sudoo-Authentication] Authentication Mongo DB not found");
        }
        if (!SECRET_KEY) {
            throw new Error("[Sudoo-Authentication] Secret Key not found");
        }

        const connection: Mongoose.Connection = await connectDatabase(AUTHENTICATION_MONGO_DB);

        return new Promise((resolve: () => void, reject: (reason: any) => void) => {

            connection.on('error', (error: any) => {
                reject(error);
            });
            connection.once('open', () => {
                this._secretKey = SECRET_KEY;
                resolve();
            });
        });
    }
}
