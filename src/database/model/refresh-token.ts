/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Refresh Token
 */

import { Document, model, Model, Schema } from "mongoose";
import { IRefreshToken } from "../interface/refresh-token";

const RefreshTokenSchema: Schema<IRefreshTokenModel> = new Schema(
    {
        accountIdentifier: {
            type: String,
            required: true,
            index: true,
        },
        inquiryIdentifier: {
            type: String,
            required: true,
            index: true,
        },
        refreshTokenIdentifier: {
            type: String,
            required: true,
            index: true,
        },
        authenticationTokens: {
            type: [String],
            required: true,
        },
        domain: {
            type: String,
            required: true,
        },
        issuedAt: {
            type: Date,
            required: true,
        },
        expireAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        id: false,
        _id: false,
        methods: {
            attachAuthenticationToken(this: IRefreshTokenModel, authenticationTokenIdentifier: string): IRefreshTokenModel {

                this.authenticationTokens = [
                    ...this.authenticationTokens,
                    authenticationTokenIdentifier,
                ];

                return this;
            },
            containsAuthenticationToken(this: IRefreshTokenModel, authenticationTokenIdentifier: string): boolean {

                return this.authenticationTokens.includes(authenticationTokenIdentifier);
            }
        }
    },
);

export interface IRefreshTokenModel extends IRefreshToken, Document {

    attachAuthenticationToken(authenticationTokenIdentifier: string): IRefreshTokenModel;
    containsAuthenticationToken(authenticationTokenIdentifier: string): boolean;
}

export const RefreshTokenModel: Model<IRefreshTokenModel> = model<IRefreshTokenModel>('RefreshToken', RefreshTokenSchema);
