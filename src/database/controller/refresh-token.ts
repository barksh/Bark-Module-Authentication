/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Refresh Token
 */

import { UUIDVersion4 } from "@sudoo/uuid";
import { IRefreshTokenConfig } from "../interface/refresh-token";
import { IRefreshTokenModel, RefreshTokenModel } from "../model/refresh-token";

export const RefreshTokenEmptySymbol = Symbol('refresh-token-empty');

export const createUnsavedRefreshToken = (
    accountIdentifier: string,
    inquiryIdentifier: string,
    domain: string,
): IRefreshTokenModel => {

    const refreshTokenIdentifier: string =
        UUIDVersion4.generate().toString();

    const issueDate: Date = new Date();
    const expireDate: Date = new Date();
    expireDate.setUTCHours(expireDate.getUTCHours() + 1);

    const refreshToken: IRefreshTokenModel = new RefreshTokenModel({
        accountIdentifier,
        inquiryIdentifier,
        refreshTokenIdentifier,
        authenticationTokens: [],
        domain,
        issuedAt: issueDate,
        expireAt: expireDate,
    } as IRefreshTokenConfig);
    return refreshToken;
};

export const getRefreshTokenByIdentifier = async (
    refreshTokenIdentifier: string,
): Promise<IRefreshTokenModel | typeof RefreshTokenEmptySymbol> => {

    const refreshToken: IRefreshTokenModel | null = await RefreshTokenModel.findOne({
        refreshTokenIdentifier,
    }).exec();

    if (!refreshToken) {
        return RefreshTokenEmptySymbol;
    }

    return refreshToken;
};

export const getValidInquiryByIdentifier = async (
    refreshTokenIdentifier: string,
    currentTime: Date = new Date(),
): Promise<IRefreshTokenModel | typeof RefreshTokenEmptySymbol> => {

    const refreshToken: IRefreshTokenModel | null = await RefreshTokenModel.findOne({
        refreshTokenIdentifier,
        expireAt: {
            $gt: currentTime,
        },
        issuedAt: {
            $lt: currentTime,
        },
    }).exec();

    if (!refreshToken) {
        return RefreshTokenEmptySymbol;
    }

    return refreshToken;
};
