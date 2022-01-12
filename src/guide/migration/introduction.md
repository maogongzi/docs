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

- La opción de ciclo de vida `destroyed` se ha renombrado a `unmounted`
- La opción de ciclo de vida `beforeDestroy` se ha renombrado a `beforeUnmount`
- [La función de factoría de _props_ `default` ya no tiene acceso al contexto `this`](/guide/migration/props-default-this.html)
- [Se ha cambiado la API de directiva personalizada para alinearse con ciclo de vida de componentes y se ha eliminado `binding.expression`](/guide/migration/custom-directives.html)
- [La opción `data` siempre debe ser declarada como una función](/guide/migration/data-option.html)
- [La opción `data` de los _mixines_ ahora se fusionan superficialmente (shallowly)](/guide/migration/data-option.html#mixin-merge-behavior-change)
- [Se ha cambiado la estrategia de coación de atributos](/guide/migration/attribute-coercion.html)
- [Se han renombrado unas clases de transición](/guide/migration/transition.html)
- [`<TransitionGroup>` ahora no renderiza elemento de envoltorio por defecto](/guide/migration/transition-group.html)
- [Al observar una matriz, el callback solo será disparado cuando la matriz sea reemplazada. Si necesita dispararlo en mutación, debe especificar la opción `deep`.](/guide/migration/watch.html)
- Las etiquetas `<template>` sin ninguna directiva especial (`v-if/else-if/else`, `v-for`, o `v-slot`) ahora son tratadas como elementos planos y resultarán en un elemento nativo `<template>` en vez de renderizar el contenido interior de sí mísmo.
- [Una aplicación montada no reemplaza el elemento al cual está montado](/guide/migration/mount-changes.html)
- [Los eventos de ciclo de vida prefijados con `hook:` ahora utilizan el prefijo `vnode-`](/guide/migration/vnode-lifecycle-events.html)

### APIs eliminados

- [`keyCode` como modificadores de `v-on`](/guide/migration/keycode-modifiers.html)
- [métodos de instancias $on, $off and \$once](/guide/migration/events-api.html)
- [Filtros](/guide/migration/filters.html)
- [Atributos de plantillas en líneas](/guide/migration/inline-template-attribute.html)
- [La propiedad de instancia `$children`](/guide/migration/children.html)
- [La opción `propsData`](/guide/migration/props-data.html)
- El método de instancia `$destroy`. Los usuarios ya no deberían manejar el ciclo de vida de componentes Vue individuales manualmente.
- Las funciones globales `set` y `delete`, y los métodos de instancias `$set` y `$delete`. Ya no son requeridos con la detección de cambios basado de _proxy_.

## Librerías de Soporte

Todas las liberías y herramientas oficiales nuestras ahora soportan Vue 3, pero algunos de ellas son todavía en fase _beta_ o versión candidata. Puede encontrar detalles para las librerías individuales abajo. La mayoría ahora son distribuidas utilizando la etiqueta de distribución `next` en _npm_. Intentamos cambiar a `latest` una vez que todas las librerías oficiales sean versiones compatibles y estables.

### Vue CLI

<a href="https://www.npmjs.com/package/@vue/cli" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/@vue/cli"></a>

Desde v4.5.0, `vue-cli` ahora provee la opción integrada para elegir Vue 3 cuando se cree un nuevo proyecto. Hoy puede actualizar `vue-cli` y ejecutar `vue create` para crear un proyecto de Vue 3.

- [Documentación](https://cli.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-cli)

### Vue Router

<a href="https://www.npmjs.com/package/vue-router/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vue-router/next.svg"></a>

Vue Router 4.0 provee soporte para Vue 3 y tiene un número de cambios rotundos propios. Echa una vistazo a su [guía de migración](https://next.router.vuejs.org/guide/migration/) para más detalles.

- [Documentación](https://next.router.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-router-next)
- [RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3Arouter)

### Vuex

<a href="https://www.npmjs.com/package/vuex/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vuex/next.svg"></a>

Vuex 4.0 provee soporte para Vue 3 con la misma API como 3.x en gran medida. El sólo cambio rotundo es [cómo se instala el plugin](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#breaking-changes).

- [Documentación](https://next.vuex.vuejs.org/)
- [GitHub](https://github.com/vuejs/vuex/tree/4.0)

### Extenciones para Devtools

Estamos trabajando sobre una nueva versión de Devtools con una nueva interfaz de usuario y las internales refactorizadas para soportar múltiples versiones de Vue. Actualmente la nueva versión es en fase _beta_ y solo soporta Vue 3 (para ahora). La integración entre Vuex y Router es también trabajo en proceso.

- Para Chrome: [Instalarlo desde Chrome web store](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg?hl=en)

  - Note: el canal beta podría tener conflictos con la versión estable de devtools, por lo tanto, podría necesitar temporalmente deshablitar la versión estable para que se funcione bien el canal beta.

- Para Firefox: [Descargar la extención firmada](https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.20) (archivo `.xpi` en _Assets_)

### Soporte de IDE

Es recomendado utilizar [VSCode](https://code.visualstudio.com/) con nuestra extención oficial [Volar](https://github.com/johnsoncodehk/volar), que provee soporte de IDE comprehensivo para Vue 3.

### Otros Proyectos

| Proyecto               | npm                           | Repo                |
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
Para información adicional sobre la compatibilidad de Vue 3 con librerías y plugins, asegúrese de echar una vistazo a [este problema en awesome-vue](https://github.com/vuejs/awesome-vue/issues/3544).
:::
