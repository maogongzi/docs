# Introduction

::: tip NOTE
Already know Vue 2 and just want to learn about what's new in Vue 3? Check out the [Migration Guide](/guide/migration/introduction.html)!
:::

## What is Vue.js?

Vue (pronounced /vjuː/, like **view**) is a **progressive framework** for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with [modern tooling](../guide/single-file-component.html) and [supporting libraries](https://github.com/vuejs/awesome-vue#components--libraries).

If you’d like to learn more about Vue before diving in, we <a id="modal-player" class="vuemastery-trigger"  href="#">created a video</a> walking through the core principles and a sample project.

<VideoLesson href="https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3" title="Watch a free video course on Vue Mastery">Watch a free video course on Vue Mastery</VideoLesson>

<common-vuemastery-video-modal/>

## Getting Started

<p>
  <ActionLink class="primary" url="installation.html">
    Installation
  </ActionLink>
</p>

::: tip
The official guide assumes intermediate level knowledge of HTML, CSS, and JavaScript. If you are totally new to frontend development, it might not be the best idea to jump right into a framework as your first step - grasp the basics then come back! Prior experience with other frameworks helps, but is not required.
:::

The easiest way to try out Vue.js is using the [Hello World example](https://codepen.io/team/Vue/pen/KKpRVpx). Feel free to open it in another tab and follow along as we go through some basic examples.

The [Installation](installation.md) page provides more options of installing Vue. Note: We **do not** recommend that beginners start with `vue-cli`, especially if you are not yet familiar with Node.js-based build tools.

## Declarative Rendering

At the core of Vue.js is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```html
<div id="counter">
  Counter: {{ counter }}
</div>
```

```js
const Counter = {
  data() {
    return {
      counter: 0
    }
  }
}

Vue.createApp(Counter).mount('#counter')
```

We have already created our very first Vue app! This looks pretty similar to rendering a string template, but Vue has done a lot of work under the hood. The data and the DOM are now linked, and everything is now **reactive**. How do we know? Take a look at the example below where `counter` property increments every second and you will see how rendered DOM changes:

```js{8-10}
const Counter = {
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}
```

<FirstExample />

In addition to text interpolation, we can also bind element attributes like this:

```html
<div id="bind-attribute">
  <span v-bind:title="message">
    Hover your mouse over me for a few seconds to see my dynamically bound
    title!
  </span>
</div>
```

```js
const AttributeBinding = {
  data() {
    return {
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
  }
}

Vue.createApp(AttributeBinding).mount('#bind-attribute')
```

<common-codepen-snippet title="Attribute dynamic binding" slug="KKpRVvJ" />

Aquí estamos encontrando algo nuevo. El atributo `v-bind` que ve es llamado una **directiva**. Las directivas son prefijado con `v-` para indicar que son atributos especiales proporcionados por Vue, y como habrá advinado, aplican comportamientos reactivos especiales al DOM renderizado. Aquí, básicamente estamos hablando de "_Deja el atributo `title` de este elemento actualizado co la propiedad `message` en la instancia actual activa._"

## Manejar la Entrada del Usuario

Para permitir a los usuarios interactuar con nuestro aplicación, podemos utilizar la directiva `v-on` para vincular eventos de escucha que invoquen métodos en nuestras instancias:

```html
<div id="event-handling">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Mensaje Invertido</button>
</div>
```

```js
const EventHandling = {
  data() {
    return {
      message: '¡Hola Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}

Vue.createApp(EventHandling).mount('#event-handling')
```

<common-codepen-snippet title="Manipulación de Eventos" slug="dyoeGjW" />

Note que en este método actualizamos el estado de nuestra aplicación sin tocar el DOM, todas las manipulaciones del DOM son manejadas por Vue, y el código que usted escribe está enfocado en la lógica que hay debajo.

Vue también proporciona la directiva `v-model` que hace muy sencilla la vinculación de doble dirección entre formulario de entrada y el estado de la aplicación:

```html
<div id="two-way-binding">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>
```

```js
const TwoWayBinding = {
  data() {
    return {
      message: '¡Hola Vue!'
    }
  }
}

Vue.createApp(TwoWayBinding).mount('#two-way-binding')
```

<common-codepen-snippet title="Vinculación de Doble Dirección" slug="poJVgZm" />

## Condicionales y Ciclos

Es sencillo también alternar la presencia de un elemento:

```html
<div id="conditional-rendering">
  <span v-if="seen">Ahora me ve</span>
</div>
```

```js
const ConditionalRendering = {
  data() {
    return {
      seen: true
    }
  }
}

Vue.createApp(ConditionalRendering).mount('#conditional-rendering')
```

Este ejemplo demuestra que podemos vincular datos no solo a texto y atributos, sino también a la **estructura** del DOM. Además, Vue proporciona también un poderoso sistema de transición de efectos que puede automáticamente aplicar [transición de efectos](transitions-enterleave.md) cuando los elementos son insertados/actualizados/eliminados por Vue.

Puede cambiar `seen` de `true` a `false` en el sandbox que sigue para observar lo que ocurre:

<common-codepen-snippet title="Renderización Condicional" slug="oNXdbpB" tab="js,result" />

Existen bastantes otras directivas, cada una con su funcionalidad especial. Por ejemplo, la directiva `v-for`  puede ser utilizada para mostrar una lista de elementos empleando datos de un Array:

```html
<div id="list-rendering">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

```js
const ListRendering = {
  data() {
    return {
      todos: [
        { text: 'Aprender JavaScript' },
        { text: 'Aprender Vue' },
        { text: 'Construir algo asombroso' }
      ]
    }
  }
}

Vue.createApp(ListRendering).mount('#list-rendering')
```

<common-codepen-snippet title="Renderización de Listas" slug="mdJLVXq" />

## Composición mediante Componentes

El sistema de componentes es otro concepto importante en Vue, porque es una abstracción que nos permite construir aplicaciones a gran escala compuestos de componentes pequeños, auto-contenidos, y usualmente reutilizables. Si lo pensamos, casi todo tipo de interfaz de aplicación puede ser abstraída en un árbol de componentes:

![Árbol de Componentes](/images/components.png)

En vue, un componente es escencialmente una instancia con opciones predefinidas. Registrar un componente en Vue es sencillo: creamos un objeto componente como hicimos con los objetos `App` y lo definimos en la opción `components` en su padre:

```js
const TodoItem = {
  template: `<li>Esto es un todo</li>`
}

// Crea aplicación Vue
const app = Vue.createApp({
  components: {
    TodoItem // Registrar un nuevo componente
  },
  ... // Otros props para el componente
})

// Montar la aplicación Vue
app.mount(...)
```

Ahora puede componenrlo en la plantilla del otro componente:

```html
<ol>
  <!-- Crea una instancia del componente todo-item -->
  <todo-item></todo-item>
</ol>
```

Pero este va a renderizar el mismo texto para cada todo, lo cual no es muy interesante. Deberíamos ser capaces de pasar datos a los componentes hijos desde el padre. Vamos a modificar la definición del componente para que acepte un [prop](component-basics.html#passing-data-to-child-components-with-props):

```js
app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})
```

Ahora podemos pasar el todo en cada componente repetido utilizando `v-bind`:

```html
<div id="todo-list-app">
  <ol>
    <!--
      Ahora proporcionamos cada todo-item con el objeto todo
      que está representando, por lo que su contenido puede
      ser dinámico.
      También necesitamos proporcionar cada componente con una "key",
      lo cual explicaremos luego.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```js
const TodoList = {
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Vegetables' },
        { id: 1, text: 'Cheese' },
        { id: 2, text: 'Whatever else humans are supposed to eat' }
      ]
    }
  }
}

const app = Vue.createApp(TodoList)

app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})

app.mount('#todo-list-app')
```

<common-codepen-snippet title="Intro-Components-1" slug="VwLxeEz" />

Este es un ejemplo inventado, pero hemos logrado separar nos aplicación en dos unidades pequeñas, y el hijo está bien desacoplado del padre mediante el uso de la interfaz props. Ahora podemos mejorar nuestro componente`<todo-item>` con plantilla y lógica más compleja sin afectar la aplicación padre.

En una aplicación grande, es necesario dividir toda la aplicación en componentes para hacer el desarrollo manejable. Hablaremos más sobre componentes [más adelante en esta guía](component-basics.html), pero aquí brinadamos un ejemplo(imaginario) de como se vería la plantilla de una aplicación con componentes:

```html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relation to Custom Elements

Puede haber notado que los componentes de Vue son muy similares a  los **Elementos personalizados**, los cuales son una parte de la [Especificación de Componentes Web](https://www.w3.org/wiki/WebComponents/). en efecto, un parte del diseño del componente de Vue(por ejemplo el API de slot) son influido por la especificación antes de que fuera implementado nativamente en los navegadores.

La mayor diferencia es que el modelo del componente de Vue es diseñado como un parte de un framework coherente que proporciona muchas características adicionales necesarias para construir aplicaciones no trivales, por ejemplo el gestión de plantillas y estados reactivos - ninguno de los dos está cubrido por la especificación.

Vue también proporciona un gran soporte tanto para consumir como para crear elementos personalizados, por más detalles, visite la sección [Vue y Componentes Web](/guide/web-components.html).

## ¿Listo para más?

Hemos introducido brevemente las características más fundamentales del núcleo de Vue.js - el resto de esta guía las cubrirá y otras características avanzadas con detalles más finos, así que asegúrense de leer todo!
