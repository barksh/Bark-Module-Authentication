/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Touch
 */

import { createSucceedLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { getValidInquiryByExposureKey, InquiryEmptySymbol } from "../../../database/controller/inquiry";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            exposureKey: createStringPattern(),
        }),
    );

type Body = {

    readonly exposureKey: string;
};

export const authenticationPostTouchHandler: APIGatewayProxyHandler = wrapHandler(verifier,
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
