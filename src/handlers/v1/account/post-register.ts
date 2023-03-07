/**
 * @author WMXPY
 * @namespace Handlers_Account
 * @description Register
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { AccountEmptySymbol, createUnsavedAccount, getAccountByIdentifier } from "../../../database/controller/account";
import { getOrDefaultPreferenceByKey } from "../../../database/controller/preference";
import { IDENTIFIER_VALIDATE_RESPONSE, PASSWORD_VALIDATE_RESPONSE, validateIdentifier, validatePassword } from "../../../database/data/account";
import { PreferenceKey } from "../../../database/declare/preference";
import { IAccountModel } from "../../../database/model/account";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            identifier: createStringPattern(),
            password: createStringPattern(),
        }),
    );

type Body = {
    readonly identifier: string;
    readonly password: string;
};

export const accountPostRegisterHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const allowPublicRegister: boolean = await getOrDefaultPreferenceByKey(PreferenceKey.ALLOW_PUBLIC_REGISTER);

        if (!allowPublicRegister) {

            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.METHOD_NOT_ALLOWED,
                panic.code(ERROR_CODE.PUBLIC_REGISTER_IS_NOT_ALLOWED),
            );
        }

        const identifierValidationResult: IDENTIFIER_VALIDATE_RESPONSE = validateIdentifier(body.identifier);

        if (identifierValidationResult !== IDENTIFIER_VALIDATE_RESPONSE.OK) {

            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                panic.code(ERROR_CODE.INVALID_IDENTIFIER_1, identifierValidationResult),
            );
        }

        const passwordValidationResult: PASSWORD_VALIDATE_RESPONSE = validatePassword(body.password);

        if (passwordValidationResult !== PASSWORD_VALIDATE_RESPONSE.OK) {

            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                panic.code(ERROR_CODE.INVALID_PASSWORD_1, passwordValidationResult),
            );
        }

        const existAccount: IAccountModel | typeof AccountEmptySymbol = await getAccountByIdentifier(body.identifier);

        if (existAccount !== AccountEmptySymbol) {
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.CONFLICT,
            );
        }

        const account: IAccountModel = createUnsavedAccount(
            body.identifier,
            body.password,
            {
                automation: false,
                administrator: false,
            },
        );

        await account.save();

        return createSucceedLambdaResponse({
            identifier: account.identifier,
        });
    },
);
