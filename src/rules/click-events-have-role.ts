import type { Rule } from "eslint";
import type { AST } from "vue-eslint-parser";
import { ARIARoleDefinitionKey, dom, roles } from "aria-query";

import htmlElements from "../utils/htmlElements.json";
import {
  defineTemplateBodyVisitor,
  getAttributeValue,
  getElementAttribute,
  getElementAttributeValue,
  getElementType,
  hasOnDirectives,
  isHiddenFromScreenReader,
  isInteractiveElement,
  makeDocsURL,
  makeKebabCase
} from "../utils";

// Why can I not import this like normal? See click events have key events.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vueEslintParser = require("vue-eslint-parser");

const interactiveRoles: ARIARoleDefinitionKey[] = [];

for (const [role, definition] of roles.entries()) {
  if (
    !definition.abstract &&
    definition.superClass.some((classes) => classes.includes("widget"))
  ) {
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

function isDisabledElement(node: AST.VElement) {
  return (
    getElementAttributeValue(node, "disabled") ||
    (getElementAttributeValue(node, "aria-disabled") || "").toString() ===
      "true"
  );
}

function isInteractiveRole(value: any): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return value
    .toLowerCase()
    .split(" ")
    .some(
      (role) => roles.has(role as any) && interactiveRoles.includes(role as any)
    );
}

function isHtmlElementNode(node: AST.VElement) {
  return node.namespace === vueEslintParser.AST.NS.HTML;
}

function isCustomComponent(node: AST.VElement) {
  return (
    (isHtmlElementNode(node) && !htmlElements.includes(node.rawName)) ||
    !!getElementAttribute(node, "is")
  );
}


function hasTabIndex(node: AST.VElement) {
  const attribute = getElementAttribute(node, "tabindex");

  if (!attribute) {
    return false;
  }

  const value = getAttributeValue(attribute);

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

interface InteractiveSupportsFocus extends Rule.RuleModule {
  interactiveHandlers: string[];
  interactiveRoles: ARIARoleDefinitionKey[];
}

const rule: InteractiveSupportsFocus = {
  meta: {
    type: "problem",
    docs: {
      url: makeDocsURL("click-events-have-role")
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
    return defineTemplateBodyVisitor(context, {
      VElement(node) {
        const {
          components = [],
          includeAllCustomComponents = false,
        } = context.options[0] || {};

        const role = getElementAttributeValue(node, "role");

        if (
          (includeAllCustomComponents || !isCustomComponent(node) || components.map(makeKebabCase).includes(getElementType(node))) &&
          hasOnDirectives(node, interactiveHandlers) &&
          !hasTabIndex(node) &&
          !isDisabledElement(node) &&
          !isHiddenFromScreenReader(node) &&
          !isInteractiveRole(role) &&
          !isInteractiveElement(node)
        ) {
          context.report({
            node: node as any,
            messageId: "default",
          });
        }
      }
    });
  },
  interactiveHandlers,
  interactiveRoles
};

export default rule;
