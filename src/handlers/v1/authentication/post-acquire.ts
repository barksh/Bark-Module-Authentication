/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Acquire
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { generateAutomationAuthenticationToken } from "../../../actions/token/authentication-automation";
import { AccountEmptySymbol, getAccountByIdentifier } from "../../../database/controller/account";
import { IAccountModel } from "../../../database/model/account";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { logAgent } from "../../../util/log/log";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            domain: createStringPattern(),
            accountIdentifier: createStringPattern(),
            password: createStringPattern(),
        }),
    );

type Body = {

    readonly domain: string;
    readonly accountIdentifier: string;
    readonly password: string;
};

export const authenticationPostAcquireHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

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

        if (!account.automation) {

            logAgent.error('Account is not automation during acquire, identifier:', body.accountIdentifier);
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(
                    ERROR_CODE.CANNOT_ACQUIRE_TOKEN_WITH_NOT_AUTOMATION_ACCOUNT_1,
                    body.accountIdentifier,
                ),
            );
        }

        const token: string = await generateAutomationAuthenticationToken({
            domain: body.domain,
            account,
        });

        return createSucceedLambdaResponse({
            token,
            accountIdentifier: account.identifier,
        });
    },
);
