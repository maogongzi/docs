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

  An HTML tag name, a component, an async component, or a functional component. Using function returning null would render a comment. This parameter is required

#### props

- **Tipo:** `Object`

- **Detalles:**

  An object corresponding to the attributes, props and events we would use in a template. Optional

#### children

- **Tipo:** `String | Array | Object`

- **Detalles:**

  Children VNodes, built using `h()`, or using strings to get "text VNodes" or an object with slots. Optional

  ```js
  h('div', {}, [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ])
  ```

## defineComponent

Implementation-wise `defineComponent` does nothing but return the object passed to it. However, in terms of typing, the returned value has a synthetic type of a constructor for manual render function, TSX and IDE tooling support.

### Arguments

An object with component options

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

Or a `setup` function, function name will be used as component name

```js
import { defineComponent, ref } from 'vue'

const HelloWorld = defineComponent(function HelloWorld() {
  const count = ref(0)
  return { count }
})
```

## defineAsyncComponent

Creates an async component that will be loaded only when it's necessary.

### Arguments

For basic usage, `defineAsyncComponent` can accept a factory function returning a `Promise`. Promise's `resolve` callback should be called when you have retrieved your component definition from the server. You can also call `reject(reason)` to indicate the load has failed.

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

When using [local registration](../guide/component-registration.html#local-registration), you can also directly provide a function that returns a `Promise`:

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

For advanced usage, `defineAsyncComponent` can accept an object:

The `defineAsyncComponent` method can also return an object of the following format:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // The factory function
  loader: () => import('./Foo.vue'),
  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
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

### Arguments

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

### Arguments

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

### Arguments

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

### Arguments

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

### Arguments

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

### Arguments

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
