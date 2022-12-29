import rule from "../anchor-has-content";
import makeRuleTester from "./makeRuleTester";

makeRuleTester("anchor-has-content", rule, {
  valid: [
    "<a href='http://x.y.z'>Anchor Content!</a>",
    "<a href='http://x.y.z' is='TextWrapper' />",
    "<a href='http://x.y.z' v-text='msg' />",
    "<a href='http://x.y.z' v-html='msg' />",
    "<a href='http://x.y.z'><slot /></a>",
    "<VAnchor href='http://x.y.z' />",
    "<a href='http://x.y.z' aria-label='This is my label' />",
    "<a href='http://x.y.z'><img alt='foo' /></a>",
    "<a href='http://x.y.z'><span v-html='msg' /></a>",
    "<a href='http://x.y.z'><span v-text='msg' /></a>",
    {
      code: "<a href='http://x.y.z' v-accessibleDirective='msg' />",
      options: [{ accessibleDirectives: ["accessibleDirective"] }]
    },
    {
      code: "<a><accessible-child /></a>",
      options: [{ accessibleChildren: ["AccessibleChild"] }]
    },
    "<a />"
  ],
  invalid: [
    "<a href='http://x.y.z' />",
    {
      code: "<v-anchor href='http://x.y.z' />",
      options: [{ components: ["VAnchor"] }],
      errors: [{ messageId: "default" }]
    },
    "<a href='http://x.y.z'><img aria-hidden alt='foo' /></a>"
  ]
});
