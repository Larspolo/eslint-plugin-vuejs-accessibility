# click-events-have-role

Enforce `@click` is accompanied by a interactive role.

## Rule details

This rule takes no arguments.

### Succeed

```vue
<div @click="foo" role="button" />
<div />
<div @click="foo" @role="tab" />
```

### Fail

```vue
<div @click="foo" />
<div @click="foo" role="non-interactive-role" />
```
