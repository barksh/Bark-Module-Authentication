/**
 * @author WMXPY
 * @namespace Handlers_Secret
 * @description Public Key Fetch
 */

import { createSucceedLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { Initializer } from "../../../initialize/initializer";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            domain: createStringPattern(),
        }),
    );

type Body = {
    readonly domain: string;
};

export const secretPostPublicKeyFetchHandler: APIGatewayProxyHandler = verifier.warpAPIGateWayProxyHandler(
    async (event: VerifiedAPIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        await Initializer.initialize();

        return createSucceedLambdaResponse({
            domain: body.domain,
        });
    },
);
