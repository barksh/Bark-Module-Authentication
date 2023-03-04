/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Realize
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { AccountEmptySymbol, getAccountByIdentifier } from "../../../database/controller/account";
import { getValidInquiryByExposureKey, InquiryEmptySymbol } from "../../../database/controller/inquiry";
import { IAccountModel } from "../../../database/model/account";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            exposureKey: createStringPattern(),
            accountIdentifier: createStringPattern(),
            password: createStringPattern(),
        }),
    );

type Body = {

    readonly exposureKey: string;
    readonly accountIdentifier: string;
    readonly password: string;
};

export const authenticationPostRealizeHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const inquiry: IInquiryModel | typeof InquiryEmptySymbol = await getValidInquiryByExposureKey(
            body.exposureKey,
        );

        if (inquiry === InquiryEmptySymbol) {

            logAgent.error('Inquiry not found, exposureKey:', body.exposureKey);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(
                    ERROR_CODE.INQUIRY_NOT_FOUND_BY_EXPOSURE_KEY_1,
                    body.exposureKey,
                ),
            );
        }

        if (inquiry.realized) {

            logAgent.error('Inquiry already realized, exposureKey:', body.exposureKey);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(
                    ERROR_CODE.INQUIRY_NOT_FOUND_BY_EXPOSURE_KEY_1,
                    body.exposureKey,
                ),
            );
        }

        const account: IAccountModel | typeof AccountEmptySymbol = await getAccountByIdentifier(
            body.accountIdentifier,
        );

        if (account === AccountEmptySymbol) {

            logAgent.error('Account not found, identifier:', body.accountIdentifier);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(
                    ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1,
                    body.accountIdentifier,
                ),
            );
        }

        const verifyResult: boolean = account.verifyPassword(body.password);

        if (!verifyResult) {

            logAgent.error('Account password incorrect, identifier:', body.accountIdentifier);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(
                    ERROR_CODE.ACCOUNT_NOT_FOUND_OR_INCORRECT_PASSWORD_1,
                    body.accountIdentifier,
                ),
            );
        }

        inquiry.realized = true;
        inquiry.accountIdentifier = account.identifier;

        await inquiry.save();

        return createSucceedLambdaResponse({
            exposureKey: inquiry.exposureKey,
            accountIdentifier: account.identifier,
            actions: inquiry.actions,
        });
    },
);
