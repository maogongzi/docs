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

Cuando algo puede ser logrado fácilmente en JavaScript plano, Las funciones de `render` de Vue no proporcionan una alternativa propietaria. Por ejemplo, en una plantilla que utiliza `v-if` y `v-for`:

```html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No se ha encontrado niguno elemento.</p>
```

Este podría ser reescrito con `if`/`else` y `map()` de JavaScript en una función `render`:

```js
props: ['items'],
render() {
  if (this.items.length) {
    return h('ul', this.items.map((item) => {
      return h('li', item.name)
    }))
  } else {
    return h('p', 'No se ha encontrado niguno elemento.')
  }
}
```

En una plantilla puede ser útil utilizar una etiqueta `<template>` para sujetar una directiva `v-if` o `v-for`. Cuando se migra a función `render`, la etiqueta `<template>` es no más requerido y puede ser abandonado.

### `v-model`

La directiva `v-model` es expandido a _props_ `modelValue` y `onUpdate:modelValue` durante la compilación de plantillas, tedrémos que proporcionar estas _props_ por nosotros mísmos:

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

Tenemos que proporcionar un nombre apropiado de _prop_ para el manejador del evento, p. ej. para manejar eventos `click`, el nombre de la _prop_ puede ser `onClick`.

```js
render() {
  return h('div', {
    onClick: $event => console.log('clicked', $event.target)
  })
}
```

#### Modificadores de Eventos

Para los modificadores de eventos `.passive`, `.capture`, y `.once`, pueden ser concatenado después del nombre de evento utilizando _camelCase_.

Por ejemplo:

```js
render() {
  return h('input', {
    onClickCapture: this.doThisInCapturingMode,
    onKeyupOnce: this.doThisOnce,
    onMouseoverOnceCapture: this.doThisOnceInCapturingMode
  })
}
```

Para todos otros eventos y modificadores principales, no API específico es necesario, porque podemos utilizar métodos de eventos en el manejador:

| Modificador(es)                                                | Equivalente en Manejador                                                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `.stop`                                                        | `event.stopPropagation()`                                                                                  |
| `.prevent`                                                     | `event.preventDefault()`                                                                                   |
| `.self`                                                        | `if (event.target !== event.currentTarget) return`                                                         |
| Teclas:<br>e.g. `.enter`                                       | `if (event.key !== 'Enter') return`<br><br>Cambiar `'Enter'` a la [tecla](http://keycode.info/) apropiada  |
| Teclas de Modificadores:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return`<br><br>Lo mismo para `altKey`, `shiftKey`, y `metaKey`                        |

Aquí es un ejemplo con todos los modificadores utilizados juntos:

```js
render() {
  return h('input', {
    onKeyUp: event => {
      // Abortar si el elemento que emite el evento no es el elemento al que
      // el evento sea vinculado
      if (event.target !== event.currentTarget) return
      // Abortar si la tecla que rebotó no no es la tecla _enter_
      // y la tecla _shift_ no fue presionada al mismo tiempo
      if (!event.shiftKey || event.key !== 'Enter') return
      // Dejar la propagación de evento
      event.stopPropagation()
      // Prevenir el manejador por defecto de _keyup_ de este elemento
      event.preventDefault()
      // ...
    }
  })
}
```

### _Slots_

Podemos acceder los contenidos de _slot_ como una matriz de VNodes mediante [`this.$slots`](../api/instance-properties.html#slots):

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

Para VNodes de componentes, necesitamos pasar los hijos a `h` como un objeto en lugar de una matriz. Cada propiedad es utilizado para poblar el _slot_ del mismo nombre:

```js
render() {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return h('div', [
    h(
      resolveComponent('child'),
      null,
      // pasar `slots` como el objeto de hijos
      // en forma de { name: props => VNode | Array<VNode> }
      {
        default: (props) => h('span', props.text)
      }
    )
  ])
}
```

Los _slots_ son pasado como funciones, permitiendo los componentes secundarios controlar la creación de los contenidos de cada _slot_. Cualquier dato reactivo debe ser accesado dentro de la función de _slot_ para asegurarse de que sea registrado como una dependencia del componente hijo en vez del padre. Por el contrario, las llamadas a `resolveComponent` deben realizarse afuera de la función de _slot_, de lo contrario se resolverán respecto al componente incorrecto:

```js
// `<MyButton><MyIcon :name="icon" />{{ text }}</MyButton>`
render() {
  // Llamadas a resolveComponent debe ser afuera de la función de slot
  const Button = resolveComponent('MyButton')
  const Icon = resolveComponent('MyIcon')

  return h(
    Button,
    null,
    {
      // Utilizar una función de flecha para preservar el valor de `this`
      default: (props) => {
        // Las propiedades reactivas deben ser leido dentro de la función
        // de _slot_ para que sean convertido en dependencias de la renderización
        // del hijo
        return [
          h(Icon, { name: this.icon }),
          this.text
        ]
      }
    }
  )
}
```

Si un componente recibe _slots_ de su padre, pueden ser pasado directamente a un componente hijo:

```js
render() {
  return h(Panel, null, this.$slots)
}
```

Pueden también ser pasado individualmente u envuelto según proceda:

```js
render() {
  return h(
    Panel,
    null,
    {
      // Si queremos pasar una función de slot podemos
      header: this.$slots.header,

      // Si queremos manipular el slot en alguna manera, luego necesitamos
      // envolverlo en una nueva función
      default: (props) => {
        const children = this.$slots.default ? this.$slots.default(props) : []

        return children.concat(h('div', 'Hijo adicional'))
      }
    }
  )
}
```

### `<component>` y `is`

Detrás de las escenas, las plantillas utiliza `resolveDynamicComponent` para implementar el atributo `is`. Podemos utilizar la misma función si necesitamos toda la flexibilidad proporcionada por `is` en nuestra función de `render`:

```js
const { h, resolveDynamicComponent } = Vue

// ...

// `<component :is="name"></component>`
render() {
  const Component = resolveDynamicComponent(this.name)
  return h(Component)
}
```

Justo como `is`, `resolveDynamicComponent` soporta pasar un nombre de componente, un nombre de elemento HTML, u un objeto de opciones de componente.

Sin embargo, ese nivel de flexibilidad no es usualmente requerido. A menudo es posible reemplazar `resolveDynamicComponent` con una alternativa más directa.

Por ejemplo, si solo necesitamos soportar nombres de componentes, luego se puede utilizar `resolveComponent` en su lugar.

Si el VNode es siempre un elemento HTML, luego podemos pasar su nombre directamente a `h`:

```js
// `<component :is="bold ? 'strong' : 'em'"></component>`
render() {
  return h(this.bold ? 'strong' : 'em')
}
```

De la misma manera, si el valor pasado a `is` es un objeto de opciones de componente, luego no necesita resolver nada, se puede pasar directamente como el primero argumento de `h`.

Muy parecida a una etiqueta `<template>`, una etiqueta `<component>` es solo requerido en plantillas como un marcador de posición sintáctico y debería ser descartado cuando se migre a la función `render`.

### Directivas Personalizadas

Se pueden aplicar directivas personalizadas a un VNode utilizando [`withDirectives`](/api/global-api.html#withdirectives):

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

[`resolveDirective`](/api/global-api.html#resolvedirective) es la misma función que las plantillas utilizan internalmente para resolver directivas por nombres. Eso es necesario solo si ya no tiene acceso directo al objeto de definición de la directiva.

### Componentes Integrados

[Componentes integrados](/api/built-in-components.html) como `<keep-alive>`, `<transition>`, `<transition-group>`, y `<teleport>` no son registrado globalmente por defecto. Eso les permite a los empaquetadores realizar _tree-shaking_, así que los componentes son solo incluido en la compilación si son utilizado. Sin embargo, lo que también significa que no podemos accederlos utilizando `resolveComponent` o `resolveDynamicComponent`.

Las plantillas tienen manipulación especiales para aquellos componentes, los importan automáticamente cuando sean utilizado. Cuando estamos escribiendo nuestras propias funciones de `render`, necesitamos importarlos por nosotros mísmos:

```js
const { h, KeepAlive, Teleport, Transition, TransitionGroup } = Vue

// ...

render () {
  return h(Transition, { mode: 'out-in' }, /* ... */)
}
```

## Retornar valores para funciones de `render`

En todos los ejemplos que hemos visto hasta el momento, la función `render` ha retornado un sólo VNode raíz. Sin embargo, hay alternativas.

Retornar una cadena de caracteres va creando un VNode de texto, sin cualquier elemento de envoltorio:

```js
render() {
  return 'Hello world!'
}
```

También podemos retornar una matriz de hijos, sin envolverlos en un nodo raíz. Este creará un fragmento:

```js
// Equivalente a la plantilla `¡Hola<br>mundo!`
render() {
  return [
    '¡Hola',
    h('br'),
    'mundo!'
  ]
}
```

Si un componente necesita renderizar nada, tal vez es porque el dato se está cargando, puede solo retornar `null`. Este va a renderizarse como un nodo de comentario en el DOM.

## JSX

Si estamos escribiendo muchos funciones de `render`, podría ser doloroso escribir algo como esto:

```js
h(
  resolveComponent('anchored-heading'),
  {
    level: 1
  },
  {
    default: () => [h('span', '¡Hola'), ' mundo!']
  }
)
```

Especialmente cuando la versión de plantilla es muy conciso, en comparación:

```vue-html
<anchored-heading :level="1"> <span>¡Hola</span> mundo! </anchored-heading>
```

Por eso, hay un [Plugin de Babel](https://github.com/vuejs/jsx-next) para utilizar JSX junto con Vue, nos llevará atrás hacia un sintaxis que sea más cerca de plantillas:

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

Para más sobre cómo JSX se mapea a JavaScript, vea la [documentación de usos](https://github.com/vuejs/jsx-next#installation).

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
