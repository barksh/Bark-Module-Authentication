export declare class Initializer {
    private static _instance;
    static getInstance(): Initializer;
    static initialize(): Promise<void>;
    static terminate(): Promise<void>;
    private _initialized;
    private _secretKey;
    private _selfDomain;
    private _connection;
    private constructor();
    getSecretKey(): string;
    getSelfDomain(): string;
    private terminate;
    private initialize;
}
