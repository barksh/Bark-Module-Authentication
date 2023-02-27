/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Secret
 */

import { Document, model, Model, Schema } from "mongoose";
import { ISecret } from "../interface/secret";

const SecretSchema: Schema<ISecretModel> = new Schema(
    {
        domain: {
            type: String,
            required: true,
            unique: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        encryptedPrivateKey: {
            type: String,
            required: true,
        },
        initVector: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    },
);

export interface ISecretModel extends ISecret, Document {
}

export const SecretModel: Model<ISecretModel> = model<ISecretModel>('Secret', SecretSchema);
