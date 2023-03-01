/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Realize
 */

import { createSucceedLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { InquiryAuthToken } from "../../../actions/token/inquiry";
import { generateRefreshToken } from "../../../actions/token/refresh";
import { verifyInquiryToken } from "../../../actions/verify/inquiry";
import { getValidInquiryByIdentifier, InquiryEmptySymbol } from "../../../database/controller/inquiry";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            inquiryToken: createStringPattern(),
        }),
    );

type Body = {
    readonly inquiryToken: string;
};

export const authenticationPostRealizeHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const inquiryToken: InquiryAuthToken = await verifyInquiryToken(body.inquiryToken);

        const inquiry: IInquiryModel | typeof InquiryEmptySymbol = await getValidInquiryByIdentifier(
            inquiryToken.header.jti as string,
        );

        if (inquiry === InquiryEmptySymbol) {

            logAgent.error('Inquiry not found:', inquiryToken.header.jti);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(ERROR_CODE.INVALID_TOKEN),
            );
        }

        const refreshToken: string = await generateRefreshToken({
            inquiry,
        });

        return createSucceedLambdaResponse({
            token: refreshToken,
        });
    },
);
