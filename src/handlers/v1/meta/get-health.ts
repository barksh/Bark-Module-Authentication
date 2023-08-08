/**
 * @author WMXPY
 * @namespace Handlers_Meta
 * @description Health
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { createSucceedLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create();

export const metaGetHealthHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        _event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        return createSucceedLambdaResponse({
            apiVersion: "V1",
        });
    },
);
