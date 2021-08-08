"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const nexus_1 = require("nexus");
exports.Link = nexus_1.objectType({
    name: 'Link',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.updatedAt();
        t.model.name();
        t.model.url();
    },
});
