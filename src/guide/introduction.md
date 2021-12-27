# Introducción

::: tip Nota
¿Ya conoce Vue 2 y solo quiere aprender sobre lo nuevo que hay en Vue 3? Visite la [Guía de Migración](/guide/migration/introduction.html)!
:::

## ¿Qué es Vue.js?

Vue (pronunciado /vjuː/, como **view**) es un **framework progresivo** para la construcción de interfaces de usuario. A diferencia de otros frameworks monolíticos, Vue está diseñado desde cero para ser adoptable incrementalmente. La libreía base está enfocada solo en la capa de vista, y es fácil integrarla con otras librerías o proyectos existentes. Por otro lado, Vue es también perfectamente capaz de impulsar Single-Page Aplicaciones sofisticados cuando es utilizado en combinación con [herramientas modernas](../guide/single-file-component.html) y [librerías de soporte](https://github.com/vuejs/awesome-vue#components--libraries).

Si a usted le gustaría aprender más sobre Vue antes de adentrarse, nosotros <a id="modal-player" class="vuemastery-trigger"  href="#">creamos un vídeo</a> que lo guiará a través de los principios básicos y un proyecto de ejemplo.

<VideoLesson href="https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3" title="Vea un curso de vídeo gratis de Vue en Vue Mastery">Vea un curso de vídeo gratis de Vue en Vue Mastery</VideoLesson>

<common-vuemastery-video-modal/>

## Empezando

<p>
  <ActionLink class="primary" url="installation.html">
    Instalación
  </ActionLink>
</p>

::: tip
La guía oficial asume un conocimiento intermedio de HTML, CSS y JavaScript. Si usted es completamente nuevo en el desarrollo de frontend, puede que no sea la mejor idea saltar directamente a un framework como su primer paso, ¡aprenda lo básico y luego vuelva! La experiencia previa con otros frameworks ayuda, pero no es requerida.
:::

La más facil manera de probar Vue.js es utilizar el [Ejemplo Hola Mundo](https://codepen.io/team/Vue/pen/KKpRVpx). Siéntase libre de abrirlo en otra pestaña y sígalo mientras vamos a través de algunos ejemplos básicos.

La página de [Instalación](installation.md) proporciona más opciones para instalar Vue. Nota: **No** recomendamos que los principiantes empiecen con `vue-cli`, especialmente si no está familiarizado con las herramientas de construcción basadas de Node.js.

## Renderización Declarativa

En el núcleo de Vue.js se encuentra un sistema que nos permite renderizar datos declarativamente en el DOM utilizando una sintaxis de plantilla sencilla:

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

¡Hemos creado nuestra primera aplicación Vue! Esto luce muy similar a renderizar una plantilla que contiene cadenas de caracteres, pero Vue ha hecho mucho trabajo detrás de escenas. Los datos y el DOM ahora están vinculados, y todo es **reactivo**. ¿Cómo lo sabemos? Vea el ejemplo siguiente donde la propiedad `counter` incrementa cada segundo y verá como cambia el DOM renderizado:

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

Además de la interpolación de texto, podemos también vincular atributos de elementes así:

```html
<div id="bind-attribute">
  <span v-bind:title="message">
    ¡Pase el cursor sobre mí por unos segundos para observar el título mío vinculado dinámicamente!
  </span>
</div>
```

```js
const AttributeBinding = {
  data() {
    return {
      message: 'Cargó esta página en ' + new Date().toLocaleString()
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

En vue, un componente es escencialmente una instancia con opciones predefinidas. Registrar un componente en Vue es sencillo: creamos un objeto componente como hicimos con el objeto `app` y lo definimos en la opción `components` en su padre:

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
const TodoItem = {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
}
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
const TodoItem = {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
}

const TodoList = {
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Verduras' },
        { id: 1, text: 'Queso' },
        { id: 2, text: 'Cualquiera otra cosa que se supone que coman los humanos' }
      ]
    }
  },
  components: {
    TodoItem
  }
}

const app = Vue.createApp(TodoList)

app.mount('#todo-list-app')
```

<common-codepen-snippet title="Intro-Components-1" slug="VwLxeEz" />

Este es un ejemplo inventado, pero hemos logrado separar nos aplicación en dos unidades pequeñas, y el hijo está bien desacoplado del padre mediante el uso de la interfaz props. Ahora podemos mejorar nuestro componente `<todo-item>` con una plantilla y lógica más compleja sin afectar la aplicación padre.

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

### Relación a Elementos Personalizados

Puede haber notado que los componentes de Vue son muy similares a  los **Elementos Personalizados**, los cuales son una parte de la [Especificación de Componentes Web](https://www.w3.org/wiki/WebComponents/). en efecto, un parte del diseño del componente de Vue(por ejemplo el API de slot) son influido por la especificación antes de que fuera implementado nativamente en los navegadores.

La mayor diferencia es que el modelo del componente de Vue es diseñado como un parte de un framework coherente que proporciona muchas características adicionales necesarias para construir aplicaciones no trivales, por ejemplo el gestión de plantillas y estados reactivos - ninguno de los dos está cubrido por la especificación.

Vue también proporciona un gran soporte tanto para consumir como para crear elementos personalizados, por más detalles, visite la sección [Vue y Componentes Web](/guide/web-components.html).

## ¿Listo para más?

Hemos introducido brevemente las características más fundamentales del núcleo de Vue.js - el resto de esta guía las cubrirá y otras características avanzadas con detalles más finos, así que asegúrense de leer todo!
