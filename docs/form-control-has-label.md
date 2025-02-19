# form-control-has-label

Each form element must have a programmatically associated label element. You can do so by using an implicit `<label>`, explicit `<label>`, `aria-label` or `aria-labelledby`.

_References:_

1. [AXE](https://dequeuniversity.com/rules/axe/2.1/label)

## Rule details

This rule takes one optional object argument of type object:

```json
{
  "rules": {
    "vuejs-accessibility/form-control-has-label": [
      "error",
      {
        "labelComponents": [
          "CustomLabel",
        ],
        "labelComponentsWithRequiredAttributes": [
          { "name": "CustomComponentWithRequiredAttribute", "requiredAttributes": ["label"] },
        ]
        "controlComponents": ["CustomInput"]
      }
    ]
  }
}
```

For the `labelComponents` option, these strings determine which elements (**always including** `<label>`) should be checked for having the `for` prop. This is a good use case when you have a wrapper component that simply renders a `label` element.

For the `labelComponentsWithRequiredAttributes` option, these objects determine which elements should be checked for having a value for any of the `requiredAttributes` as an attribute. This is a good use case when you have a wrapper component that renders a `label` element when a specific attribute is provided.

For the `controlComponents` option, these strings determine which elements (**always including** `<input>`, `<textarea>` and `<select>`) should be checked for having an associated label. This is a good use case when you have a wrapper component that simply renders an input element.

### Succeed

```
<label><input type="text" /></label>
<input aria-label="test" type="text" />
<input aria-labelledby="#id" type="text" />
<label for="id"></label><input aria-labelledby="#id" id="id" />
<input type="image" />
```

### Fail

```
<input value="1" type="text" />
<textarea value="1"></textarea>
```
