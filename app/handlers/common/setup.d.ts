import { LambdaVerifier, VerifiedAPIGatewayProxyHandler } from "@sudoo/lambda-verify";
import { APIGatewayProxyHandler } from "aws-lambda";
export declare const wrapHandler: (verifier: LambdaVerifier, handler: VerifiedAPIGatewayProxyHandler) => APIGatewayProxyHandler;
