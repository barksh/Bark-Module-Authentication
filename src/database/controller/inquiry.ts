/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Inquiry
 */

import { UUIDVersion4 } from "@sudoo/uuid";
import { IInquiryModel, InquiryModel } from "../model/inquiry";

export const InquiryEmptySymbol = Symbol('inquiry-empty');

export const createUnsavedInquiry = (
    accountIdentifier: string,
    domain: string,
): IInquiryModel => {

    const inquiryIdentifier: string =
        UUIDVersion4.generate().toString();

    const issueDate: Date = new Date();
    const expireDate: Date = new Date();
    expireDate.setUTCHours(expireDate.getUTCHours() + 1);

    const inquiry: IInquiryModel = new InquiryModel({
        accountIdentifier,
        inquiryIdentifier,
        refreshTokens: [],
        domain,
        issuedAt: issueDate,
        expireAt: expireDate,
    });
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
