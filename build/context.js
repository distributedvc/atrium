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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const nanoid_1 = require("nanoid");
const Lib = __importStar(require("./lib"));
exports.prisma = new client_1.PrismaClient();
function createContext({ request, reply, }) {
    const correlationId = nanoid_1.nanoid();
    return {
        correlationId,
        analytics: Lib.Segment.analytics,
        request,
        reply,
        prisma: exports.prisma,
    };
}
exports.createContext = createContext;
