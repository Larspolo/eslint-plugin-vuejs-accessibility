# no-autofocus

Enforce that autofocus prop is not used on elements. Autofocusing elements can cause usability issues for sighted and non-sighted users alike.

_References:_

1. [W3C](https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html)

## Rule details

This rule takes one optional object argument of type object:

```json
{
  "rules": {
    "vuejs-accessibility/no-autofocus": ["error", { "ignoreNonDOM": true }]
  }
}
```

For the `ignoreNonDOM` option, this determines if developer created components are checked.

### Succeed

```vue
<div />
```

### Fail

```vue
<input @mousedown="foo" />
```
