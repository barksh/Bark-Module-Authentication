import { IDecryptedSecretConfig, ISecret } from "../interface/secret";
import { ISecretModel } from "../model/secret";
export declare const createRandomUnsavedSecret: (domain: string, securityKey: string) => ISecretModel;
export declare const getDecryptedSecretByDomain: (domain: string, securityKey: string) => Promise<IDecryptedSecretConfig | null>;
export declare const getSecretByDomain: (domain: string) => Promise<ISecret | null>;
