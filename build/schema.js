"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const path_1 = __importDefault(require("path"));
const graphql_middleware_1 = require("graphql-middleware");
const nexus_1 = require("nexus");
const schema_1 = require("nexus-plugin-prisma/schema");
const types = __importStar(require("./graphql"));
const middlewares = __importStar(require("./middlewares"));
exports.schema = graphql_middleware_1.applyMiddleware(nexus_1.makeSchema({
    types,
    plugins: [
        schema_1.nexusSchemaPrisma({
            experimentalCRUD: true,
            paginationStrategy: 'prisma',
        }),
        nexus_1.declarativeWrappingPlugin({ disable: true }),
    ],
    outputs: {
        schema: path_1.default.join(__dirname, '/generated/schema.graphql'),
        typegen: path_1.default.join(__dirname, '/generated/nexus.ts'),
    },
    contextType: {
        module: require.resolve('./context'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [
            {
                module: require.resolve('.prisma/client/index.d.ts'),
                alias: 'prisma',
            },
        ],
    },
}), middlewares.loggerMiddleware);
