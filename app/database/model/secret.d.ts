import { Document, Model } from "mongoose";
import { ISecret } from "../interface/secret";
export interface ISecretModel extends ISecret, Document {
}
export declare const SecretModel: Model<ISecretModel>;
