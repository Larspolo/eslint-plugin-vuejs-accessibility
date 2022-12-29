"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function isLabelElement(node, { labelComponents = [] }) {
    const allLabelComponents = labelComponents.concat("label");
    return (0, utils_1.isMatchingElement)(node, allLabelComponents);
}
function isElementWithLabel(node, { labelComponentsWithLabel = [] }) {
    return Boolean((0, utils_1.isMatchingElement)(node, labelComponentsWithLabel)
        && ((0, utils_1.hasAriaLabel)(node) || (0, utils_1.getElementAttributeValue)(node, "label")));
}
function hasLabelElement(node, options) {
    const { parent } = node;
    return ([parent, ...parent.children].some((node) => isLabelElement(node, options)) ||
        (parent && parent.type === "VElement" && (isElementWithLabel(parent, options) || hasLabelElement(parent, options))));
}
const rule = {
    meta: {
        type: "problem",
        docs: {
            url: (0, utils_1.makeDocsURL)("form-control-has-label")
        },
        messages: {
            default: "Each form element must have a programmatically associated label element."
        },
        schema: [
            {
                type: "object",
                properties: {
                    labelComponents: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true
                    },
                    controlComponents: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true
                    }
                }
            }
        ]
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            VElement(node) {
                const options = context.options[0] || {};
                const controlComponents = [
                    "input",
                    "textarea",
                    "select",
                    ...(options.controlComponents || [])
                ];
                const elementType = (0, utils_1.getElementType)(node);
                if (!controlComponents.includes(elementType)) {
                    return;
                }
                if (elementType === "input") {
                    const type = (0, utils_1.getElementAttributeValue)(node, "type");
                    const types = ["hidden", "button", "image", "submit", "reset"];
                    if (!type || types.includes(type)) {
                        return;
                    }
                }
                if (!(0, utils_1.isAriaHidden)(node) &&
                    !(0, utils_1.hasAriaLabel)(node) &&
                    !hasLabelElement(node, options)) {
                    context.report({ node: node, messageId: "default" });
                }
            }
        });
    }
};
exports.default = rule;
