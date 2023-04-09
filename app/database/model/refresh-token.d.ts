import { Document, Model } from "mongoose";
import { IRefreshToken } from "../interface/refresh-token";
export interface IRefreshTokenModel extends IRefreshToken, Document {
    attachAuthenticationToken(authenticationTokenIdentifier: string): IRefreshTokenModel;
    containsAuthenticationToken(authenticationTokenIdentifier: string): boolean;
}
export declare const RefreshTokenModel: Model<IRefreshTokenModel>;
