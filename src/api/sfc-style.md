---
sidebarDepth: 1
---

# Características de estilos de SFC

## `<style scoped>`

Cuando una etiqueta `<style>` tiene el atributo `scoped`, sus CSS sólo serán aplicadas a elementos del componente actual. Este es similar a la encapsulación de estilos encontrados en DOM _shadow_. Viene con algunas advertencias, pero no necesita cualquier _polyfill_. Es realizado mediante utlizar PostCSS para transformar el siguiente:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

al siguiente:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Los Elementos Raíz de Componentes Hijos

Con `scoped`, los estilos del componente padre no se filtrarán a componentes hijos. Sin embargo, el nodo raíz de un componente hijo será afectado por las CSS del alcance padre y las CSS del alcance hijo. Eso es a propósito para que el padre pueda aplicar estilos al elemento raíz del hijo para el propósito de _layout_.

### Selector _Deep_

Si quiere que un selector en estilos con alcance sea "profundo", p. ej. afectar componentes hijos, puede utilizar el _pseudo-class_ `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

El arriba será compilado a:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
Los contenidos DOM creados por `v-html` no son afectados por estilos con alcance, pero puede también aplicar estilos a ellos utilizando selectores profundos.
:::

### Selector _Slotted_

Por defector, los estilos con alcance no afectan a contenidos renderizados por `<slot/>`, debido a que son considerados pertenecientes al componente padre que los pasen. Para orientar explícitamente los contenidos de _slot_, utilice el _pseudo-class_ `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Selector _Global_

Si quiere que se aplique solo una regla globalmente, puede utilizar el _pseudo-class_ `:global` en vez de crear otro `<style>` (vea abajo):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Mezclar Los Estilos Locales y Globales

Puede también incluir estilos tanto con alcance como sin alcance en el mismo componente:

```vue
<style>
/* estilos globales */
</style>

<style scoped>
/* estilos locales */
</style>
```

### Scoped Style Tips

- **Scoped styles do not eliminate the need for classes**. Due to the way browsers render various CSS selectors, `p { color: red }` will be many times slower when scoped (i.e. when combined with an attribute selector). If you use classes or ids instead, such as in `.example { color: red }`, then you virtually eliminate that performance hit.

- **Be careful with descendant selectors in recursive components!** For a CSS rule with the selector `.a .b`, if the element that matches `.a` contains a recursive child component, then all `.b` in that child component will be matched by the rule.

## `<style module>`

A `<style module>` tag is compiled as [CSS Modules](https://github.com/css-modules/css-modules) and exposes the resulting CSS classes to the component as an object under the key of `$style`:

```vue
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

The resulting classes are hashed to avoid collision, achieving the same effect of scoping the CSS to the current component only.

Refer to the [CSS Modules spec](https://github.com/css-modules/css-modules) for more details such as [global exceptions](https://github.com/css-modules/css-modules#exceptions) and [composition](https://github.com/css-modules/css-modules#composition).

### Custom Inject Name

You can customize the property key of the injected classes object by giving the `module` attribute a value:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Usage with Composition API

The injected classes can be accessed in `setup()` and `<script setup>` via the [`useCssModule`](/api/global-api.html#usecssmodule) API. For `<style module>` blocks with custom injection names, `useCssModule` accepts the matching `module` attribute value as the first argument:

```js
// default, returns classes for <style module>
useCssModule()

// named, returns classes for <style module="classes">
useCssModule('classes')
```

## State-Driven Dynamic CSS

SFC `<style>` tags support linking CSS values to dynamic component state using the `v-bind` CSS function:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

The syntax works with [`<script setup>`](./sfc-script-setup), and supports JavaScript expressions (must be wrapped in quotes):

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

The actual value will be compiled into a hashed CSS custom property, so the CSS is still static. The custom property will be applied to the component's root element via inline styles and reactively updated if the source value changes.
