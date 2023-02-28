/**
 * @author WMXPY
 * @namespace Handlers_Secret
 * @description Public Key Fetch
 */

import { createSucceedLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { getOrCreateSecretByDomain } from "../../../actions/secret/get-or-create";
import { ISecret } from "../../../database/interface/secret";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            domain: createStringPattern(),
        }),
    );

type Body = {
    readonly domain: string;
};

export const secretPostPublicKeyFetchHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (event: VerifiedAPIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const secret: ISecret = await getOrCreateSecretByDomain(body.domain);

        return createSucceedLambdaResponse({
            domain: body.domain,
            publicKey: secret.publicKey,
        });
    },
);
