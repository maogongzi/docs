---
sidebarDepth: 1
---

# API Global

Si está utilizando una compilación de CDN, luego las funciones de la API global son disponibles mediante el objeto global `Vue`. p. ej.:

```js
const { createApp, h, nextTick } = Vue
```

Si está utilizando módulos ES, luego pueden ser importados directamente:

```js
import { createApp, h, nextTick } from 'vue'
```

Las funciones globales que se encargan de la reactividad, como `reactive` y `ref`, son documentadas por separado. Vea [API de Reactividad](/api/reactivity-api.html) para estas funciones.

## createApp

Retorna una instancia de aplicación que proporciona un contexto de aplicación. El árbol completo de componentes montado por la instancia de aplicación comparte el mismo contexto.

```js
const app = createApp({})
```

Puede encadenar otros métodos después de `createApp`, los cuales se pueden encontrar en [API de Aplicación](./application-api.html)

### Argumentos

La función recibe un objeto de opciones de componente raíz como el primer parámetro:

```js
const app = createApp({
  data() {
    return {
      ...
    }
  },
  methods: {...},
  computed: {...}
  ...
})
```

Con el segundo parámetro, podemos pasar _props_ raíz a la aplicación:

```js
const app = createApp(
  {
    props: ['username']
  },
  { username: 'Evan' }
)
```

```html
<div id="app">
  <!-- se mostrará 'Evan' -->
  {{ username }}
</div>
```

Las _props_ raíz son _props_ crudas, muy similar a esos pasados a [`h`](#h) para crear un VNode. Además de _props_ de componente, pueden también incluir atributos y escuchadores de evento que se van a aplicar al componente raíz.

### Tipar

```ts
interface Data {
  [key: string]: unknown
}

export type CreateAppFunction<HostElement> = (
  rootComponent: PublicAPIComponent,
  rootProps?: Data | null
) => App<HostElement>
```

## h

Retorna un "nodo virtual", usualmente abreviado a **VNode**: un objeto plano que contiene información describiendo a Vue qué tipo de nodo se debe renderizar en la página, incluyendo descripciones de cualquier nodo hijo. Es destinado para [funciones de _render_](../guide/render-function.md) escritos manualmente:

```js
render() {
  return h('h1', {}, 'Algún título')
}
```

### Argumentos

Acepta tres argumentos: `type`, `props` y `children`

#### type

- **Tipo:** `String | Object | Function`

- **Detalles:**

  Un nombre de etiqueta HTML, un componente, un componente asíncrono, o un componente funcional. Se renderizaría un comentario al utilizar una función que retorne _null_. Este parámetro es requerido

#### props

- **Tipo:** `Object`

- **Detalles:**

  Un objeto correspondiente a los atributos, _props_ y eventos que podríamos utilizar en una plantilla. Opcional

#### children

- **Tipo:** `String | Array | Object`

- **Detalles:**

  VNodes hijos, construidos utilizando `h()`, o cadenas de caracteres para obtener "VNodes de texto" o un objeto con _slots_. Opcional

  ```js
  h('div', {}, [
    'Se va algún texto primero.',
    h('h1', 'Un titular'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ])
  ```

## defineComponent

Cuando se trate de la implementación, `defineComponent` no nace nada sino retorna el objeto pasado a el. Sin embargo, en términos de tipar, el valor retornado tiene un constructor de tipo sintético para función manual de _render_, TSX y soporte de herramienta de IDE.

### Argumentos

Un objeto con opciones de componente

```js
import { defineComponent } from 'vue'

const MyComponent = defineComponent({
  data() {
    return { count: 1 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

O una función `setup`, el nombre de la función será utilizado como nombre de componente

```js
import { defineComponent, ref } from 'vue'

const HelloWorld = defineComponent(function HelloWorld() {
  const count = ref(0)
  return { count }
})
```

## defineAsyncComponent

Crea un componente asíncrono que se va a cargar solo cuando sea necesario.

### Argumentos

Para uso básico, `defineAsyncComponent` puede aceptar una función de fábrica que retorne un `Promise`. El _callback_ `resolve` del Promise será llamado cuando haya recuperado su definición de componente desde el servidor. Puede también llamar `reject(reason)` para indicar que la carga haya fallado.

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

Cuando utiliza [registración local](../guide/component-registration.html#local-registration), puede también proporcionar directamente una función que retorne u `Promise`:

```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

Para uso avanzado, `defineAsyncComponent` puede aceptar un objeto:

El método `defineAsyncComponent` puede también retornar un objeto del formato siguiente:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // La función de fábrica
  loader: () => import('./Foo.vue'),
  // Un componente para utilizar mientras se carga el componente asíncrono
  loadingComponent: LoadingComponent,
  // Un componente para utilizar si la carga falla
  errorComponent: ErrorComponent,
  // La demora antes de mostrar el componente de cargamente. Por defecto: 200ms.
  delay: 200,
  // El componente de error será mostrado si un tiempo fuera sea
  // proporcionado y excedido. Por defector: Infinity.
  timeout: 3000,
  // Defining if component is suspensible. Default: true.
  suspensible: false,
  /**
   *
   * @param {*} error Error message object
   * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
   * @param {*} fail  End of failure
   * @param {*} attempts Maximum allowed retries number
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // retry on fetch errors, 3 max attempts
      retry()
    } else {
      // Note that retry/fail are like resolve/reject of a promise:
      // one of them must be called for the error handling to continue.
      fail()
    }
  },
})
```

**See also**: [Dynamic and Async components](../guide/component-dynamic-async.html)

## defineCustomElement <Badge text="3.2+" />

This method accepts the same argument as [`defineComponent`](#definecomponent), but instead returns a native [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that can be used within any framework, or with no frameworks at all.

Usage example:

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-vue-element>` tags on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

For more details on building Web Components with Vue, especially with Single File Components, see [Vue and Web Components](/guide/web-components.html#building-custom-elements-with-vue).

## resolveComponent

:::warning
`resolveComponent` can only be used within `render` or `setup` functions.
:::

Allows resolving a `component` by its name, if it is available in the current application instance.

Returns a `Component` or the argument `name` when not found.

```js
const app = createApp({})
app.component('MyComponent', {
  /* ... */
})
```

```js
import { resolveComponent } from 'vue'
render() {
  const MyComponent = resolveComponent('MyComponent')
}
```

### Argumentos

Accepts one argument: `name`

#### name

- **Tipo:** `String`

- **Detalles:**

  The name of a loaded component.

## resolveDynamicComponent

:::warning
`resolveDynamicComponent` can only be used within `render` or `setup` functions.
:::

Allows resolving a `component` by the same mechanism that `<component :is="">` employs.

Returns the resolved `Component` or a newly created `VNode` with the component name as the node tag. Will raise a warning if the `Component` was not found.

```js
import { resolveDynamicComponent } from 'vue'
render () {
  const MyComponent = resolveDynamicComponent('MyComponent')
}
```

### Argumentos

Accepts one argument: `component`

#### component

- **Tipo:** `String | Object (component’s options object)`

- **Detalles:**

  For more details, refer to the documentation on [Dynamic Components](../guide/component-dynamic-async.html).

## resolveDirective

:::warning
`resolveDirective` can only be used within `render` or `setup` functions.
:::

Allows resolving a `directive` by its name, if it is available in the current application instance.

Returns a `Directive` or `undefined` when not found.

```js
const app = createApp({})
app.directive('highlight', {})
```

```js
import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
```

### Argumentos

Accepts one argument: `name`

#### name

- **Tipo:** `String`

- **Detalles:**

  The name of a loaded directive.

## withDirectives

:::warning
`withDirectives` can only be used within `render` or `setup` functions.
:::

Allows applying directives to a **VNode**. Returns a VNode with the applied directives.

```js
import { withDirectives, resolveDirective } from 'vue'
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h('div'), [
  [foo, this.x],
  [bar, this.y]
])
```

### Argumentos

Accepts two arguments: `vnode` and `directives`.

#### vnode

- **Tipo:** `vnode`

- **Detalles:**

  A virtual node, usually created with `h()`.

#### directives

- **Tipo:** `Array`

- **Detalles:**

  An array of directives.

  Each directive itself is an array, which allows for up to 4 indexes to be defined as seen in the following examples.

  - `[directive]` - The directive by itself. Required.

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective]])
  ```

  - `[directive, value]` - The above, plus a value of type `any` to be assigned to the directive

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective, 100]])
  ```

  - `[directive, value, arg]` - The above, plus a `String` argument, ie. `click` in `v-on:click`

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click']
  ])
  ```

  - `[directive, value, arg, modifiers]` - The above, plus a `key: value` pair `Object` defining any modifiers.

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click', { prevent: true }]
  ])
  ```

## createRenderer

The createRenderer function accepts two generic arguments:
`HostNode` and `HostElement`, corresponding to Node and Element types in the
host environment.

For example, for runtime-dom, HostNode would be the DOM
`Node` interface and HostElement would be the DOM `Element` interface.

Custom renderers can pass in the platform specific types like this:

```ts
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})
```

### Argumentos

Accepts two arguments: `HostNode` and `HostElement`

#### HostNode

- **Tipo:** `Node`

- **Detalles:**

  The node in the host environment.

#### HostElement

- **Tipo:** `Element`

- **Detalles:**

  The element in the host environment.

## nextTick

Defer the callback to be executed after the next DOM update cycle. Use it immediately after you’ve changed some data to wait for the DOM update.

```js
import { createApp, nextTick } from 'vue'

const app = createApp({
  setup() {
    const message = ref('Hello!')
    const changeMessage = async newMessage => {
      message.value = newMessage
      await nextTick()
      console.log('Now DOM is updated')
    }
  }
})
```

**See also**: [`$nextTick` instance method](instance-methods.html#nexttick)

## mergeProps

Takes multiple objects containing VNode props and merges them into a single object. A newly created object is returned, the objects passed as arguments are not modified.

Any number of objects can be passed, with properties from later arguments taking precedence. Event listeners are handled specially, as are `class` and `style`, with the values of these properties being merged rather than overwritten.

```js
import { h, mergeProps } from 'vue'

export default {
  inheritAttrs: false,

  render() {
    const props = mergeProps(
      {
        // The class will be merged with any class from $attrs
        class: 'active'
      },
      this.$attrs
    )

    return h('div', props)
  }
}
```

## useCssModule

:::warning
`useCssModule` can only be used within `render` or `setup` functions.
:::

Allows CSS modules to be accessed within the [`setup`](/api/composition-api.html#setup) function of a [single-file component](/guide/single-file-component.html):

```vue
<script>
import { h, useCssModule } from 'vue'

export default {
  setup() {
    const style = useCssModule()

    return () =>
      h(
        'div',
        {
          class: style.success
        },
        'Task complete!'
      )
  }
}
</script>

<style module>
.success {
  color: #090;
}
</style>
```

For more information about using CSS modules, see [SFC Style Features: `<style module>`](/api/sfc-style.html#style-module).

### Argumentos

Accepts one argument: `name`

#### name

- **Tipo:** `String`

- **Detalles:**

  The name of the CSS module. Defaults to `'$style'`.

## version

Provides the installed version of Vue as a string.

```js
const version = Number(Vue.version.split('.')[0])

if (version === 3) {
  // Vue 3
} else if (version === 2) {
  // Vue 2
} else {
  // Unsupported versions of Vue
}
```

**See also**: [Application API - version](/api/application-api.html#version)
