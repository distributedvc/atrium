"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateAnonymousId = void 0;
const nanoid_1 = require("nanoid");
function getOrCreateAnonymousId({ request }) {
    var _a;
    return ((_a = request.cookies) === null || _a === void 0 ? void 0 : _a.ajs_anonymous_id) || nanoid_1.nanoid();
}
exports.getOrCreateAnonymousId = getOrCreateAnonymousId;
