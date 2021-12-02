# Funciones de Renderización

Vue recomienda utilizar plantillas en la gran mayoría de los casos. Sin embargo, hay situaciones en las que necesitamos el poder programático completo de JavaScript. Ahí es donde puede utilizar la **función `render`**.

Profundicemos en un ejemplo dónde una función `render()` sea practical. Por ejemplo, si queremos generar enlaces de cabeceras:

```html
<h1>
  <a name="hello-world" href="#hello-world">
    ¡Hola mundo!
  </a>
</h1>
```

Los enlaces de cabeceras son utilizado con mucha frecuencia, deberíamos crear un componente:

```vue-html
<anchored-heading :level="1">¡Hola mundo!</anchored-heading>
```

El componente debe generar una cabecera basada de la _prop_ `level`, y lo alcanzamos con facilidad:

```js
const { createApp } = Vue

const app = createApp({})

app.component('anchored-heading', {
  template: `
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
      <slot></slot>
    </h6>
  `,
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

Esta plantilla no se siente genial. No sólo verboso, sino también estamos repetiendo `<slot></slot>` par cada nivel de las cabeceras. Y cuando agregamos el elemento de enlace, tenemos que de nuevo repetirlo en cada rama de `v-if/v-else-if`.

Mientras plantillas funcionan muy bien para la mayoría de los componentes, es claro que este no es uno de ellos. Así que tratemos reescribirlo con una función `render()`:

```js
const { createApp, h } = Vue

const app = createApp({})

app.component('anchored-heading', {
  render() {
    return h(
      'h' + this.level, // nombre de la etiqueta
      {}, // props/atributos
      this.$slots.default() // matriz de componentes secundarios
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

La implementación con función `render()` es mucho más sencilla, pero también requiere mayor familiaridad con propiedades de instancias de componentes. En este caso, tiene que saber que cuando pasa contenidos sin directiva `v-slot` a un comoponente, como la `¡Hola mundo!` dentro de `anchored-heading`, aquellos hijos son almacenado en la instancia de componente como `$slots.default()`. Si no está listo, **se recomienda leer [API de propiedades de instancia](../api/instance-properties.html) antes de profundizarse en funciones de `render`.**


## El árbol DOM

Antes de que profundicemos en funciones de `render`, es importante saber un poco sobre cómo funciona los navegadores. Tomemos este código HTML como ejemplo:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Agregar lema -->
</div>
```

Cuando un navegador lee este código, construye un [árbol de "nodos DOM"](https://javascript.info/dom-nodes) para ayudarlo mantener un registro de todos.

El árbol de nodos DOM para el código HTML arriba se parece como este:

![Visualización del árbol DOM](/images/dom-tree.png)

Cada elemento es un nodo. Cada pieza de texto es un nodo. ¡Incluso los comentarios son nodos! Cada nodo puede tener hijos (es decir, cada nodo puede contener otros nodos).

Actualizar todos estos nodos eficientemente puede ser difícil, pero afortunadamente, nunca tenemos que hacerlo manualmente. En cambio, informamos a Vue qué HTML queramos mostrar en la página, en una plantilla:

```html
<h1>{{ blogTitle }}</h1>
```

O en una función `render`:

```js
render() {
  return h('h1', {}, this.blogTitle)
}
```

Y en ambos casos, Vue automáticamente mantiene la página actualizada, incluso cuando `blogTitle` se cambie.

## El árbol DOM virtual

Vue mantiene la página actualizada mediante construir un **DOM virtual** para mantener un registro de los cambios que necesite hacer al DOM real. Echemos un vistazo más cerca en esta línea:

```js
return h('h1', {}, this.blogTitle)
```

¿Qué se retorna de la función `h()`? No es _exactamente_ un elemento DOM real. Retorna un objeto plano que contiene información que describe a Vue qué tipo de nodo que se deba renderizar en la página, incluyendo descripciones de cualquier nodo hijo. La llamamos a esta descripción de nodo un "nodo virtual", a menudo abreviado a **VNode**. "DOM virtual" es lo que llamamos al árbol entero de VNodes, construido por un árbol de componentes Vue.

## Argumentos de `h()`

La función `h()` es una utilidad para crear VNodes. podría probablemente más precisamente ser llamado `createVNode()`, pero es llamado `h()` debido al uso frecuente y la brevedad. Acepta tres argumentos:

```js
// @returns {VNode}
h(
  // {String | Object | Function} etiqueta
  // Un nombre de etiqueta HTML, un componente, un componente asíncrono, o un
  // componente funcional.
  //
  // Requerido.
  'div',

  // {Object} props
  // Un objeto correspondiente a los atributos, props y eventos que podríamos
  // utilizar en una plantilla
  //
  // Opcional.
  {},

  // {String | Array | Object} hijos
  // VNodes secundarios, construido por `h()`,
  // o utilizar cadenas de caracteres para obtener 'Vnodes de textos' o
  // on objeto con slots.
  //
  // Opcional.
  [
    'Va primero algo texto.',
    h('h1', 'Un titular'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ]
)
```

Si no hay _props_, luego los hijos pueden usualmente ser pasado como el segundo argumento. En casos cuando pueda tener ambigüedad, se puede pasar `null` como el segundo argumento para dejar los hijos como el tercero argumento.

## Ejemplo Completo

Con este conocimiento, podemos ahora terminar el componente que iniciamos:

```js
const { createApp, h } = Vue

const app = createApp({})

/** Obtener textos de manera recursiva desde nodos hijos */
function getChildrenTextContent(children) {
  return children
    .map(node => {
      return typeof node.children === 'string'
        ? node.children
        : Array.isArray(node.children)
        ? getChildrenTextContent(node.children)
        : ''
    })
    .join('')
}

app.component('anchored-heading', {
  render() {
    // crear id en _kebab-case_ desde los contenidos de texto de los hijos
    const headingId = getChildrenTextContent(this.$slots.default())
      .toLowerCase()
      .replace(/\W+/g, '-') // reemplazar caracteres que no son palabras por un guión
      .replace(/(^-|-$)/g, '') // reemplazar guión inicial y posterior

    return h('h' + this.level, [
      h(
        'a',
        {
          name: headingId,
          href: '#' + headingId
        },
        this.$slots.default()
      )
    ])
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

## Limitaciones

### VNodes deben ser únicos

Todos los VNodes en el árbol de componentes deben ser únicos. Lo que significa la siguiente función de `render` es inválida:

```js
render() {
  const myParagraphVNode = h('p', 'hi')
  return h('div', [
    // ¡Caramba - VNodes duplicados!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Si de verdad quiere duplicar el mismo elemento/componente múltiples veces, puede hacerlo con una función de fábrica. Por ejemplo, la siguiente función de `render` es una manera perfectamente válida para renderizar 20 párrafos idénticos:

```js
render() {
  return h('div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## Crear VNodes de Componentes

Para crear un VNode para un componente, el primer argumento pasado a `h` debe ser el componente mismo:

```js
render() {
  return h(ButtonCounter)
}
```
Si necesitamos resolver un componente por nombre, luego podemos llamar `resolveComponent`:

```js
const { h, resolveComponent } = Vue

// ...

render() {
  const ButtonCounter = resolveComponent('ButtonCounter')
  return h(ButtonCounter)
}
```

`resolveComponent` es la misma función que las plantillas utilizan internalmente para resolver componentes por nombres.

Una función `render` normalmente solo necesitará utilizar `resolveComponent` para componentes que son [registados globalmente](/guide/component-registration.html#global-registration). [Registración de componentes localmente](/guide/component-registration.html#local-registration) puede saltarse por completo. Considere el siguiente ejemplo:

```js
// Podemos simplificar esto
components: {
  ButtonCounter
},
render() {
  return h(resolveComponent('ButtonCounter'))
}
```

En lugar de registrar un componente por nombre y luego buscarlo, podemos utilizarlo directamente:

```js
render() {
  return h(ButtonCounter)
}
```

## Reemplazar las características de plantillas con JavaScript plano

### `v-if` y `v-for`

Wherever something can be easily accomplished in plain JavaScript, Vue render functions do not provide a proprietary alternative. For example, in a template using `v-if` and `v-for`:

```html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

This could be rewritten with JavaScript's `if`/`else` and `map()` in a render function:

```js
props: ['items'],
render() {
  if (this.items.length) {
    return h('ul', this.items.map((item) => {
      return h('li', item.name)
    }))
  } else {
    return h('p', 'No items found.')
  }
}
```

In a template it can be useful to use a `<template>` tag to hold a `v-if` or `v-for` directive. When migrating to a `render` function, the `<template>` tag is no longer required and can be discarded.

### `v-model`

The `v-model` directive is expanded to `modelValue` and `onUpdate:modelValue` props during template compilation—we will have to provide these props ourselves:

```js
props: ['modelValue'],
emits: ['update:modelValue'],
render() {
  return h(SomeComponent, {
    modelValue: this.modelValue,
    'onUpdate:modelValue': value => this.$emit('update:modelValue', value)
  })
}
```

### `v-on`

We have to provide a proper prop name for the event handler, e.g., to handle `click` events, the prop name would be `onClick`.

```js
render() {
  return h('div', {
    onClick: $event => console.log('clicked', $event.target)
  })
}
```

#### Event Modifiers

For the `.passive`, `.capture`, and `.once` event modifiers, they can be concatenated after the event name using camelCase.

For example:

```js
render() {
  return h('input', {
    onClickCapture: this.doThisInCapturingMode,
    onKeyupOnce: this.doThisOnce,
    onMouseoverOnceCapture: this.doThisOnceInCapturingMode
  })
}
```

For all other event and key modifiers, no special API is necessary, because we can use event methods in the handler:

| Modifier(s)                                          | Equivalent in Handler                                                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `.stop`                                              | `event.stopPropagation()`                                                                                  |
| `.prevent`                                           | `event.preventDefault()`                                                                                   |
| `.self`                                              | `if (event.target !== event.currentTarget) return`                                                         |
| Keys:<br>e.g. `.enter`                               | `if (event.key !== 'Enter') return`<br><br>Change `'Enter'` to the appropriate [key](http://keycode.info/) |
| Modifier Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return`<br><br>Likewise for `altKey`, `shiftKey`, and `metaKey`                       |

Here's an example with all of these modifiers used together:

```js
render() {
  return h('input', {
    onKeyUp: event => {
      // Abort if the element emitting the event is not
      // the element the event is bound to
      if (event.target !== event.currentTarget) return
      // Abort if the key that went up is not the enter
      // key and the shift key was not held down at the
      // same time
      if (!event.shiftKey || event.key !== 'Enter') return
      // Stop event propagation
      event.stopPropagation()
      // Prevent the default keyup handler for this element
      event.preventDefault()
      // ...
    }
  })
}
```

### Slots

We can access slot contents as arrays of VNodes from [`this.$slots`](../api/instance-properties.html#slots):

```js
render() {
  // `<div><slot></slot></div>`
  return h('div', this.$slots.default())
}
```

```js
props: ['message'],
render() {
  // `<div><slot :text="message"></slot></div>`
  return h('div', this.$slots.default({
    text: this.message
  }))
}
```

For component VNodes, we need to pass the children to `h` as an object rather than an array. Each property is used to populate the slot of the same name:

```js
render() {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return h('div', [
    h(
      resolveComponent('child'),
      null,
      // pass `slots` as the children object
      // in the form of { name: props => VNode | Array<VNode> }
      {
        default: (props) => h('span', props.text)
      }
    )
  ])
}
```

The slots are passed as functions, allowing the child component to control the creation of each slot's contents. Any reactive data should be accessed within the slot function to ensure that it's registered as a dependency of the child component and not the parent. Conversely, calls to `resolveComponent` should be made outside the slot function, otherwise they'll resolve relative to the wrong component:

```js
// `<MyButton><MyIcon :name="icon" />{{ text }}</MyButton>`
render() {
  // Calls to resolveComponent should be outside the slot function
  const Button = resolveComponent('MyButton')
  const Icon = resolveComponent('MyIcon')

  return h(
    Button,
    null,
    {
      // Use an arrow function to preserve the `this` value
      default: (props) => {
        // Reactive properties should be read inside the slot function
        // so that they become dependencies of the child's rendering
        return [
          h(Icon, { name: this.icon }),
          this.text
        ]
      }
    }
  )
}
```

If a component receives slots from its parent, they can be passed on directly to a child component:

```js
render() {
  return h(Panel, null, this.$slots)
}
```

They can also be passed individually or wrapped as appropriate:

```js
render() {
  return h(
    Panel,
    null,
    {
      // If we want to pass on a slot function we can
      header: this.$slots.header,

      // If we need to manipulate the slot in some way
      // then we need to wrap it in a new function
      default: (props) => {
        const children = this.$slots.default ? this.$slots.default(props) : []

        return children.concat(h('div', 'Extra child'))
      }
    }
  )
}
```

### `<component>` and `is`

Behind the scenes, templates use `resolveDynamicComponent` to implement the `is` attribute. We can use the same function if we need all the flexibility provided by `is` in our `render` function:

```js
const { h, resolveDynamicComponent } = Vue

// ...

// `<component :is="name"></component>`
render() {
  const Component = resolveDynamicComponent(this.name)
  return h(Component)
}
```

Just like `is`, `resolveDynamicComponent` supports passing a component name, an HTML element name, or a component options object.

However, that level of flexibility is usually not required. It's often possible to replace `resolveDynamicComponent` with a more direct alternative.

For example, if we only need to support component names then `resolveComponent` can be used instead.

If the VNode is always an HTML element then we can pass its name directly to `h`:

```js
// `<component :is="bold ? 'strong' : 'em'"></component>`
render() {
  return h(this.bold ? 'strong' : 'em')
}
```

Similarly, if the value passed to `is` is a component options object then there's no need to resolve anything, it can be passed directly as the first argument of `h`.

Much like a `<template>` tag, a `<component>` tag is only required in templates as a syntactical placeholder and should be discarded when migrating to a `render` function.

### Custom Directives

Custom directives can be applied to a VNode using [`withDirectives`](/api/global-api.html#withdirectives):

```js
const { h, resolveDirective, withDirectives } = Vue

// ...

// <div v-pin:top.animate="200"></div>
render () {
  const pin = resolveDirective('pin')

  return withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
}
```

[`resolveDirective`](/api/global-api.html#resolvedirective) is the same function that templates use internally to resolve directives by name. That is only necessary if you don't already have direct access to the directive's definition object.

### Built-in Components

[Built-in components](/api/built-in-components.html) such as `<keep-alive>`, `<transition>`, `<transition-group>`, and `<teleport>` are not registered globally by default. This allows bundlers to perform tree-shaking, so that the components are only included in the build if they are used. However, that also means we can't access them using `resolveComponent` or `resolveDynamicComponent`.

Templates have special handling for those components, automatically importing them when they are used. When we're writing our own `render` functions, we need to import them ourselves:

```js
const { h, KeepAlive, Teleport, Transition, TransitionGroup } = Vue

// ...

render () {
  return h(Transition, { mode: 'out-in' }, /* ... */)
}
```

## Return Values for Render Functions

In all of the examples we've seen so far, the `render` function has returned a single root VNode. However, there are alternatives.

Returning a string will create a text VNode, without any wrapping element:

```js
render() {
  return 'Hello world!'
}
```

We can also return an array of children, without wrapping them in a root node. This creates a fragment:

```js
// Equivalent to a template of `Hello<br>world!`
render() {
  return [
    'Hello',
    h('br'),
    'world!'
  ]
}
```

If a component needs to render nothing, perhaps because data is still loading, it can just return `null`. This will be rendered as a comment node in the DOM.

## JSX

If we're writing a lot of `render` functions, it might feel painful to write something like this:

```js
h(
  resolveComponent('anchored-heading'),
  {
    level: 1
  },
  {
    default: () => [h('span', 'Hello'), ' world!']
  }
)
```

Especially when the template version is so concise in comparison:

```vue-html
<anchored-heading :level="1"> <span>Hello</span> world! </anchored-heading>
```

That's why there's a [Babel plugin](https://github.com/vuejs/jsx-next) to use JSX with Vue, getting us back to a syntax that's closer to templates:

```jsx
import AnchoredHeading from './AnchoredHeading.vue'

const app = createApp({
  render() {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})

app.mount('#demo')
```

For more on how JSX maps to JavaScript, see the [usage docs](https://github.com/vuejs/jsx-next#installation).

## Functional Components

Functional components are an alternative form of component that don't have any state of their own. They are rendered without creating a component instance, bypassing the usual component lifecycle.

To create a functional component we use a plain function, rather than an options object. The function is effectively the `render` function for the component. As there is no `this` reference for a functional component, Vue will pass in the `props` as the first argument:

```js
const FunctionalComponent = (props, context) => {
  // ...
}
```

The second argument, `context`, contains three properties: `attrs`, `emit`, and `slots`. These are equivalent to the instance properties [`$attrs`](/api/instance-properties.html#attrs), [`$emit`](/api/instance-methods.html#emit), and [`$slots`](/api/instance-properties.html#slots) respectively.

Most of the usual configuration options for components are not available for functional components. However, it is possible to define [`props`](/api/options-data.html#props) and [`emits`](/api/options-data.html#emits) by adding them as properties:

```js
FunctionalComponent.props = ['value']
FunctionalComponent.emits = ['click']
```

If the `props` option is not specified, then the `props` object passed to the function will contain all attributes, the same as `attrs`. The prop names will not be normalized to camelCase unless the `props` option is specified.

Functional components can be registered and consumed just like normal components. If you pass a function as the first argument to `h`, it will be treated as a functional component.

## Template Compilation

You may be interested to know that Vue's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Vue.compile` to live-compile a template string:

<iframe src="https://vue-next-template-explorer.netlify.app/" width="100%" height="420"></iframe>
