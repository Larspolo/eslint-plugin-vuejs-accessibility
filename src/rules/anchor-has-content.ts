import type { Rule } from "eslint";

import {
  defineTemplateBodyVisitor,
  getElementAttributeValue,
  getElementType,
  hasAriaLabel,
  hasContent,
  hasOnDirectives,
  makeDocsURL,
  makeKebabCase
} from "../utils";

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
  "mouseup",
];

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      url: makeDocsURL("anchor-has-content")
    },
    messages: {
      default:
        "Anchors must have content and the content must be accessible by a screen reader."
    },
    schema: [
      {
        type: "object",
        properties: {
          components: {
            type: "array",
            items: { type: "string" }
          },
          accessibleChildren: {
            type: "array",
            items: { type: "string" }
          },
          accessibleDirectives: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    ]
  },
  create(context) {
    return defineTemplateBodyVisitor(context, {
      VElement(node) {
        const {
          components = [],
          accessibleChildren = [],
          accessibleDirectives = []
        } = context.options[0] || {};

        const elementTypes = ["a"].concat(components.map(makeKebabCase));
        const accessibleChildTypes = accessibleChildren.map(makeKebabCase);

        const elementType = getElementType(node);

        if (
          elementTypes.includes(elementType) &&
          !hasContent(node, accessibleChildTypes, accessibleDirectives) &&
          (hasOnDirectives(node, interactiveHandlers) || getElementAttributeValue(node, "href")) &&
          !hasAriaLabel(node)
        ) {
          context.report({ node: node as any, messageId: "default" });
        }
      }
    });
  }
};

export default rule;
