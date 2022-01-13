# Compilación para Migración

## Visión General

`@vue/compat` (también conocido como "la compilación para migración") es una compilación de Vue 3 que provea comportamientos configurables compatibles con Vue.

La compilación para migración ejecuta en modo de Vue 2 por defecto, la mayor parte de las APIs públicas se comportan exactamente lo mismo como Vue 2, con solo unas excepciones. Los usos de características que han cambiado o sido deprecados en Vue 3 resultarán advertencias en tiempo de ejecución. La compatibilidad de una característica puede también ser habilitado/deshabilitado sobre una base de por cada componente.

### Casos de usuario destinados

- Actualizar una aplicación de Vue 2 a Vue 3 (con [limitaciones](#known-limitations))
- Migrar una librería para soportar Vue 3
- Para los desarrolladores experimentados de Vue 2 que no han probado Vue 3 todavía, la compilación de migración puede ser utilizada en lugar de Vue 3 para ayudar a aprender la diferencia entre las versiones.

### Limitaciones Conocidas

Mientras nos hemos esforzado mucho para hacer que la compilación de migración pueda imitar el comportamiento de Vue 2 lo más posible, hay unas limitaciones que puedan prevenir su aplicación de ser elegible para actualización:

- Dependencias que dependen de las APIs internales de Vue 2 o los comportamientos no documentados. Lo más común caso es el uso de propiedades privadas en `VNodes`. Si su proyecto depende de librerías de componentes como [Vuetify](https://vuetifyjs.com/en/), [Quasar](https://quasar.dev/) u [ElementUI](https://element.eleme.io/#/en-US), lo mejor es esperar su versión compatible con Vue 3.

- El soporte para Internet Explorer 11: [Vu3 ha abandonado oficialmente el plan de soportar IE11](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md). Si todavía necesita soporte para IE11 o bajo, debería quedarse con Vue 2.

- Renderización en el lado del servidor: la compilación de migración puede ser utilizada para SSR, pero se involucra mucho más trabajo para migrar una configuración personalizada de SSR. La idea general es reemplazar `vue-server-renderer` por [`@vue/server-renderer`](https://github.com/vuejs/vue-next/tree/master/packages/server-renderer). Vue 3 ya no provee un renderizador de compilación y es recomendado utilizar Vue 3 SSR con [Vite](https://vitejs.dev/guide/ssr.html). Si está utilizando [Nuxt.js](https://nuxtjs.org/), puede probar [Nuxt Bridge, una capa de compatibilidad entre Nuxt.js 2 y 3](https://v3.nuxtjs.org/getting-started/bridge/). Para proyectos complejos y de producción, es probablemente mejor esperar [Nuxt 3 (ahora en fase beta)](https://v3.nuxtjs.org/getting-started/introduction).

### Expectativas

Por favor tenga en cuenta que la compilación de migración apunta a abarcar solo las APIs y comportamientos de Vue 2 documentadas públicamente. Si su aplicación deja de ejecutar bajo la compilación de migración debido a dependencia de comportamientos que no son documentados, es poco probable que ajustemos la  compilación de migración para satisfacer su caso específico. Considera refactorizarla y quitar la dependencia del comportamiento en cuestión en su lugar.

Una palabra de precaución: Si su aplicación es grande y compleja, la migración podría ser un desafío incluso con la compilación de migración. Si por desgracia su aplicación no es capaz de actualizar, note que estamos planeando de adaptar la API de composition y unas otras características de Vue 3 a la versión 2.7 (estimado en tarde Q3 2021)

Si realiza que su aplicación funcione en la compilación de migración, **puede** aplicarla en producción antes de que se complete la migración. Si bien hay un poco de sobrecarga de rendimiento/tamaño, no podría afectar notablemente la experiencia de usuario de producción. Tendría que hacerlo cuando tiene dependencias que dependen de comportamientos de Vue 2, y no pueden ser actualizadas/reemplazadas.

La compilación de migración será proporcionada partiendo de 3.1, y será publicada continualmente junto a la línea de publicación de 3.2. Planeamos de eventualmente dejar de publicar la compilación de migración en una versión minor del futuro (no antes del fin de 2021), así que debería todavía apuntar a cambiar a la compilación estándar antes de esa fecha.

## Flujo de trabajo de actualización

El siguiente flujo de trabajo pasea por los pasos de migrar una aplicación actual de Vue 2 (Vue HackerNews 2.0) a Vue 3. Los _commits_ completos pueden encontrarse [aquí](https://github.com/vuejs/vue-hackernews-2.0/compare/migration). Note que los pasos actuales requeridos para su proyecto pueden variar, y estos pasos deberían tratarse como orientación general en vez de instrucciones estrictos.

### Preparaciones

- Si todavía está utilizando [la sintaxis obsoleta de slot nombrado / con alcance](https://vuejs.org/v2/guide/components-slots.html#Deprecated-Syntax), actualízala a la sintaxis última primero (lo que ya es soportada en 2.6).

### Instalación

1. Actualizar las herramientas si es aplicable.

   - Si se utiliza configuración personalizada de webpack: actualiza `vue-loader` a `^16.0.0`.
   - Si se utiliza `vue-cli`: actualiza `@vue/cli-service` hasta la última versión con `vue upgrade`
   - (Alternativo) migrar a [Vite](https://vitejs.dev/) + [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2).  [[commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/565b948919eb58f22a32afca7e321b490cb3b074)]

2. En `package.json`, actualiza `vue` a 3.1, instala `@vue/compat` de la misma versión, y reemplaza `vue-template-compiler` (si existe) por `@vue/compiler-sfc`:

   ```diff
   "dependencies": {
   -  "vue": "^2.6.12",
   +  "vue": "^3.1.0",
   +  "@vue/compat": "^3.1.0"
      ...
   },
   "devDependencies": {
   -  "vue-template-compiler": "^2.6.12"
   +  "@vue/compiler-sfc": "^3.1.0"
   }
   ```

   [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/14f6f1879b43f8610add60342661bf915f5c4b20)

3. En la configuración de compilación, aplica alias `vue` a `@vue/compat` y habilita el modo compat mediante opciones de compilador de Vue.

   **Configuración Ejemplo**

   <details>
     <summary><b>vue-cli</b></summary>

   ```js
   // vue.config.js
   module.exports = {
     chainWebpack: config => {
       config.resolve.alias.set('vue', '@vue/compat')

       config.module
         .rule('vue')
         .use('vue-loader')
         .tap(options => {
           return {
             ...options,
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         })
     }
   }
   ```

   </details>

   <details>
     <summary><b>webpack plano</b></summary>

   ```js
   // webpack.config.js
   module.exports = {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     module: {
       rules: [
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         }
       ]
     }
   }
   ```

   </details>

   <details>
     <summary><b>Vite</b></summary>

   ```js
   // vite.config.js
   export default {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     plugins: [
       vue({
         template: {
           compilerOptions: {
             compatConfig: {
               MODE: 2
             }
           }
         }
       })
     ]
   }
   ```

   </details>

4. Si está utilizando TypeScript, también necesita modificar los tipos de `vue` para exponer la exportación por defecto (lo que ya no existe en Vue 3) mediante agregar un archivo `*.d.ts` con el siguiente:

   ```ts
   declare module 'vue' {
     import { CompatVue } from '@vue/runtime-dom'
     const Vue: CompatVue
     export default Vue
     export * from '@vue/runtime-dom'
   }
   ```

5. E este momento, su aplicación podría encontrar unos errores / advertencias de tiempo de compilación (p. ej. el uso de filtros). Corrígelos primero. Si todas advertencias de compilador son eliminadas, puede también establecer el compilador al modo Vue 3.

   [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/b05d9555f6e115dea7016d7e5a1a80e8f825be52)

6. Después de corregir los errores, la aplicación debería ser capaz de ejecutarse si no está sujeto a las [limitaciones](#known-limitations) mencionadas arriba.

   Es probable que vea MUCHAS advertencias de tanto la línea de comandos como la consola del navegador. Aquí son algunos consejos generales:

   - Puede filtrar por advertencias específicas en la consola del navegador. Es un buen idea utilizar el filtro y enfocarse en corregir una cosa cada vez. Puede también utilizar filtros negados (negated filters) como `-GLOBAL_MOUNT`.

   - Puede reprimir deprecaciones específicas mediante [configuración de compat](#compat-configuration).

   - Algunas advertencias pueden ser causadas por una dependencia que utiliza (p. ej. `vue-router`). Puede verificar este del seguimiento de componente o seguimiento de pila de la advertencia (expandido al hacer clic). Enfóquese en corregir las advertencias que provienen de su propio código primero.

   - Si está utilizando `vue-router`, note que `<transition>` y `<keep-alive>` no funcionarán con `<router-view>` hasta que actualice `vue-router` a versión v4.

7. Actualizar [nombres de clases de `<transition>`](/guide/migration/transition.html). Este es la sóla característica que no tiene una advertencia de tiempo de ejecución. Puede hacer una búsqueda en su proyecto por nombres de clases de CSS `.*-enter` and `.*-leave`.

   [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/d300103ba622ae26ac26a82cd688e0f70b6c1d8f)

8. Actualizar la entrada de aplicación para utilizar [la nueva API global de montaje](/guide/migration/global-api.html#a-new-global-api-createapp).

   [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/a6e0c9ac7b1f4131908a4b1e43641f608593f714)

9. [Actualizar `vuex` a versión v4](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html).

   [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/5bfd4c61ee50f358cd5daebaa584f2c3f91e0205)

10. [Actualizar `vue-router` a versión v4](https://next.router.vuejs.org/guide/migration/index.html). Si también está utilizando `vuex-router-sync`, puede reemplazarlo con un captador de almacenamiento.

    Después de la actualización, se requiere utilizar la nueva [sintaxis basada de scoped-slot](https://next.router.vuejs.org/guide/migration/index.html#router-view-keep-alive-and-transition) para utilizar `<transition>` y `<keep-alive>` con `<router-view>`.

    [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/758961e73ac4089890079d4ce14996741cf9344b)

11. Eliminar advertencias individuales. Note que algunas características tienen comportamiento conflicto entre Vue 2 y Vue 3, por ejemplo, la API de función render, o el cambio de componentes funcionales versus componentes asíncronos. Para migrar a la API de Vue 3 sin afectar el resto de la aplicación, puede optar por comportamientos de Vue 3 sobre una base de por componente con la [opción `compatConfig`](#per-component-config).

    [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/d0c7d3ae789be71b8fd56ce79cb4cb1f921f893b)

12. Cuando todas las advertencias son corregidas, puede eliminar la compilación de migración y cambiar a la propia versión de Vue 3. Note que no podría hacer esto si todavía tenga dependencias que dependen de comportamientos de Vue 2.

    [commit ejemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/9beb45490bc5f938c9e87b4ac1357cfb799565bd)

## Configuración de Compat

### Configuración Global

Las características de _compat_ pueden ser deshabilitadas individualmente:

```js
import { configureCompat } from 'vue'

// deshabilitar compat para ciertas características
configureCompat({
  FEATURE_ID_A: false,
  FEATURE_ID_B: false
})
```

Alternativamente, la entera aplicación puede elegir el comportamiento de Vue 3 por defecto, con solo ciertas características de _compat_ habilitadas:

```js
import { configureCompat } from 'vue'

// Elige el comportamiento de Vue 3 por defecto para todos, y solo habilita
// compat para ciertas características
configureCompat({
  MODE: 3,
  FEATURE_ID_A: true,
  FEATURE_ID_B: true
})
```

### Configuración per componente

Un componente puede utilizar la opción `compatConfig`, lo que espera las mismas opciones como el método global `configureCompat`:

```js
export default {
  compatConfig: {
    MODE: 3, // optar por comportamiento de Vue 3 para solo este componente
    FEATURE_ID_A: true // las características también pueden alternarse al nivel de componente
  }
  // ...
}
```

### Configuración específicas para el compilador

Las características que empiezan con `COMPILER_` son específicas para el compilador: si está utilizando la compilación completa (con compilador en navegador), pueden ser configuradas en tiempo de ejecución. Sin embargo, si se utiliza un paso de compilación, deben ser configuradas mediante la opción `compilerOptions` en la configuración de compilación en su lugar (vea los ejemplos de configuraciones arriba).

## Referencia de Características

### Tipos de Compatibilidad

- ✔ compatible completamente
- ◐ paracialmente compatible con advertencias
- ⨂ incompatible (solo advertencias)
- ⭘ solo _compat_ (no hay advertencias)

### Incompatible

> debe ser corregidas por adelantado o será probable resultar en errores

| ID                                    | Tipo | Descripción                                                              | Documentación                                                                                  |
| ------------------------------------- | ---- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| GLOBAL_MOUNT_CONTAINER                | ⨂    | La aplicación montada no reemplaza el elemento al que se monte           | [link](/guide/migration/mount-changes.html)                                                    |
| CONFIG_DEVTOOLS                       | ⨂    | La devtools de producción ahora es un indicador de tiempo de compilación | [link](https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags) |
| COMPILER_V_IF_V_FOR_PRECEDENCE        | ⨂    | La precedencia de `v-if` y `v-for` se ha cambiado cuando se utilizan en el mismo elemento | [link](/guide/migration/v-if-v-for.html)                                      |
| COMPILER_V_IF_SAME_KEY                | ⨂    | Las ramas de `v-if` ya no pueden tenel el mismo _key_                    | [link](/guide/migration/key-attribute.html#on-conditional-branches)                            |
| COMPILER_V_FOR_TEMPLATE_KEY_PLACEMENT | ⨂    | La _key_ en `<template v-for>` ahora debe ser puesto en `<template>`     | [link](/guide/migration/key-attribute.html#with-template-v-for)                                |
| COMPILER_SFC_FUNCTIONAL               | ⨂    | `<template functional>` ya no se soporta en SFCs                         | [link](/guide/migration/functional-components.html#single-file-components-sfcs)                |

### Partially Compatible with Caveats

| ID                       | Tipo | Descripción                                                                                                                                                                                | Documentación                                                                                                          |
| ------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| CONFIG_IGNORED_ELEMENTS  | ◐    | `config.ignoredElements` is now `config.compilerOptions.isCustomElement` (only in browser compiler build). If using build setup, `isCustomElement` must be passed via build configuration. | [link](/guide/migration/global-api.html#config-ignoredelements-is-now-config-compileroptions-iscustomelement) |
| COMPILER_INLINE_TEMPLATE | ◐    | `inline-template` removed (compat only supported in browser compiler build)                                                                                                                | [link](/guide/migration/inline-template-attribute.html)                                                       |
| PROPS_DEFAULT_THIS       | ◐    | props default factory no longer have access to `this` (in compat mode, `this` is not a real instance - it only exposes props, `$options` and injections)                                   | [link](/guide/migration/props-default-this.html)                                                              |
| INSTANCE_DESTROY         | ◐    | `$destroy` instance method removed (in compat mode, only supported on root instance)                                                                                                       |                                                                                                               |
| GLOBAL_PRIVATE_UTIL      | ◐    | `Vue.util` is private and no longer available                                                                                                                                              |                                                                                                               |
| CONFIG_PRODUCTION_TIP    | ◐    | `config.productionTip` no longer necessary                                                                                                                                                 | [link](/guide/migration/global-api.html#config-productiontip-removed)                                         |
| CONFIG_SILENT            | ◐    | `config.silent` removed                                                                                                                                                                    |                                                                                                               |

### Compat only (no warning)

| ID                 | Tipo | Descripción                            | Documentación                                     |
| ------------------ | ---- | -------------------------------------- | ---------------------------------------- |
| TRANSITION_CLASSES | ⭘    | Transition enter/leave classes changed | [link](/guide/migration/transition.html) |

### Fully Compatible

| ID                           | Tipo | Descripción                                                           | Documentación                                                                                       |
| ---------------------------- | ---- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| GLOBAL_MOUNT                 | ✔    | new Vue() -> createApp                                                | [link](/guide/migration/global-api.html#mounting-app-instance)                             |
| GLOBAL_EXTEND                | ✔    | Vue.extend removed (use `defineComponent` or `extends` option)        | [link](/guide/migration/global-api.html#vue-extend-removed)                                |
| GLOBAL_PROTOTYPE             | ✔    | `Vue.prototype` -> `app.config.globalProperties`                      | [link](/guide/migration/global-api.html#vue-prototype-replaced-by-config-globalproperties) |
| GLOBAL_SET                   | ✔    | `Vue.set` removed (no longer needed)                                  |                                                                                            |
| GLOBAL_DELETE                | ✔    | `Vue.delete` removed (no longer needed)                               |                                                                                            |
| GLOBAL_OBSERVABLE            | ✔    | `Vue.observable` removed (use `reactive`)                             | [link](/api/basic-reactivity.html)                                                         |
| CONFIG_KEY_CODES             | ✔    | config.keyCodes removed                                               | [link](/guide/migration/keycode-modifiers.html)                                            |
| CONFIG_WHITESPACE            | ✔    | In Vue 3 whitespace defaults to `"condense"`                          |                                                                                            |
| INSTANCE_SET                 | ✔    | `vm.$set` removed (no longer needed)                                  |                                                                                            |
| INSTANCE_DELETE              | ✔    | `vm.$delete` removed (no longer needed)                               |                                                                                            |
| INSTANCE_EVENT_EMITTER       | ✔    | `vm.$on`, `vm.$off`, `vm.$once` removed                               | [link](/guide/migration/events-api.html)                                                   |
| INSTANCE_EVENT_HOOKS         | ✔    | Instance no longer emits `hook:x` events                              | [link](/guide/migration/vnode-lifecycle-events.html)                                       |
| INSTANCE_CHILDREN            | ✔    | `vm.$children` removed                                                | [link](/guide/migration/children.html)                                                     |
| INSTANCE_LISTENERS           | ✔    | `vm.$listeners` removed                                               | [link](/guide/migration/listeners-removed.html)                                            |
| INSTANCE_SCOPED_SLOTS        | ✔    | `vm.$scopedSlots` removed; `vm.$slots` now exposes functions          | [link](/guide/migration/slots-unification.html)                                            |
| INSTANCE_ATTRS_CLASS_STYLE   | ✔    | `$attrs` now includes `class` and `style`                             | [link](/guide/migration/attrs-includes-class-style.html)                                   |
| OPTIONS_DATA_FN              | ✔    | `data` must be a function in all cases                                | [link](/guide/migration/data-option.html)                                                  |
| OPTIONS_DATA_MERGE           | ✔    | `data` from mixin or extension is now shallow merged                  | [link](/guide/migration/data-option.html)                                                  |
| OPTIONS_BEFORE_DESTROY       | ✔    | `beforeDestroy` -> `beforeUnmount`                                    |                                                                                            |
| OPTIONS_DESTROYED            | ✔    | `destroyed` -> `unmounted`                                            |                                                                                            |
| WATCH_ARRAY                  | ✔    | watching an array no longer triggers on mutation unless deep          | [link](/guide/migration/watch.html)                                                        |
| V_FOR_REF                    | ✔    | `ref` inside `v-for` no longer registers array of refs                | [link](/guide/migration/array-refs.html)                                                   |
| V_ON_KEYCODE_MODIFIER        | ✔    | `v-on` no longer supports keyCode modifiers                           | [link](/guide/migration/keycode-modifiers.html)                                            |
| CUSTOM_DIR                   | ✔    | Custom directive hook names changed                                   | [link](/guide/migration/custom-directives.html)                                            |
| ATTR_FALSE_VALUE             | ✔    | No longer removes attribute if binding value is boolean `false`       | [link](/guide/migration/attribute-coercion.html)                                           |
| ATTR_ENUMERATED_COERCION     | ✔    | No longer special case enumerated attributes                          | [link](/guide/migration/attribute-coercion.html)                                           |
| TRANSITION_GROUP_ROOT        | ✔    | `<transition-group>` no longer renders a root element by default      | [link](/guide/migration/transition-group.html)                                             |
| COMPONENT_ASYNC              | ✔    | Async component API changed (now requires `defineAsyncComponent`)     | [link](/guide/migration/async-components.html)                                             |
| COMPONENT_FUNCTIONAL         | ✔    | Functional component API changed (now must be plain functions)        | [link](/guide/migration/functional-components.html)                                        |
| COMPONENT_V_MODEL            | ✔    | Component v-model reworked                                            | [link](/guide/migration/v-model.html)                                                      |
| RENDER_FUNCTION              | ✔    | Render function API changed                                           | [link](/guide/migration/render-function-api.html)                                          |
| FILTERS                      | ✔    | Filters removed (this option affects only runtime filter APIs)        | [link](/guide/migration/filters.html)                                                      |
| COMPILER_IS_ON_ELEMENT       | ✔    | `is` usage is now restricted to `<component>` only                    | [link](/guide/migration/custom-elements-interop.html)                                      |
| COMPILER_V_BIND_SYNC         | ✔    | `v-bind.sync` replaced by `v-model` with arguments                    | [link](/guide/migration/v-model.html)                                                      |
| COMPILER_V_BIND_PROP         | ✔    | `v-bind.prop` modifier removed                                        |                                                                                            |
| COMPILER_V_BIND_OBJECT_ORDER | ✔    | `v-bind="object"` is now order sensitive                              | [link](/guide/migration/v-bind.html)                                                       |
| COMPILER_V_ON_NATIVE         | ✔    | `v-on.native` modifier removed                                        | [link](/guide/migration/v-on-native-modifier-removed.html)                                 |
| COMPILER_V_FOR_REF           | ✔    | `ref` in `v-for` (compiler support)                                   |                                                                                            |
| COMPILER_NATIVE_TEMPLATE     | ✔    | `<template>` with no special directives now renders as native element |                                                                                            |
| COMPILER_FILTERS             | ✔    | filters (compiler support)                                            |                                                                                            |
