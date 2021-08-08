"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics = void 0;
const analytics_node_1 = require("@distributed/analytics-node");
exports.analytics = new analytics_node_1.Analytics(process.env.SEGMENT_ANALYTICS_KEY);
