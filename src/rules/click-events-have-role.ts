import type { Rule } from "eslint";
import type { AST } from "vue-eslint-parser";
import { ARIARoleDefinitionKey, dom, roles } from "aria-query";

import {
  defineTemplateBodyVisitor,
  getAttributeValue,
  getElementAttribute,
  getElementAttributeValue,
  getElementType,
  hasOnDirectives,
  isHiddenFromScreenReader,
  isInteractiveElement,
  makeDocsURL
} from "../utils";

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
          tabbable: {
            type: "array",
            items: {
              type: "string",
              enum: interactiveRoles,
              default: [
                "button",
                "checkbox",
                "link",
                "searchbox",
                "spinbutton",
                "switch",
                "textbox"
              ]
            },
            uniqueItems: true,
            additionalItems: false
          }
        }
      }
    ]
  },
  create(context) {
    return defineTemplateBodyVisitor(context, {
      VElement(node) {
        const role = getElementAttributeValue(node, "role");

        if (
          dom.has(getElementType(node)) &&
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
