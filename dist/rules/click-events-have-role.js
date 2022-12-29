"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aria_query_1 = require("aria-query");
const htmlElements_json_1 = __importDefault(require("../utils/htmlElements.json"));
const utils_1 = require("../utils");
// Why can I not import this like normal? See click events have key events.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vueEslintParser = require("vue-eslint-parser");
const interactiveRoles = [];
for (const [role, definition] of aria_query_1.roles.entries()) {
    if (!definition.abstract &&
        definition.superClass.some((classes) => classes.includes("widget"))) {
        interactiveRoles.push(role);
    }
}
const interactiveHandlers = [
    "click",
    "contextmenu",
    "dblclick",
    "doubleclick",
    "drag",
    "dragend",
    "dragenter",
    "dragexit",
    "dragleave",
    "dragover",
    "dragstart",
    "drop",
    "keydown",
    "keypress",
    "keyup",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup"
];
function isDisabledElement(node) {
    return ((0, utils_1.getElementAttributeValue)(node, "disabled") ||
        ((0, utils_1.getElementAttributeValue)(node, "aria-disabled") || "").toString() ===
            "true");
}
function isInteractiveRole(value) {
    if (typeof value !== "string") {
        return false;
    }
    return value
        .toLowerCase()
        .split(" ")
        .some((role) => aria_query_1.roles.has(role) && interactiveRoles.includes(role));
}
function isHtmlElementNode(node) {
    return node.namespace === vueEslintParser.AST.NS.HTML;
}
function isCustomComponent(node) {
    return ((isHtmlElementNode(node) && !htmlElements_json_1.default.includes(node.rawName)) ||
        !!(0, utils_1.getElementAttribute)(node, "is"));
}
function hasTabIndex(node) {
    const attribute = (0, utils_1.getElementAttribute)(node, "tabindex");
    if (!attribute) {
        return false;
    }
    const value = (0, utils_1.getAttributeValue)(attribute);
    if (["string", "number"].includes(typeof value)) {
        if (typeof value === "string" && value.length === 0) {
            return false;
        }
        return Number.isInteger(Number(value));
    }
    if (value === true || value === false) {
        return false;
    }
    return value === null;
}
const rule = {
    meta: {
        type: "problem",
        docs: {
            url: (0, utils_1.makeDocsURL)("click-events-have-role")
        },
        messages: {
            default: "Interactive elements must have role.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    components: {
                        type: "array",
                        items: { type: "string" }
                    },
                    includeAllCustomComponents: {
                        type: "boolean",
                    },
                }
            }
        ],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            VElement(node) {
                const { components = [], includeAllCustomComponents = false, } = context.options[0] || {};
                const role = (0, utils_1.getElementAttributeValue)(node, "role");
                if ((includeAllCustomComponents || !isCustomComponent(node) || components.map(utils_1.makeKebabCase).includes((0, utils_1.getElementType)(node))) &&
                    (0, utils_1.hasOnDirectives)(node, interactiveHandlers) &&
                    !hasTabIndex(node) &&
                    !isDisabledElement(node) &&
                    !(0, utils_1.isHiddenFromScreenReader)(node) &&
                    !isInteractiveRole(role) &&
                    !(0, utils_1.isInteractiveElement)(node)) {
                    context.report({
                        node: node,
                        messageId: "default",
                    });
                }
            }
        });
    },
    interactiveHandlers,
    interactiveRoles
};
exports.default = rule;
