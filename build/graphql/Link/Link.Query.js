"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkQuery = void 0;
const nexus_1 = require("nexus");
exports.linkQuery = nexus_1.queryField('link', {
    type: 'Link',
    args: {
        input: nexus_1.nonNull(nexus_1.arg({ type: 'GetOneLinkInput' })),
    },
    async resolve(_, { input }, { prisma }) {
        const { name } = input;
        return prisma.link.findUnique({
            where: { name },
        });
    },
});
