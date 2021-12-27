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

- Un solo archivo `*.vue` puede contener múltiples etiquetas `<style>`.

- Una etiqueta `<style>` puede tener atributos `scoped` o `module` (vea [características de estilos de sfc](/api/sfc-style) para más detalles) para ayudar a encapsular los estilos al componente actual. Múltiples etiquetas `<style>` con diferentes modos de encapsulación se pueden mezclar en el mismo componente.

### Bloques Personalizados

Se pueden incluir bloques personalizados adicionales en un archivo `*.vue` para cualquiera necesidad específica para el proyecto, por ejemplo un bloque `<docs>`. Algunos ejemplos de bloques personalizados del mundo real incluyen:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

El manejamiento de bloques personalizados dependerá de las herramientas, si quiere construir sus propios integraciones de bloques personalizados, vea [herramienta de sfc](/api/sfc-tooling.html#custom-blocks-integration) para más detalles.

## Inferencia de `name` Automática

Un SFC automáticamente infiere el nombre del componente de su **nombre de archivo (filename)** en los siguientes casos:

- El formateo de advertencias de desarrollo (Dev warning formatting)
- La inspección de DevTools (DevTools inspection)
- La autorreferencia recursiva. P. ej. un archivo llamado `FooBar.vue` puede referirse como `<FooBar/>` en su plantilla. Este tiene menor prioridad que components registrados/importados explícitamente.

## Preprocesadores (Pre-Processors)

Los bloques pueden declarar lenguajes de preprocesadores utilizando el atributo `lang`. La más común caso es utilizar TypeScript para el bloque `<script>`:

```html
<script lang="ts">
  // utilizar TypeScript
</script>
```

`lang` puede ser aplicado a cualquier bloque, por ejemplo podemos utilizar `<style>` con [SASS](https://sass-lang.com/) y `<template>` con [Pug](https://pugjs.org/api/getting-started.html):

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

Note que la integración con preprocesadores podría variar en función de la cadena de herramientas. Echa un vistazo a las documentaciones correspondientes para ejemplos:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importaciones de _Src_

Si prefiere dividir sus componentes `*.vue` en múltiples archivos, puede utilizar el atributo `src` para importar un archivo externo para un bloque de lenguaje:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Tenga en cuenta que las importaciones `src` siguen las mismas reglas de resolución de ruta como las solicitudes de recursos webpack, lo que significa:

- las rutas relativas necesitan empezar con `./`
- Puede importar recursos de las dependencias npm:

```vue
<!-- importar un archivo del paquete npm instalado "todomvc-app-css" -->
<style src="todomvc-app-css/index.css">
```

Las importaciones `src` también funcionan con bloques personalizados, p. ej.:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## Comentarios

Dentro de cada bloque debe utilizar la sintaxis de comentario del lenguaje utilizado (HTML, CSS, JavaScript, Pug, etc.). Para comentarios de nivel superior, utilice la sintaxis de comentarios de HTML: `<!-- comment contents here -->`
