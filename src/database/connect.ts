/**
 * @author WMXPY
 * @namespace Database
 * @description Connect
 */

import * as Mongoose from "mongoose";

Mongoose.set("strictQuery", false);

export const connectDatabase = async (database: string): Promise<Mongoose.Connection> => {

    const connection = await Mongoose.createConnection(
        database,
        {
            connectTimeoutMS: 2000,
            autoCreate: true,
            autoIndex: true,
        },
    ).asPromise();
    return connection;
};
