/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Inquiry
 */

import { createSucceedLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createCustomPattern, createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { createUnsavedInquiry } from "../../../database/controller/inquiry";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { dnsLookupAuthModuleTxt } from "../../../util/network/dns/txt";
import { getDomainHostOfURL, validateDomainName } from "../../../util/network/domain";
import { createErroredLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            domain: createCustomPattern((domain) => {
                return validateDomainName(domain);
            }),
            webHookUrl: createStringPattern({
                optional: true,
            }),
            callbackUrl: createStringPattern({
                optional: true,
            }),
        }),
    );

type Body = {

    readonly domain: string;
    readonly webHookUrl?: string;
    readonly callbackUrl?: string;
};

export const authenticationPostInquiryHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        if (typeof body.callbackUrl === 'string') {

            const availableCallbackUrls: string[] = await dnsLookupAuthModuleTxt(body.domain);
            const callbackUrlDomain: string = getDomainHostOfURL(body.callbackUrl);

            if (!availableCallbackUrls.includes(callbackUrlDomain)) {
                return createErroredLambdaResponse(
                    HTTP_RESPONSE_CODE.NOT_FOUND,
                    panic.code(ERROR_CODE.INVALID_CALLBACK_URL_1, body.callbackUrl),
                );
            }
        }

        const inquiryInstance: IInquiryModel = createUnsavedInquiry(
            body.domain,
            {
                callbackUrl: body.callbackUrl,
                webhookUrl: body.webHookUrl,
            },
        );

        await inquiryInstance.save();

        return createSucceedLambdaResponse({
            exposureKey: inquiryInstance.exposureKey,
            hiddenKey: inquiryInstance.hiddenKey,
        });
    },
);
