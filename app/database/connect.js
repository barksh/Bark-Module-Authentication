"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const Mongoose = require("mongoose");
Mongoose.set("strictQuery", false);
Mongoose.set("bufferCommands", false);
const connectDatabase = async (database) => {
    const connection = await Mongoose.connect(database, {
        autoCreate: true,
        autoIndex: true,
    });
    return connection.connection;
};
exports.connectDatabase = connectDatabase;
