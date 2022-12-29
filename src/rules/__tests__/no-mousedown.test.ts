import rule from "../no-mousedown";
import makeRuleTester from "./makeRuleTester";

makeRuleTester("no-mousedown", rule, {
  valid: [
    "<div />",
    "<div @mousedown />",
  ],
  invalid: [
    "<div @mousedown='void 0' />",
  ]
});
