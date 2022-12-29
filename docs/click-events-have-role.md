# click-events-have-role

Enforce `@click` is accompanied by a interactive role.

## Rule details

This rule takes one optional object argument of type object:

```json
{
  "rules": {
    "vuejs-accessibility/click-events-have-role": [
      "error",
      {
        "components": ["CustomComponent"],
        "includeAllCustomComponents": true,
      }
    ]
  }
}
```

For the `components` option, these strings determine which custom components should also be checked for only having click events. This is a good use case when you have a wrapper component does not handle the click event properly.

For the `includeAllCustomComponents` option, this boolean (default false) includes all custom components, not just the ones specified in the `components` option.

### Succeed

```vue
<div @click="foo" role="button" />
<div />
<div @click="foo" @role="tab" />
<CustomComponent @click="foo" />
```

### Fail

```vue
<div @click="foo" />
<div @click="foo" role="non-interactive-role" />
```
