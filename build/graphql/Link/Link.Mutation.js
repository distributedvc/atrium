"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOneLink = void 0;
const nanoid_1 = require("nanoid");
const nexus_1 = require("nexus");
const url_regex_safe_1 = __importDefault(require("url-regex-safe"));
const utils_1 = require("../../utils");
exports.createOneLink = nexus_1.mutationField('createOneLink', {
    type: nexus_1.nonNull('Link'),
    args: {
        input: nexus_1.nonNull(nexus_1.arg({ type: 'CreateOneLinkInput' })),
    },
    async resolve(_, { input }, { analytics, prisma, request }) {
        let { name } = input;
        const { url } = input;
        const isValidUrl = url_regex_safe_1.default({ exact: true, strict: true }).test(url);
        if (!isValidUrl) {
            throw new Error('You must provide a valid url');
        }
        if (name) {
            const exists = await prisma.link.count({ where: { name } });
            if (exists) {
                throw new Error(`${name} is already taken`);
            }
        }
        else {
            name = nanoid_1.nanoid();
        }
        const params = { name, url };
        const [link] = await Promise.all([
            prisma.link.create({ data: params }),
            analytics.track({
                anonymousId: utils_1.getOrCreateAnonymousId({ request }),
                event: 'Link Created',
                properties: params,
            }),
        ]);
        return link;
    },
});
