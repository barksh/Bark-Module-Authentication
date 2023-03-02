/**
 * @author WMXPY
 * @namespace Handlers_Authentication
 * @description Inquiry
 */

import { createSucceedLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createAnyPattern, createCustomPattern, createListPattern, createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { createUnsavedInquiry } from "../../../database/controller/inquiry";
import { InquiryAction } from "../../../database/interface/inquiry";
import { IInquiryModel } from "../../../database/model/inquiry";
import { ERROR_CODE } from "../../../error/code";
import { panic } from "../../../error/panic";
import { validateDomainName } from "../../../util/network/domain";
import { verifyInquiryAction } from "../../../util/verify/inquiry-action";
import { createErroredLambdaResponse } from "../../common/response";
import { wrapHandler } from "../../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            domain: createCustomPattern((domain) => {
                return validateDomainName(domain);
            }),
            actions: createListPattern(
                createStrictMapPattern({
                    type: createStringPattern(),
                    payload: createAnyPattern(),
                }), {
                optional: true,
            }),
            callbackUrl: createStringPattern({
                optional: true,
            }),
        }),
    );

type Body = {

    readonly domain: string;
    readonly actions?: InquiryAction[];
};

export const authenticationPostInquiryHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        if (body.actions && body.actions.length > 0) {

            for (const action of body.actions) {

                const verifyResult: boolean = await verifyInquiryAction(body.domain, action);
                if (!verifyResult) {

                    return createErroredLambdaResponse(
                        HTTP_RESPONSE_CODE.NOT_FOUND,
                        panic.code(ERROR_CODE.INVALID_INQUIRY_ACTION_1, JSON.stringify(action)),
                    );
                }
            }
        }

        const inquiryInstance: IInquiryModel = createUnsavedInquiry(
            body.domain,
            {
                actions: body.actions,
            },
        );

        await inquiryInstance.save();

        return createSucceedLambdaResponse({
            exposureKey: inquiryInstance.exposureKey,
            hiddenKey: inquiryInstance.hiddenKey,
        });
    },
);
