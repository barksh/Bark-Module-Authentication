"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initializer = void 0;
const connect_1 = require("../database/connect");
const code_1 = require("../error/code");
const panic_1 = require("../error/panic");
const log_1 = require("../util/log/log");
const environment_1 = require("./environment");
class Initializer {
    static getInstance() {
        if (!this._instance) {
            this._instance = new Initializer();
        }
        return this._instance;
    }
    static async initialize() {
        const instance = this.getInstance();
        return await instance.initialize();
    }
    static async terminate() {
        const instance = this.getInstance();
        return await instance.terminate();
    }
    constructor() {
        this._initialized = false;
    }
    getSecretKey() {
        if (!this._initialized) {
            throw panic_1.panic.code(code_1.ERROR_CODE.APPLICATION_NOT_INITIALIZED);
        }
        if (!this._secretKey) {
            throw panic_1.panic.code(code_1.ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1, 'SECRET_KEY');
        }
        return this._secretKey;
    }
    getSelfDomain() {
        if (!this._initialized) {
            throw panic_1.panic.code(code_1.ERROR_CODE.APPLICATION_NOT_INITIALIZED);
        }
        if (!this._selfDomain) {
            throw panic_1.panic.code(code_1.ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1, 'SELF_DOMAIN');
        }
        return this._selfDomain;
    }
    async terminate() {
        if (!this._connection) {
            log_1.logAgent.warning("Already terminated");
            return;
        }
        log_1.logAgent.debug("Terminating");
        this._initialized = false;
        await this._connection.close();
        log_1.logAgent.debug("Terminated");
    }
    async initialize() {
        if (this._initialized) {
            log_1.logAgent.warning("Already initialized");
            return;
        }
        this._initialized = true;
        if (!environment_1.AUTHENTICATION_MONGO_DB) {
            throw panic_1.panic.code(code_1.ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1, 'AUTHENTICATION_MONGO_DB');
        }
        if (!environment_1.AUTHENTICATION_SECRET_KEY) {
            throw panic_1.panic.code(code_1.ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1, 'AUTHENTICATION_SECRET_KEY');
        }
        if (!environment_1.AUTHENTICATION_SELF_DOMAIN) {
            throw panic_1.panic.code(code_1.ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1, 'AUTHENTICATION_SELF_DOMAIN');
        }
        try {
            log_1.logAgent.debug("Initializing");
            const connection = await (0, connect_1.connectDatabase)(environment_1.AUTHENTICATION_MONGO_DB);
            log_1.logAgent.debug("Initialized");
            this._connection = connection;
            this._secretKey = environment_1.AUTHENTICATION_SECRET_KEY;
            this._selfDomain = environment_1.AUTHENTICATION_SELF_DOMAIN;
            return;
        }
        catch (err) {
            log_1.logAgent.error("Error during initialization:", err);
            throw err;
        }
    }
}
exports.Initializer = Initializer;
