import type { Rule } from "eslint";
import type { AST } from "vue-eslint-parser";

import htmlElements from "../utils/htmlElements.json";
import {
  defineTemplateBodyVisitor,
  getElementAttribute,
  getElementType,
  hasOnDirective,
  hasOnDirectives,
  isHiddenFromScreenReader,
  isInteractiveElement,
  isPresentationRole,
  makeDocsURL,
  makeKebabCase
} from "../utils";

// Why can I not import this like normal? Unclear.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vueEslintParser = require("vue-eslint-parser");

function isHtmlElementNode(node: AST.VElement) {
  return node.namespace === vueEslintParser.AST.NS.HTML;
}

function isCustomComponent(node: AST.VElement) {
  return (
    (isHtmlElementNode(node) && !htmlElements.includes(node.rawName)) ||
    !!getElementAttribute(node, "is")
  );
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      url: makeDocsURL("click-events-have-key-events")
    },
    messages: {
      default:
        "Visible, non-interactive elements with click handlers must have at least one keyboard listener."
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
      }]
  },
  create(context) {
    const {
      components = [],
      includeAllCustomComponents = false,
    } = context.options[0] || {};

    return defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (
          (includeAllCustomComponents || !isCustomComponent(node) || components.map(makeKebabCase).includes(getElementType(node))) &&
          hasOnDirective(node, "click") &&
          !isHiddenFromScreenReader(node) &&
          !isPresentationRole(node) &&
          !isInteractiveElement(node) &&
          !hasOnDirectives(node, ["keydown", "keyup", "keypress"])
        ) {
          context.report({ node: node as any, messageId: "default" });
        }
      }
    });
  }
};

export default rule;
