/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Refresh
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { generateAuthenticationToken } from "../../../actions/token/authentication";
import { RefreshAuthToken } from "../../../actions/token/refresh";
import { verifyRefreshToken } from "../../../actions/verify/refresh";
import { getRefreshTokenByIdentifier, RefreshTokenEmptySymbol } from "../../../database/controller/refresh-token";
import { IRefreshTokenModel } from "../../../database/model/refresh-token";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            refreshToken: createStringPattern(),
        }),
    );

type Body = {
    readonly refreshToken: string;
};

export const authenticationPostRefreshHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const refreshToken: RefreshAuthToken = await verifyRefreshToken(body.refreshToken);

        if (typeof refreshToken.header.jti !== 'string') {

            logAgent.error('Invalid refresh token:', refreshToken.header.jti);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(ERROR_CODE.INVALID_TOKEN),
            );
        }

        const refreshTokenInstance: IRefreshTokenModel | typeof RefreshTokenEmptySymbol =
            await getRefreshTokenByIdentifier(
                refreshToken.header.jti,
            );

        if (refreshTokenInstance === RefreshTokenEmptySymbol) {

            logAgent.error('Refresh Token not found:', refreshToken.header.jti);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(ERROR_CODE.INVALID_TOKEN),
            );
        }

        if (refreshTokenInstance.inquiryIdentifier !== refreshToken.body.inquiry) {

            logAgent.error('Refresh Token inquiry not match:', refreshToken.header.jti, refreshToken.body.inquiry);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(ERROR_CODE.INVALID_TOKEN),
            );
        }

        const authenticationToken: string = await generateAuthenticationToken({
            refreshToken: refreshTokenInstance,
        });

        return createSucceedLambdaResponse({
            token: authenticationToken,
        });
    },
);
