import { JWTToken } from "@sudoo/jwt";
import { IInquiryModel } from "../../database/model/inquiry";
export declare const UnableToGenerateRefreshTokenSymbol: unique symbol;
export type GenerateRefreshTokenConfig = {
    readonly inquiry: IInquiryModel;
};
export type RefreshTokenHeader = {
    readonly purpose: 'Refresh';
};
export type RefreshTokenBody = {
    readonly identifier: string;
    readonly inquiry: string;
};
export type RefreshAuthToken = JWTToken<RefreshTokenHeader, RefreshTokenBody>;
export declare const generateRefreshToken: (config: GenerateRefreshTokenConfig) => Promise<string | typeof UnableToGenerateRefreshTokenSymbol>;
