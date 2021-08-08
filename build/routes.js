"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const context_1 = require("./context");
const utils_1 = require("./utils");
async function routes(fastify) {
    fastify.get('/:name', async (request, reply) => {
        const { analytics, prisma } = context_1.createContext({ request, reply });
        const { name } = request.params;
        if (!name) {
            return reply.send(new http_errors_1.default.BadRequest());
        }
        const [link] = await Promise.all([
            prisma.link.findUnique({ where: { name } }),
            analytics.page({
                name,
                anonymousId: utils_1.getOrCreateAnonymousId({ request }),
            }),
        ]);
        if (!link) {
            return reply.send(new http_errors_1.default.NotFound());
        }
        return reply.redirect(301, link.url);
    });
}
exports.routes = routes;
