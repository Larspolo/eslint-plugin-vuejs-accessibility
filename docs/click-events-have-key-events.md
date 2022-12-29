# click-events-have-key-events

Enforce `@click` is accompanied by at least one of the following: `@keyup`, `@keydown`, `@keypress`. Coding for the keyboard is important for users with physical disabilities who cannot use a mouse, AT compatibility, and screenreader users.

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

For the `components` option, these strings determine which custom components should also be checked. This is a good use case for libraries that are not well implemented.

For the `includeAllCustomComponents` option, this boolean (default false) includes all custom components, not just the ones specified in the `components` option.

### Succeed

```vue
<div @click="foo" @keydown="bar" />
<div @click="foo" @keyup="bar" />
<div @click="foo" @keypress="bar" />
```

### Fail

```vue
<div @click="foo" />
```
