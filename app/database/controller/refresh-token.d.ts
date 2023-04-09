import { IRefreshTokenModel } from "../model/refresh-token";
export declare const RefreshTokenEmptySymbol: unique symbol;
export declare const createUnsavedRefreshToken: (accountIdentifier: string, inquiryIdentifier: string, domain: string) => IRefreshTokenModel;
export declare const getRefreshTokenByIdentifier: (refreshTokenIdentifier: string) => Promise<IRefreshTokenModel | typeof RefreshTokenEmptySymbol>;
export declare const getValidInquiryByIdentifier: (refreshTokenIdentifier: string, currentTime?: Date) => Promise<IRefreshTokenModel | typeof RefreshTokenEmptySymbol>;
