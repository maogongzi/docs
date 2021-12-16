# Configuración de Aplicación 

Cada aplicación Vue expone un objeto `config` que contenga la configuración para dicha aplicación:

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
  // `info` es un error de información específico de Vue, p. ej. en cual hook de ciclo de vida
  // se encontró el error
}
```

Asigna un manejador para errores no capturados durante la función _render_ y los observadores del componente. El manejador será llamado con el error y la instancia de aplicación.

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

Agrega una propiedad global que puede ser accesada en cualquiera instancia de componente dentro de la aplicación. La propiedad del componente tendrá prioridad cuando hay claves contradictorios.

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

La estrategia de fusión recibe el valor de aquella opción definido en las instancias del padre y hijo como primer y segundo parámetro respectivamente.

- **Vea también:** [Estrategias de fusión de opciones personalizadas](../guide/mixins.html#custom-option-merge-strategies)

## performance

- **Tipo:** `boolean`

- **Por Defecto:** `false`

- **Uso**:

Establézcalo en `true` para habilitar el seguimiento del rendimiento de inicio, compilación, renderización y parche del componente en el panal de _performance/timeline_ del _devtool_ del navegador. Solo funciona en modo de desarrollo y en navegadores que admiten la API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).


## compilerOptions <Badge text="3.1+" />

- **Tipo:** `Object`

Configurar opciones de compilador de tiempo de ejecución. Los valores establecidos en este objeto serán pasados al compilador de plantillas en el navegador y afectarán cada componente en la aplicación configurada. Note que puede también sobreescribir estas opciones sobre la base de per componente utilizando la [opción `compilerOptions`](/api/options-misc.html#compileroptions).

::: tip Important
Esta opción de configuración solo se respeta cuando se utilice la compilación completa (es decir, el `vue.js` independiente que puede compilar plantillas dentro del navegador). Si está utilizando la compilación de solo tiempo de ejecución con una configuración de compilación, las opciones del compilador deben ser pasadas a `@vue/compiler-dom` mediante las configuraciones de herramienta de compilación en su lugar.

- para `vue-loader`: [pasar mediante la opción de cargador (loader) `compilerOptions`](https://vue-loader.vuejs.org/options.html#compileroptions). Vea también [cómo configurarlo en `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- para `vite`: [pasar mediante las opciones de `@vitejs/plugin-vue`](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom).
:::

### compilerOptions.isCustomElement

- **Tipo:** `(tag: string) => boolean`

- **Por Defecto:** `undefined`

- **Uso:**

```js
// cualquier elemento empieza con 'ion-' será reconocido como un elemento personalizado
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

Especifica un método para reconocer elementos personalizadas definidos afuera de Vue (p. e.j. utilizando las APIs de Componentes Web). Si un componente cumple esta condición, no necesitará registración local o global y Vue no lanzará una advertencia sobre un `Unknown custom element` (Elemento personalizado desconocido).

> Note que todas etiquetas HTML y SVG nativas no necesitan ser coincididas en esta función, el intérprete (parser) Vue realiza esta comprobación automáticamente.

### compilerOptions.whitespace

- **Tipo:** `'condense' | 'preserve'`

- **Por Defecto:** `'condense'`

- **Uso:**

```js
app.config.compilerOptions.whitespace = 'preserve'
```

Por defecto, Vue elimina/comprime espacios en blanco entre elementos de plantilla para generar resultado compilado más efficiente:

1. Los espacios en blanco iniciales / finales dentro de un elemento son comprimidos en un solo espacio de blanco
2. Los espacios en blanco entre elementos que contienen saltos de línea son eliminados.
3. Espacios en blanco consecutivos en nodos de texto son comprimidos en un solo espacio de blancl

Al establecer el valor a `'preserve'`, se deshabilitarán (2) y (3).

### compilerOptions.delimiters

- **Tipo:** `Array<string>`

- **Por Defecto:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Uso:**

```js
// Cambia los delimitadores al estilo de plantillas de cadena de caracteres de ES6
app.config.compilerOptions.delimiters = ['${', '}']    
```

Establece los delimitadores utilizados para la interpolación de texo dentro de la plantilla.

Típicamente esta es utilizada para evitar conflictos con frameworks del lado del servidor que también utilice el sintaxis _mustache_.

### compilerOptions.comments

- **Tipo:** `boolean`

- **Por Defecto:** `false`

- **Uso:**

```js
app.config.compilerOptions.comments = true
```

Por defecto, Vue eliminará comentarios HTML dentro de plantillas en modo de producción. Al establecer esta opción a `true`, Vue será forzado a preservar comentarios incluso en modo de producción. Comentarios son siempre preservados durante el desarrollo.

Esta opción es típicamente utilizada cuando Vue es utilizado con otras librerías que dependan de comentarios HTML.

## isCustomElement <Badge text="deprecated" type="warning"/>

Obsoleto en 3.1.0. Utilice [`compilerOptions.isCustomElement`](#compileroptions-iscustomelement) en su lugar.
