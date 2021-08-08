"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const perf_hooks_1 = require("perf_hooks");
async function logRequestAndResponse(resolve, root, args, context, info) {
    let log = context.request.log.child({ args });
    if (context.request.headers) {
        log = log.child({ headers: context.request.headers });
    }
    log.info(`Operation: ${info.parentType} name: ${info.fieldName}`);
    try {
        const t0 = perf_hooks_1.performance.now();
        const response = await resolve(root, args, context, info);
        const t1 = perf_hooks_1.performance.now();
        context.request.log.info(`Operation: ${info.parentType} name: ${info.fieldName} complete. Took ${(t1 - t0).toFixed(2)} milliseconds.'`);
        return response;
    }
    catch (error) {
        context.request.log.error(error.stack);
        throw error;
    }
}
exports.loggerMiddleware = {
    Query: logRequestAndResponse,
    Mutation: logRequestAndResponse,
};
