import { LambdaResponseBodyType, LambdaResponseManager } from "@sudoo/lambda";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { APIGatewayProxyResult } from "aws-lambda";
export declare const responseManager: LambdaResponseManager;
export declare const createSucceedLambdaResponse: (body?: LambdaResponseBodyType) => APIGatewayProxyResult;
export declare const createErroredLambdaResponse: (code: HTTP_RESPONSE_CODE, reason?: Error | string) => APIGatewayProxyResult;
