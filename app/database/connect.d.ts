import * as Mongoose from "mongoose";
export declare const connectDatabase: (database: string) => Promise<Mongoose.Connection>;
