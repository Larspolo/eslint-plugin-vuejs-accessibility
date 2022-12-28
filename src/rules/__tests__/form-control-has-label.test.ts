import rule from "../form-control-has-label";
import makeRuleTester from "./makeRuleTester";

makeRuleTester("form-control-has-label", rule, {
  valid: [
    "<label for=''><input type='text' /></label>",
    "<input type='text' aria-label='test' />",
    "<label for=''>text</label><input type='text' />",
    "<input type='button'>",
    `
      <label>
        <div>
          <input type="radio" />
        </div>
        <div>
          <slot />
        </div>
      </label>
    `,
    `
      <div aria-hidden="true">
        <input value="1" type="text" />
      </div>
    `,
    {
      code: "<custom-label for='input'>text</custom-label><input type='text' id='input' />",
      options: [{ labelComponents: ["CustomLabel"] }]
    },
    {
      code: "<custom-label label='text'><input type='text' id='input' /></custom-label>",
      options: [{ labelComponentsWithLabel: ["CustomLabel"] }]
    },
    "<b-form-input />"
  ],
  invalid: [
    "<input type='text' />",
    "<textarea type='text'></textarea>",
    "<custom-label for='input'>text</custom-label><input type='text' id='input' />",
    {
      code: "<div><b-form-input /></div>",
      options: [{ controlComponents: ["b-form-input"] }],
      errors: [{ messageId: "default" }]
    },
    {
      code: "<div label='text'><b-form-input /></div>",
      options: [{ controlComponents: ["b-form-input"] }],
      errors: [{ messageId: "default" }]
    },
    {
      code: "<custom-label><input type='text' id='input' /></custom-label>",
      options: [{ labelComponentsWithLabel: ["CustomLabel"] }],
      errors: [{ messageId: "default" }]
    },
    {
      code: "<custom-label label='text'>label next to input</custom-label><input type='text' id='input' />",
      options: [{ labelComponentsWithLabel: ["CustomLabel"] }],
      errors: [{ messageId: "default" }]
    },
  ]
});
