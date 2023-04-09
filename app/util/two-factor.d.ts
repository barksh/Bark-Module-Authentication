export declare const generateTwoFactorKey: () => string;
export declare const generateTwoFactorCode: (key: string) => string;
export declare const verifyTwoFactorCode: (key: string, code: string) => boolean;
export declare const generateTwoFactorURL: (name: string, account: string, key: string) => string;
