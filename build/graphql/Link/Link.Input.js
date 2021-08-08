"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOneLinkInput = exports.CreateOneLinkInput = void 0;
const nexus_1 = require("nexus");
exports.CreateOneLinkInput = nexus_1.inputObjectType({
    name: 'CreateOneLinkInput',
    definition(t) {
        t.nullable.string('name');
        t.nonNull.string('url');
    },
});
exports.GetOneLinkInput = nexus_1.inputObjectType({
    name: 'GetOneLinkInput',
    definition(t) {
        t.nonNull.string('name');
    },
});
