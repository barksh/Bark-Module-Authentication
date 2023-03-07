/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Refresh
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { generateUserAuthenticationTokenByRefreshToken } from "../../../actions/token/authentication-refresh-token";
import { RefreshAuthToken } from "../../../actions/token/refresh";
import { verifyRefreshToken } from "../../../actions/verify/refresh";
import { AccountEmptySymbol, getAccountByIdentifier } from "../../../database/controller/account";
import { getRefreshTokenByIdentifier, RefreshTokenEmptySymbol } from "../../../database/controller/refresh-token";
import { IAccountModel } from "../../../database/model/account";
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

        const account: IAccountModel | typeof AccountEmptySymbol = await getAccountByIdentifier(
            refreshToken.body.identifier,
        );

        if (account === AccountEmptySymbol) {

            logAgent.error('Account not found:', refreshToken.body.identifier);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(
                    ERROR_CODE.ACCOUNT_NOT_FOUND_1,
                    refreshToken.body.identifier,
                ),
            );
        }

        if (account.automation) {

            logAgent.error('Account is automation when refresh token:', refreshToken.body.identifier);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.NOT_FOUND,
                panic.code(
                    ERROR_CODE.CANNOT_REFRESH_TOKEN_WITH_AUTOMATION_ACCOUNT_1,
                    refreshToken.body.identifier,
                ),
            );
        }

        const authenticationToken: string = await generateUserAuthenticationTokenByRefreshToken({
            account,
            refreshToken: refreshTokenInstance,
        });

        return createSucceedLambdaResponse({
            token: authenticationToken,
        });
    },
);
