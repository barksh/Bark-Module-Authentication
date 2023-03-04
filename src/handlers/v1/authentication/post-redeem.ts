/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Redeem
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { generateRefreshToken, UnableToGenerateRefreshTokenSymbol } from "../../../actions/token/refresh";
import { getValidInquiryByHiddenKey, InquiryEmptySymbol } from "../../../database/controller/inquiry";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            hiddenKey: createStringPattern(),
        }),
    );

type Body = {

    readonly hiddenKey: string;
};

export const authenticationPostRedeemHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const inquiry: IInquiryModel | typeof InquiryEmptySymbol = await getValidInquiryByHiddenKey(
            body.hiddenKey,
        );

        if (inquiry === InquiryEmptySymbol) {

            logAgent.error('Inquiry not found, hiddenKey:', body.hiddenKey);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(
                    ERROR_CODE.INQUIRY_NOT_FOUND_BY_HIDDEN_KEY_1,
                    body.hiddenKey,
                ),
            );
        }

        if (!inquiry.realized
            || typeof inquiry.accountIdentifier !== 'string') {

            logAgent.error('Inquiry not realized, hiddenKey:', body.hiddenKey);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(
                    ERROR_CODE.INQUIRY_NOT_REALIZED_1,
                    body.hiddenKey,
                ),
            );
        }

        const refreshToken: string | typeof UnableToGenerateRefreshTokenSymbol = await generateRefreshToken({
            inquiry,
        });

        if (refreshToken === UnableToGenerateRefreshTokenSymbol) {

            logAgent.error('Unable to generate refresh token, hiddenKey:', body.hiddenKey);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(
                    ERROR_CODE.INQUIRY_NOT_REALIZED_1,
                    body.hiddenKey,
                ),
            );
        }

        return createSucceedLambdaResponse({
            refreshToken,
        });
    },
);
