# Especificación de la Sintaxis SFC

## Introducción

Un archivo `*.vue` es un formato de archivo personalizado utilizando sintaxis similar a HTML para describir un componente Vue. Cada archivo `*.vue` consiste de tres tipos de bloques de lenguaje de nivel superior: `<template>`, `<script>`, y `<style>`, y opcionalmente bloques personalizados adicionales:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: '¡Hola mundo!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  Este podría ser p. ej. documentación para el componente.
</custom1>
```

## Bloques de Lenguaje

### `<template>`

- Cada archivo `*.vue` puede contener a lo más un bloque `<template>` de nivel superior al mismo tiempo.

- Los contenidos será extraidos y pasados a `@vue/compiler-dom`, precompilados a funciones JavaScript de _render_, y adjuntados al componente exportado como su opción `render`.

### `<script>`

- Cada archivo `*.vue` puede contener a lo más un bloque `<script>` al mismo tiempo (excepto [`<script setup>`](/api/sfc-script-setup.html)).

- El script es ejecutado como un módulo ES.

- La **exportación por defecto** debe ser un objeto de opciones de componente Vue, tanto un objeto plano como el valor retornado de [defineComponent](/api/global-api.html#definecomponent).

### `<script setup>`

- Cada archivo `*.vue` puede contener a lo más un bloque `<script setup>` al mismo tiempo (excepto el `<script>` normal).

- El script es preprocesado y utilizado como la función `setup()` del componente, lo que significa que será ejecutado **para cada instancia del componente**. Las vinculaciones de nivel superior en `<script setup>` son automáticamente expuestos a la plantilla. Para más detalles, vea [documentación dedicada sobre `<script setup>`](/api/sfc-script-setup).

### `<style>`

- A single `*.vue` file can contain multiple `<style>` tags.

- A `<style>` tag can have `scoped` or `module` attributes (see [SFC Style Features](/api/sfc-style) for more details) to help encapsulate the styles to the current component. Multiple `<style>` tags with different encapsulation modes can be mixed in the same component.

### Bloques Personalizados

Additional custom blocks can be included in a `*.vue` file for any project-specific needs, for example a `<docs>` block. Some real-world examples of custom blocks include:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

Handling of Custom Blocks will depend on tooling - if you want to build your own custom block integrations, see [SFC Tooling](/api/sfc-tooling.html#custom-blocks-integration) for more details.

## Inferencia de `name` Automática

An SFC automatically infers the component's name from its **filename** in the following cases:

- Dev warning formatting
- DevTools inspection
- Recursive self-reference. E.g. a file named `FooBar.vue` can refer to itself as `<FooBar/>` in its template. This has lower priority than explicity registered/imported components.

## Preprocesadores (Pre-Processors)

Blocks can declare pre-processor languages using the `lang` attribute. The most common case is using TypeScript for the `<script>` block:

```html
<script lang="ts">
  // use TypeScript
</script>
```

`lang` can be applied to any block - for example we can use `<style>` with [SASS](https://sass-lang.com/) and `<template>` with [Pug](https://pugjs.org/api/getting-started.html):

```html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Note the intergration with pre-processors may differ based on the toolchain. Check out the respective documentations for examples:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importaciones de _Src_

If you prefer splitting up your `*.vue` components into multiple files, you can use the `src` attribute to import an external file for a language block:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Beware that `src` imports follow the same path resolution rules as webpack module requests, which means:

- Relative paths need to start with `./`
- You can import resources from npm dependencies:

```vue
<!-- import a file from the installed "todomvc-app-css" npm package -->
<style src="todomvc-app-css/index.css">
```

`src` imports also work with custom blocks, e.g.:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## Comentarios

Inside each block you shall use the comment syntax of the language being used (HTML, CSS, JavaScript, Pug, etc.). For top-level comments, use HTML comment syntax: `<!-- comment contents here -->`
