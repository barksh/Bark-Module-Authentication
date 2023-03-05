/**
 * @author WMXPY
 * @namespace Scripts
 * @description Generate Secret Key
 */

import * as Crypto from "crypto";

(async () => {

    const secretKey: string = Crypto.randomBytes(32).toString("hex");
    console.log(secretKey);
})();
