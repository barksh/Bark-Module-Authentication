/**
 * @author WMXPY
 * @namespace Util
 * @description Two Factor
 */

import * as SpeakEasy from "speakeasy";

export const generateTwoFactorKey = (): string => {

    const secret: SpeakEasy.GeneratedSecret = SpeakEasy.generateSecret({ length: 32 });
    return secret.base32;
};

export const generateTwoFactorCode = (key: string): string => {

    // spell-checker: disable-next-line
    return SpeakEasy.totp({
        secret: key,
        encoding: 'base32',
    });
};

export const verifyTwoFactorCode = (key: string, code: string): boolean => {

    // spell-checker: disable-next-line
    return SpeakEasy.totp.verify({
        secret: key,
        encoding: 'base32',
        token: code,
    });
};

export const generateTwoFactorURL = (name: string, account: string, key: string): string => {

    const parsedName: string = encodeURIComponent(name);
    const parsedAccount: string = encodeURIComponent(account);

    // spell-checker: disable-next-line
    return 'otpauth://totp/' + parsedAccount + '?issuer=' + parsedName + '&secret=' + key;
};
