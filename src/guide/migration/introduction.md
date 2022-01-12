# Introducción

::: info
¿Usted es nuevo a Vue.js? Consulte nuestra [guía esencial](/guide/introduction.html) para empezar.
:::

Este guía es principalmente para usuarios con experiencia previa de Vue 2 quien quiere aprender sobre las nuevas características y cambios en Vue 3. **Este no es algo que tiene que leer desde arriba hasta abajo antes de probar Vue 3.** Mientras se ve como que mucho ya han cambiado, muchos de los que ya sabe y a usted le gustan sobre Vue todavía mantienen lo mismo, pero queremos ser lo más minucioso posible y proveemos explicaciones y ejemplos detalladas para cada cambio documentado.

- [Inicio Rápido](#quickstart)
- [Compilación para Migración](#migration-build)
- [Nuevas Características Destacadas](#notable-new-features)
- [Cambios Rotundos](#breaking-changes)
- [Librerías de Soporte](#supporting-libraries)

## Visión General

<br>
<iframe src="https://player.vimeo.com/video/440868720" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

Empiece a aprender Vue 3 en [Vue Mastery](https://www.vuemastery.com/courses-path/vue3).

## Inicio Rápido

Si quiere probar Vue 3 en un nuevo proyecto rápidamente:

- Mediante CDN: `<script src="https://unpkg.com/vue@next"></script>`
- _playground_ dentro del navegador en [Codepen](https://codepen.io/yyx990803/pen/OJNoaZL)
- _Sandbox_ dentro del navegador en [CodeSandbox](https://v3.vue.new)
- Andamio (scaffold) mediante [Vite](https://github.com/vitejs/vite):

  ```bash
  npm init vite hello-vue3 -- --template vue # O yarn create vite hello-vue3 --template vue
  ```

- Scaffold via [vue-cli](https://cli.vuejs.org/):

  ```bash
  npm install -g @vue/cli # O yarn global add @vue/cli
  vue create hello-vue3
  # seleccionar el preajuste vue 3
  ```

## Compilación para Migración

Si tiene un proyecto o librería existente de Vue 2 que intente actualizar a Vue 3, proveemos una compilación de Vue 3 que ofrezca APIs compatibles con Vue 2. Echa una vistazo a la página [compilación para migración](./migration-build.html) para más detalles.

## Nuevas Características Destacadas

Algunas de las nuevas características para ver en Vue 3 incluyen:

- [API de Composición](/guide/composition-api-introduction.html)
- [Teleport](/guide/teleport.html)
- [Fragmentos](/guide/migration/fragments.html)
- [Opción de componentes _emits_](/guide/component-custom-events.html)
- [API `createRenderer` de `@vue/runtime-core`](https://github.com/vuejs/vue-next/tree/master/packages/runtime-core) para crear renderizadores personalizados
- [Azúcar sintaxis de API de composición de SFC (`<script setup>`)](/api/sfc-script-setup.html)
- [Variables CSS impulsados por estados en SFC (`v-bind` en `<style>`)](/api/sfc-style.html#state-driven-dynamic-css)
- [`<style scoped>` de SFC ahora puede incluir reglas globales o reglas que solo se dirigen a contenido de _slot_](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)
- [Suspense](/guide/migration/suspense.html) <Badge text="experimental" type="warning" />

## Cambios Rotundos

El siguiente consiste una lista de cambios rotundos desde 2.x:

### API Global

- [API Global de Vue se ha cambiado para utilizar una instancia de aplicación](/guide/migration/global-api.html)
- [APIs Globales y internales se han reestructurado para ser capaz para _tree-shake_](/guide/migration/global-api-treeshaking.html)

### Directivas de Plantillas

- [El uso de `v-model` en componentes han sido rehecho, reemplazando `v-bind.sync`](/guide/migration/v-model.html)
- [El uso de `key` en `<template v-for>` y nodos non-`v-for` ha cambiado](/guide/migration/key-attribute.html)
- [La precedencia de `v-if` y `v-for` cuando se utilizan en el mismo elemento ha cambiado](/guide/migration/v-if-v-for.html)
- [`v-bind="object"` ahora es sensible al orden](/guide/migration/v-bind.html)
- [El modificador `v-on:event.native` se ha eliminado](./v-on-native-modifier-removed.md)
- [El `ref` dentro de `v-for` ya no registra una matriz de _refs_](/guide/migration/array-refs.html)

### Componentes

- [Componentes funcionales solo pueden ser creados utilizando una función plana](/guide/migration/functional-components.html)
- [El atributo `functional` en `<template>` de un componente de un solo archivo (SFC) y la opción de componente `functional` son deprecados](/guide/migration/functional-components.html)
- [Ahora se requiere el método `defineAsyncComponent` para crear componentes asíncronos](/guide/migration/async-components.html)
- [Los eventos de componentes ahora deben ser declarados con la opción `emits`](./emits-option.md)

### Función Render

- [Se ha cambiado la API de función render](/guide/migration/render-function-api.html)
- [La propiedad `$scopedSlots` se ha eliminado y todos los _slots_ son expuestos mediante `$slots` como funciones](/guide/migration/slots-unification.html)
- [La propiedad `$listeners` se ha eliminado / fusionado con `$attrs`](./listeners-removed)
- [La propiedad `$attrs` ahora incluye los atributos `class` y `style`](./attrs-includes-class-style.md)

### Elementos Personalizados

- [Las verificaciones de elementos personalizados ahora son realizadas durante el proceso de compilación de plantilla](/guide/migration/custom-elements-interop.html)
- [El uso del artibuto especial `is` es limitado a la etiqueta reservada `<component>` solamente](/guide/migration/custom-elements-interop.html#customized-built-in-elements)

### Otros cambios minores

- The `destroyed` lifecycle option has been renamed to `unmounted`
- The `beforeDestroy` lifecycle option has been renamed to `beforeUnmount`
- [Props `default` factory function no longer has access to `this` context](/guide/migration/props-default-this.html)
- [Custom directive API changed to align with component lifecycle and `binding.expression` removed](/guide/migration/custom-directives.html)
- [The `data` option should always be declared as a function](/guide/migration/data-option.html)
- [The `data` option from mixins is now merged shallowly](/guide/migration/data-option.html#mixin-merge-behavior-change)
- [Attributes coercion strategy changed](/guide/migration/attribute-coercion.html)
- [Some transition classes got a rename](/guide/migration/transition.html)
- [`<TransitionGroup>` now renders no wrapper element by default](/guide/migration/transition-group.html)
- [When watching an array, the callback will only trigger when the array is replaced. If you need to trigger on mutation, the `deep` option must be specified.](/guide/migration/watch.html)
- `<template>` tags with no special directives (`v-if/else-if/else`, `v-for`, or `v-slot`) are now treated as plain elements and will result in a native `<template>` element instead of rendering its inner content.
- [Mounted application does not replace the element it's mounted to](/guide/migration/mount-changes.html)
- [Lifecycle `hook:` events prefix changed to `vnode-`](/guide/migration/vnode-lifecycle-events.html)

### Removed APIs

- [`keyCode` support as `v-on` modifiers](/guide/migration/keycode-modifiers.html)
- [$on, $off and \$once instance methods](/guide/migration/events-api.html)
- [Filters](/guide/migration/filters.html)
- [Inline templates attributes](/guide/migration/inline-template-attribute.html)
- [`$children` instance property](/guide/migration/children.html)
- [`propsData` option](/guide/migration/props-data.html)
- `$destroy` instance method. Users should no longer manually manage the lifecycle of individual Vue components.
- Global functions `set` and `delete`, and the instance methods `$set` and `$delete`. They are no longer required with proxy-based change detection.

## Librerías de Soporte

All of our official libraries and tools now support Vue 3, but some of them are still in beta or release candidate status. You'll find details for the individual libraries below. Most are currently distributed using the `next` dist tag on npm. We intend to switch to `latest` once all the official libraries have compatible, stable versions.

### Vue CLI

<a href="https://www.npmjs.com/package/@vue/cli" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/@vue/cli"></a>

As of v4.5.0, `vue-cli` now provides the built-in option to choose Vue 3 when creating a new project. You can upgrade `vue-cli` and run `vue create` to create a Vue 3 project today.

- [Documentation](https://cli.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-cli)

### Vue Router

<a href="https://www.npmjs.com/package/vue-router/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vue-router/next.svg"></a>

Vue Router 4.0 provides Vue 3 support and has a number of breaking changes of its own. Check out its [migration guide](https://next.router.vuejs.org/guide/migration/) for full details.

- [Documentation](https://next.router.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-router-next)
- [RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3Arouter)

### Vuex

<a href="https://www.npmjs.com/package/vuex/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vuex/next.svg"></a>

Vuex 4.0 provides Vue 3 support with largely the same API as 3.x. The only breaking change is [how the plugin is installed](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#breaking-changes).

- [Documentation](https://next.vuex.vuejs.org/)
- [GitHub](https://github.com/vuejs/vuex/tree/4.0)

### Devtools Extension

We are working on a new version of the Devtools with a new UI and refactored internals to support multiple Vue versions. The new version is currently in beta and only supports Vue 3 (for now). Vuex and Router integration is also work in progress.

- For Chrome: [Install from Chrome web store](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg?hl=en)

  - Note: the beta channel may conflict with the stable version of devtools so you may need to temporarily disable the stable version for the beta channel to work properly.

- For Firefox: [Download the signed extension](https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.20) (`.xpi` file under Assets)

### IDE Support

It is recommended to use [VSCode](https://code.visualstudio.com/) with our official extension [Volar](https://github.com/johnsoncodehk/volar), which provides comprehensive IDE support for Vue 3.

### Other Projects

| Project               | npm                           | Repo                 |
| --------------------- | ----------------------------- | -------------------- |
| @vue/babel-plugin-jsx | [![rc][jsx-badge]][jsx-npm]   | [[GitHub][jsx-code]] |
| eslint-plugin-vue     | [![ga][epv-badge]][epv-npm]   | [[GitHub][epv-code]] |
| @vue/test-utils       | [![beta][vtu-badge]][vtu-npm] | [[GitHub][vtu-code]] |
| vue-class-component   | [![beta][vcc-badge]][vcc-npm] | [[GitHub][vcc-code]] |
| vue-loader            | [![rc][vl-badge]][vl-npm]     | [[GitHub][vl-code]]  |
| rollup-plugin-vue     | [![beta][rpv-badge]][rpv-npm] | [[GitHub][rpv-code]] |

[jsx-badge]: https://img.shields.io/npm/v/@vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@vue/babel-plugin-jsx
[jsx-code]: https://github.com/vuejs/jsx-next
[vd-badge]: https://img.shields.io/npm/v/@vue/devtools/beta.svg
[vd-npm]: https://www.npmjs.com/package/@vue/devtools/v/beta
[vd-code]: https://github.com/vuejs/vue-devtools/tree/next
[epv-badge]: https://img.shields.io/npm/v/eslint-plugin-vue.svg
[epv-npm]: https://www.npmjs.com/package/eslint-plugin-vue
[epv-code]: https://github.com/vuejs/eslint-plugin-vue
[vtu-badge]: https://img.shields.io/npm/v/@vue/test-utils/next.svg
[vtu-npm]: https://www.npmjs.com/package/@vue/test-utils/v/next
[vtu-code]: https://github.com/vuejs/vue-test-utils-next
[jsx-badge]: https://img.shields.io/npm/v/@ant-design-vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@ant-design-vue/babel-plugin-jsx
[jsx-code]: https://github.com/vueComponent/jsx
[vcc-badge]: https://img.shields.io/npm/v/vue-class-component/next.svg
[vcc-npm]: https://www.npmjs.com/package/vue-class-component/v/next
[vcc-code]: https://github.com/vuejs/vue-class-component/tree/next
[vl-badge]: https://img.shields.io/npm/v/vue-loader/next.svg
[vl-npm]: https://www.npmjs.com/package/vue-loader/v/next
[vl-code]: https://github.com/vuejs/vue-loader/tree/next
[rpv-badge]: https://img.shields.io/npm/v/rollup-plugin-vue/next.svg
[rpv-npm]: https://www.npmjs.com/package/rollup-plugin-vue/v/next
[rpv-code]: https://github.com/vuejs/rollup-plugin-vue/tree/next

::: info
For additional information on Vue 3 compatibility with libraries and plugins, be sure to check out [this issue in awesome-vue](https://github.com/vuejs/awesome-vue/issues/3544).
:::
