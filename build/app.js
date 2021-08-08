"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_compress_1 = __importDefault(require("fastify-compress"));
const mercurius_1 = __importDefault(require("mercurius"));
const mercurius_cache_1 = __importDefault(require("mercurius-cache"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const fastify_helmet_1 = __importDefault(require("fastify-helmet"));
const pino_1 = __importDefault(require("pino"));
const fastify_rate_limit_1 = __importDefault(require("fastify-rate-limit"));
const context_1 = require("./context");
const routes_1 = require("./routes");
const schema_1 = require("./schema");
function init() {
    const app = fastify_1.default({
        trustProxy: true,
        logger: pino_1.default({
            level: process.env.NODE_ENV === 'staging' || !process.env.NODE_ENV ? 'debug' : 'info',
        }),
    });
    const isProduction = process.env.NODE_ENV === 'production';
    app.register(fastify_helmet_1.default, {
        ...(!isProduction && {
            contentSecurityPolicy: false,
        }),
    });
    app.register(fastify_cookie_1.default);
    app.register(fastify_compress_1.default, { inflateIfDeflated: true, encodings: ['gzip', 'deflate'] });
    app.register(fastify_rate_limit_1.default, {
        max: 200,
        timeWindow: 60 * 1000,
    });
    app.register(mercurius_1.default, {
        schema: schema_1.schema,
        queryDepth: 4,
        path: '/',
        ide: !isProduction,
        graphiql: !isProduction && 'playground',
        allowBatchedQueries: true,
        context: async (request, reply) => {
            return {
                ...context_1.createContext({ request, reply }),
            };
        },
    });
    app.register(routes_1.routes);
    app.register(mercurius_cache_1.default, {
        policy: {
            Query: {
                link: true,
            },
        },
    });
    return app;
}
exports.default = init;
if (require.main === module) {
    (async () => {
        const app = init();
        await app.ready();
        app.listen(4000, (err) => {
            if (err) {
                app.log.error('Could not start the server');
                throw err;
            }
        });
    })();
}
