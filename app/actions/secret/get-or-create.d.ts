import { IDecryptedSecretConfig, ISecret } from "../../database/interface/secret";
export declare const getOrCreateSecretByDomain: (domain: string) => Promise<ISecret>;
export declare const getOrCreateDecryptedSecretByDomain: (domain: string) => Promise<IDecryptedSecretConfig>;
