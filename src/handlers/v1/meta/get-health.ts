/**
 * @author WMXPY
 * @namespace Handlers_Meta
 * @description Health
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { InquiryEmptySymbol, getValidInquiryByExposureKey } from "../../../database/controller/inquiry";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create();

type Body = {

    readonly exposureKey: string;
};

export const metaGetHealthHandler: APIGatewayProxyHandler = wrapHandler(verifier,
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

        return createSucceedLambdaResponse({
            exposureKey: inquiry.exposureKey,
            domain: inquiry.domain,
        });
    },
);
