# Configuración de Aplicación 

Cada aplicación Vue expone un objeto `config` que contiene la configuración para esta aplicación:

```js
const app = createApp({})

console.log(app.config)
```

Puede modificar sus propiedades, enumeradas abajo, antes de montar su aplicación.

## errorHandler

- **Tipo:** `Function`

- **Por Defecto:** `undefined`

- **Uso:**

```js
app.config.errorHandler = (err, vm, info) => {
  // manejar errores
  // `info` es un error de información específica de Vue, p. ej. en cual hook de ciclo de vida
  // se encontró el error
}
```

Asignar un manejador para errores no capturados durante la función _render_ y los observadores del componente. El manejador será llamado con el error y la instancia de aplicación.

> Los servicios de seguimiento de errores [Sentry](https://sentry.io/for/vue/) y [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) proporcionan integraciones oficiales utilizando esta opción.

## warnHandler

- **Tipo:** `Function`

- **Por Defecto:** `undefined`

- **Uso:**

```js
app.config.warnHandler = function(msg, vm, trace) {
  // `trace` es la traza de la jerarquía de componentes
}
```

Asigna un manejador personalizado para advertencias en tiempo de ejecución. Note que solo funciona en desarrollo y es ignorado en producción.

## globalProperties

- **Tipo:** `[key: string]: any`

- **Por Defecto:** `undefined`

- **Uso:**

```js
app.config.globalProperties.foo = 'bar'

app.component('child-component', {
  mounted() {
    console.log(this.foo) // 'bar'
  }
})
```

Agregar una propiedad global que puede ser accesada en cualquiera instancia de componente dentro de la aplicación. La propiedad del componente tendrá prioridad cuando hay claves contradictorios.

Este puede reemplazar la extensión `Vue.prototype` de Vue 2.x:

```js
// antes
Vue.prototype.$http = () => {}

// después
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

## optionMergeStrategies

- **Tipo:** `{ [key: string]: Function }`

- **Por Defecto:** `{}`

- **Uso:**

```js
const app = createApp({
  mounted() {
    console.log(this.$options.hello)
  }
})

app.config.optionMergeStrategies.hello = (parent, child) => {
  return `Hola, ${child}`
}

app.mixin({
  hello: 'Vue'
})

// 'Hola, Vue'
```

Define estrategias de fusión (merge) para opciones personalizadas.

La estrategia de fusión recibe el valor de aquella opción definida en el padre y las instancias del hijo como primer y segundo parámetro respectivamente.

- **Vea también:** [Estrategias de fusión de opciones personalizadas](../guide/mixins.html#custom-option-merge-strategies)

## performance

- **Tipo:** `boolean`

- **Por Defecto:** `false`

- **Uso**:

Establézcalo en `true` para habilitar el seguimiento del rendimiento de inicio, compilación, renderización y parche del componente en el panal de _performance/timeline_ del _devtool_ del navegador. Solo funciona en modo de desarrollo y navegadores que admiten la API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).


## compilerOptions <Badge text="3.1+" />

- **Tipo:** `Object`

Configure runtime compiler options. Values set on this object will be passed to the in-browser template compiler and affect every component in the configured app. Note you can also override these options on a per-component basis using the [`compilerOptions` option](/api/options-misc.html#compileroptions).

::: tip Important
This config option is only respected when using the full build (i.e. the standalone `vue.js` that can compile templates in the browser). If you are using the runtime-only build with a build setup, compiler options must be passed to `@vue/compiler-dom` via build tool configurations instead.

- For `vue-loader`: [pass via the `compilerOptions` loader option](https://vue-loader.vuejs.org/options.html#compileroptions). Also see [how to configure it in `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- For `vite`: [pass via `@vitejs/plugin-vue` options](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom).
:::

### compilerOptions.isCustomElement

- **Tipo:** `(tag: string) => boolean`

- **Por Defecto:** `undefined`

- **Uso:**

```js
// any element starting with 'ion-' will be recognized as a custom one
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

Specifies a method to recognize custom elements defined outside of Vue (e.g., using the Web Components APIs). If component matches this condition, it won't need local or global registration and Vue won't throw a warning about an `Unknown custom element`.

> Note that all native HTML and SVG tags don't need to be matched in this function - Vue parser performs this check automatically.

### compilerOptions.whitespace

- **Tipo:** `'condense' | 'preserve'`

- **Por Defecto:** `'condense'`

- **Uso:**

```js
app.config.compilerOptions.whitespace = 'preserve'
```

By default, Vue removes/condenses whitespaces between template elements to produce more efficient compiled output:

1. Leading / ending whitespaces inside an element are condensed into a single space
2. Whitespaces between elements that contain newlines are removed
3. Consecutive whitespaces in text nodes are condensed into a single space

Setting the value to `'preserve'` will disable (2) and (3).

### compilerOptions.delimiters

- **Tipo:** `Array<string>`

- **Por Defecto:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Uso:**

```js
// Delimiters changed to ES6 template string style
app.config.compilerOptions.delimiters = ['${', '}']    
```

Sets the delimiters used for text interpolation within the template.

Typically this is used to avoid conflicting with server-side frameworks that also use mustache syntax.

### compilerOptions.comments

- **Tipo:** `boolean`

- **Por Defecto:** `false`

- **Uso:**

```js
app.config.compilerOptions.comments = true
```

By default, Vue will remove HTML comments inside templates in production. Setting this option to `true` will force Vue to preserve comments even in production. Comments are always preserved during development.

This option is typically used when Vue is used with other libraries that rely on HTML comments.

## isCustomElement <Badge text="deprecated" type="warning"/>

Deprecated in 3.1.0. Use [`compilerOptions.isCustomElement`](#compileroptions-iscustomelement) instead.
