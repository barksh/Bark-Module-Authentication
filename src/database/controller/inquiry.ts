/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Inquiry
 */

import { UUIDVersion4 } from "@sudoo/uuid";
import { generateRandomKey } from "../../util/random";
import { IInquiryConfig } from "../interface/inquiry";
import { IInquiryModel, InquiryModel } from "../model/inquiry";

export const InquiryEmptySymbol = Symbol('inquiry-empty');

export type CreateInquiryConfig = {

    readonly callbackUrl?: string;
    readonly webhookUrl?: string;
};

export const createUnsavedInquiry = (
    domain: string,
    config: CreateInquiryConfig = {},
): IInquiryModel => {

    const inquiryIdentifier: string =
        UUIDVersion4.generate().toString();

    const issueDate: Date = new Date();
    const expireDate: Date = new Date();
    expireDate.setUTCHours(expireDate.getUTCHours() + 1);

    const exposureKey: string = generateRandomKey();
    const hiddenKey: string = generateRandomKey();

    const inquiry: IInquiryModel = new InquiryModel({
        inquiryIdentifier,
        exposureKey,
        hiddenKey,
        callbackUrl: config.callbackUrl,
        webhookUrl: config.webhookUrl,
        domain,
        issuedAt: issueDate,
        expireAt: expireDate,
    } as IInquiryConfig);
    return inquiry;
};

export const getInquiryByIdentifier = async (
    inquiryIdentifier: string,
): Promise<IInquiryModel | typeof InquiryEmptySymbol> => {

    const inquiry: IInquiryModel | null = await InquiryModel.findOne({
        inquiryIdentifier,
    }).exec();

    if (!inquiry) {
        return InquiryEmptySymbol;
    }

    return inquiry;
};

export const getValidInquiryByIdentifier = async (
    inquiryIdentifier: string,
    currentTime: Date = new Date(),
): Promise<IInquiryModel | typeof InquiryEmptySymbol> => {

    const inquiry: IInquiryModel | null = await InquiryModel.findOne({
        inquiryIdentifier,
        expireAt: {
            $gt: currentTime,
        },
        issuedAt: {
            $lt: currentTime,
        },
    }).exec();

    if (!inquiry) {
        return InquiryEmptySymbol;
    }

    return inquiry;
};
