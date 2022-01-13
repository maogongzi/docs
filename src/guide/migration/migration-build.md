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
| GLOBAL_MOUNT_CONTAINER                | ⨂    | La aplicación montada no reemplaza el elemento al que se monte           | [enlace](/guide/migration/mount-changes.html)                                                    |
| CONFIG_DEVTOOLS                       | ⨂    | La devtools de producción ahora es un indicador de tiempo de compilación | [enlace](https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags) |
| COMPILER_V_IF_V_FOR_PRECEDENCE        | ⨂    | La precedencia de `v-if` y `v-for` se ha cambiado cuando se utilizan en el mismo elemento | [enlace](/guide/migration/v-if-v-for.html)                                      |
| COMPILER_V_IF_SAME_KEY                | ⨂    | Las ramas de `v-if` ya no pueden tenel el mismo _key_                    | [enlace](/guide/migration/key-attribute.html#on-conditional-branches)                            |
| COMPILER_V_FOR_TEMPLATE_KEY_PLACEMENT | ⨂    | La _key_ en `<template v-for>` ahora debe ser puesto en `<template>`     | [enlace](/guide/migration/key-attribute.html#with-template-v-for)                                |
| COMPILER_SFC_FUNCTIONAL               | ⨂    | `<template functional>` ya no se soporta en SFCs                         | [enlace](/guide/migration/functional-components.html#single-file-components-sfcs)                |

### Parcialmente Compatible con Advertencias

| ID                       | Tipo | Descripción                                                                                                                                                                                | Documentación                                                                                                          |
| ------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| CONFIG_IGNORED_ELEMENTS  | ◐    | `config.ignoredElements` ahora es `config.compilerOptions.isCustomElement` (solo en la compilación que contiene compilador para el navegador). Si se utiliza paso de compilación, se debe pasar `isCustomElement`  mediante la configuración de compilación. | [enlace](/guide/migration/global-api.html#config-ignoredelements-is-now-config-compileroptions-iscustomelement) |
| COMPILER_INLINE_TEMPLATE | ◐    | `inline-template` se ha eliminado (_compat_ solo es soportado en la compilación que contiene compilador para el navegador)                                                                                                                | [enlace](/guide/migration/inline-template-attribute.html)                                                       |
| PROPS_DEFAULT_THIS       | ◐    | La factoría _default_ de _props_ ya no tiene acceso a `this` (en modo compat, `this` no es una instancia real, solo expone _props_, `$options` y inyecciones)                                   | [enlace](/guide/migration/props-default-this.html)                                                              |
| INSTANCE_DESTROY         | ◐    | El método de instancia `$destroy` se ha eliminado (en modo compat, solo es soportado en la instancia raíz)                                                                                                       |                                                                                                               |
| GLOBAL_PRIVATE_UTIL      | ◐    | `Vue.util` es privado y ya no es disponible                                                                                                                                              |                                                                                                               |
| CONFIG_PRODUCTION_TIP    | ◐    | `config.productionTip` ya no es necesario                                                                                                                                                 | [enlace](/guide/migration/global-api.html#config-productiontip-removed)                                         |
| CONFIG_SILENT            | ◐    | `config.silent` se ha eliminado                                                                                                                                                                    |                                                                                                               |

### Solo _compat_ (no advertencias)

| ID                 | Tipo | Descripción                            | Documentación                                     |
| ------------------ | ---- | -------------------------------------- | ---------------------------------------- |
| TRANSITION_CLASSES | ⭘    | Se han cambiado clases de entrada/salida de transición | [enlace](/guide/migration/transition.html) |

### Compatible Completamente

| ID                           | Tipo | Descripción                                                           | Documentación                                                                                       |
| ---------------------------- | ---- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| GLOBAL_MOUNT                 | ✔    | new Vue() -> createApp                                                | [enlace](/guide/migration/global-api.html#mounting-app-instance)                             |
| GLOBAL_EXTEND                | ✔    | Vue.extend se ha eliminado (utiliza `defineComponent` u opción `extends`)        | [enlace](/guide/migration/global-api.html#vue-extend-removed)                                |
| GLOBAL_PROTOTYPE             | ✔    | `Vue.prototype` -> `app.config.globalProperties`                      | [enlace](/guide/migration/global-api.html#vue-prototype-replaced-by-config-globalproperties) |
| GLOBAL_SET                   | ✔    | `Vue.set` se ha eliminado (ya no es necesario)                                  |                                                                                            |
| GLOBAL_DELETE                | ✔    | `Vue.delete` se ha eliminado (ya no es necesario)                               |                                                                                            |
| GLOBAL_OBSERVABLE            | ✔    | `Vue.observable` se ha eliminado (use `reactive`)                             | [enlace](/api/basic-reactivity.html)                                                         |
| CONFIG_KEY_CODES             | ✔    | config.keyCodes se ha eliminado                                               | [enlace](/guide/migration/keycode-modifiers.html)                                            |
| CONFIG_WHITESPACE            | ✔    | En Vue 3 se utiliza `"condense"` por defecto para espacio blanco                           |                                                                                            |
| INSTANCE_SET                 | ✔    | `vm.$set` se ha eliminado (ya no es necesario)                                  |                                                                                            |
| INSTANCE_DELETE              | ✔    | `vm.$delete` se ha eliminado (ya no es necesario)                               |                                                                                            |
| INSTANCE_EVENT_EMITTER       | ✔    | `vm.$on`, `vm.$off`, `vm.$once` se han eliminado                               | [enlace](/guide/migration/events-api.html)                                                   |
| INSTANCE_EVENT_HOOKS         | ✔    | Las instancias ya no emiten eventos `hook:x`                              | [enlace](/guide/migration/vnode-lifecycle-events.html)                                       |
| INSTANCE_CHILDREN            | ✔    | `vm.$children` se ha eliminado                                                | [enlace](/guide/migration/children.html)                                                     |
| INSTANCE_LISTENERS           | ✔    | `vm.$listeners` se ha eliminado                                               | [enlace](/guide/migration/listeners-removed.html)                                            |
| INSTANCE_SCOPED_SLOTS        | ✔    | `vm.$scopedSlots` se ha eliminado; `vm.$slots` ahora expone funciones          | [enlace](/guide/migration/slots-unification.html)                                            |
| INSTANCE_ATTRS_CLASS_STYLE   | ✔    | `$attrs` ahora incluye `class` y `style`                             | [enlace](/guide/migration/attrs-includes-class-style.html)                                   |
| OPTIONS_DATA_FN              | ✔    | `data` debe ser una función en todos casos                                | [enlace](/guide/migration/data-option.html)                                                  |
| OPTIONS_DATA_MERGE           | ✔    | `data` de mixin o extención ahora son fusionados superficialmente                 | [enlace](/guide/migration/data-option.html)                                                  |
| OPTIONS_BEFORE_DESTROY       | ✔    | `beforeDestroy` -> `beforeUnmount`                                    |                                                                                            |
| OPTIONS_DESTROYED            | ✔    | `destroyed` -> `unmounted`                                            |                                                                                            |
| WATCH_ARRAY                  | ✔    | Observar una matriz ya no dispara en mutación, salvo que se especifica "deep"          | [enlace](/guide/migration/watch.html)                                                        |
| V_FOR_REF                    | ✔    | `ref` dentro de `v-for` ya no registran una matriz de _refs_                | [enlace](/guide/migration/array-refs.html)                                                   |
| V_ON_KEYCODE_MODIFIER        | ✔    | `v-on` ya no soporta modificadores de keyCode                           | [enlace](/guide/migration/keycode-modifiers.html)                                            |
| CUSTOM_DIR                   | ✔    | Nombres de hooks de directivas personalizadas se han cambiado                                   | [enlace](/guide/migration/custom-directives.html)                                            |
| ATTR_FALSE_VALUE             | ✔    | Ya no elimina el atributo si su valor vinculado es booleano `false`       | [enlace](/guide/migration/attribute-coercion.html)                                           |
| ATTR_ENUMERATED_COERCION     | ✔    | Ya no trata los atributos enumerados como casos especiales                          | [enlace](/guide/migration/attribute-coercion.html)                                           |
| TRANSITION_GROUP_ROOT        | ✔    | `<transition-group>` ya no renderiza un elemento raíz por defecto      | [enlace](/guide/migration/transition-group.html)                                             |
| COMPONENT_ASYNC              | ✔    | Se ha cambiado la API de componente asíncrono (ahora se requiere `defineAsyncComponent`)     | [enlace](/guide/migration/async-components.html)                                             |
| COMPONENT_FUNCTIONAL         | ✔    | Se ha cambiado la API de componente funcional (ahora deben ser funciones planos)        | [enlace](/guide/migration/functional-components.html)                                        |
| COMPONENT_V_MODEL            | ✔    | Se ha rehecho la v-model de componentes                                            | [enlace](/guide/migration/v-model.html)                                                      |
| RENDER_FUNCTION              | ✔    | Se ha cambiado la API de función render                                           | [enlace](/guide/migration/render-function-api.html)                                          |
| FILTERS                      | ✔    | Se han eliminado los filtros (esta opción solo afecta APIs de filtro en tiempo de ejecución)        | [enlace](/guide/migration/filters.html)                                                      |
| COMPILER_IS_ON_ELEMENT       | ✔    | El uso de `is` ahora se ha limitado a `<component>` solamente                    | [enlace](/guide/migration/custom-elements-interop.html)                                      |
| COMPILER_V_BIND_SYNC         | ✔    | `v-bind.sync` es reemplazado por `v-model` con argumentos                    | [enlace](/guide/migration/v-model.html)                                                      |
| COMPILER_V_BIND_PROP         | ✔    | El modificador `v-bind.prop` es eliminado                                        |                                                                                            |
| COMPILER_V_BIND_OBJECT_ORDER | ✔    | `v-bind="object"` ahora es sensitivo al orden                              | [enlace](/guide/migration/v-bind.html)                                                       |
| COMPILER_V_ON_NATIVE         | ✔    | El modificador `v-on.native` es eliminado                                        | [enlace](/guide/migration/v-on-native-modifier-removed.html)                                 |
| COMPILER_V_FOR_REF           | ✔    | `ref` en `v-for` (soporte de compilador)                                   |                                                                                            |
| COMPILER_NATIVE_TEMPLATE     | ✔    | `<template>` sin directivas especiales ahora se renderiza como elemento nativo |                                                                                            |
| COMPILER_FILTERS             | ✔    | filtros (soporte de compilador)                                            |                                                                                            |
