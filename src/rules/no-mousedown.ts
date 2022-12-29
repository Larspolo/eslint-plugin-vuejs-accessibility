import type { Rule } from "eslint";

import {
  defineTemplateBodyVisitor,
  hasOnDirective,
  makeDocsURL
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      url: makeDocsURL("no-mousedown")
    },
    messages: {
      default:
        "The @mousedown action should not be used, as it can reduce usability and accessibility for users. Use @click instead"
    },
    schema: []
  },
  create(context) {
    return defineTemplateBodyVisitor(context, {
      VElement(node) {

        if (!hasOnDirective(node, "mousedown")) {
          return;
        }

        context.report({ node: node as any, messageId: "default" });
      }
    });
  }
};

export default rule;
