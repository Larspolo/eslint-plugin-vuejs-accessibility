"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const rule = {
    meta: {
        type: "problem",
        docs: {
            url: (0, utils_1.makeDocsURL)("no-mousedown")
        },
        messages: {
            default: "The @mousedown action should not be used, as it can reduce usability and accessibility for users. Use @click instead"
        },
        schema: []
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            VElement(node) {
                if (!(0, utils_1.hasOnDirective)(node, "mousedown")) {
                    return;
                }
                context.report({ node: node, messageId: "default" });
            }
        });
    }
};
exports.default = rule;
