/**
 * @author WMXPY
 * @namespace Database
 * @description Connect
 */

import * as Mongoose from "mongoose";

export const connectDatabase = async (database: string): Promise<Mongoose.Connection> => {

    await Mongoose.connect(
        database,
        {
            autoCreate: true,
            autoIndex: true,
        },
    );

    const connection: Mongoose.Connection = Mongoose.connection;
    return connection;
};
