/**
 * @author WMXPY
 * @namespace Handlers_Account
 * @description Create
 */

import { Initializer } from "../../../initialize/initializer";

export const createAccountHandler = async (event: any): Promise<any> => {

    const initializer: Initializer = await Initializer.getInstance();

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Go Serverless v3.0! Your function executed successfully!",
                input: event,
                environment: process.env,
            },
            null,
            2
        ),
    };
};
