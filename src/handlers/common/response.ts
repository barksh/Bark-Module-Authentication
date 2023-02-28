/**
 * @author WMXPY
 * @namespace Handlers
 * @description Response
 */

import { createLambdaResponse } from "@sudoo/lambda";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { APIGatewayProxyResult } from "aws-lambda";

export const createErroredLambdaResponse = (
    code: HTTP_RESPONSE_CODE,
    reason?: Error | string,
): APIGatewayProxyResult => {

    if (typeof reason === 'undefined') {

        return createLambdaResponse(code);
    }

    if (typeof reason === 'string') {

        return createLambdaResponse(
            code,
            {
                reason,
            },
        );
    }

    return createLambdaResponse(
        code,
        {
            reason: reason.message,
        },
    );
};

