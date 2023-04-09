export declare const generateInitVector: () => string;
export declare const generateSecretKey: () => string;
export declare const encryptPrivateKey: (privateKey: string, securityKey: string, initVector: string) => string;
export declare const decryptPrivateKey: (encryptedPrivateKey: string, securityKey: string, initVector: string) => string;
