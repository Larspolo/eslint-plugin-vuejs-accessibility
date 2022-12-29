import rule from "../click-events-have-role";
import makeRuleTester from "./makeRuleTester";

makeRuleTester("click-events-have-role", rule, {
  valid: [
    "<div />",
    "<div aria-hidden @click='void 0' />",
    "<div role='button' @click='void 0' />",
    ...rule.interactiveRoles.map((role) => ({
      code: `<div role='${role}' tabindex='0' @click='foo' />`,
    })),
  ],
  invalid: [
    ...rule.interactiveHandlers.flatMap((handler) => ({
        code: `<div @${handler}='foo' />`,
        errors: [{ messageId: "default" }]
    })),
    ...rule.interactiveHandlers.flatMap((handler) => ({
        code: `<div role="non-interactive-role" @${handler}='foo' />`,
        errors: [{ messageId: "default" }]
    })),
    {
      code: "<TestComponent @click='void 0' />",
      options: [{ includeAllCustomComponents: true }],
      errors: [{ messageId: "default" }]
    },
    {
      code: "<TestComponent @click='void 0' />",
      options: [{ components: ["TestComponent"] }],
      errors: [{ messageId: "default" }]
    },
    {
      code: "<TestComponent @click='void 0' />",
      options: [{ components: ["test-component"] }],
      errors: [{ messageId: "default" }]
    },
  ]
});
