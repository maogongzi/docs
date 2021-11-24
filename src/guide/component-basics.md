# Básicos de Componentes

<VideoLesson href="https://vueschool.io/courses/vue-js-3-components-fundamentals?friend=vuejs" title="Curso gratis de componentes de Vue.js">Aprender los básicos de componentes con un curso gratis en Vue School</VideoLesson>

## Ejemplo básico

Aquí es un ejemplo de un componente Vue:

```js
// Crear una aplicación Vue
const app = Vue.createApp({})

// Definir un nuevo componente global llamado button-counter
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Me ha hecho clics de {{ count }} veces.
    </button>`
})
```

::: info
Le estámos mostrando un ejemplo sencillo aquí, pero en una aplicación Vue típica utilizamos componentes de un solo archivo (Single File Components) en vez de una plantilla de cadena de caracteres. Puede consultar más información sobre los [en esta sección](single-file-component.html).
:::

Los componentes son instancias reutilizables de Vue con un nombre: en este caso, `<button-counter>`. Podemos utilizar este componente como un elemento personalizado dentro de una instancia raíz:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
app.mount('#components-demo')
```

<common-codepen-snippet title="Básicos de componentes" slug="abORVEJ" tab="js,result" :preview="false" />

Dado que los componentes son instancias reutilizables, aceptan las mismas opciones de una instancia raíz, como `data`, `computed`, `watch`, `methods`, y _hooks_ de ciclo de vida.

## Reutilizar Componentes

Los componentes se pueden reutilizar tantas veces como se desee:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<common-codepen-snippet title="Básicos de componentes: reutilizar componentes" slug="rNVqYvM" tab="result" :preview="false" />

Tenga en cuenta que al hacer clic en los botones, cada uno mantiene su propio `count` por separado. Esto se debe a que cada vez que utiliza un componente, se crea una nueva **instancia** de sí mismo.

## Organización de Componentes

Es común que una aplicación se organice en un árbol de componentes anidados:

![Árbol de Componente](/images/components.png)

Por ejemplo, puede tener componentes para un encabezado, una barra lateral y un área de contenido, cada uno de los cuales generalmente contiene otros componentes para enlaces de navegación, publicaciones de blog, etc.

Para utilizar estos componentes en plantillas, deben registrarse para que Vue los conozca. Existen dos tipos de registro de componentes: **global** y **local**. Hasta ahora, solo hemos registrado componentes globalmente, utilizando el método `component` de nuestra aplicación:

```js
const app = Vue.createApp({})

app.component('my-component-name', {
  // ... opciones ...
})
```

Los componentes registrados globalmente se pueden utilizar en la plantilla de cualquier componente dentro de la aplicación.

Eso es todo lo que necesita saber sobre el registro por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [Registro de Componentes](component-registration.md).

## Pasar datos a componentes secundarios con _Props_

Anteriormente, mencionamos la creación de un componente para publicaciones de blog. El problema es que ese componente no será útil a menos que pueda pasarle datos, como el título y el contenido de la publicación específica que queremos mostrar. Ahí es donde entran las _props_.

Las _props_ son atributos personalizados que puede registrar en un componente. Para pasar un título a nuestro componente de publicación de blog, podemos incluirlo en la lista de _props_ que este componente acepta, usando la opción `props`:

```js
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```
Cuando se pasa un valor a un atributo _prop_, se convierte en una propiedad en esa instancia de componente. El valor de la propiedad es accesible dentro de la plantilla, justo como cualquiera otra propiedad del componente.

Un componente puede tener tantas _props_ como se desee, por defecto, se puede pasar cualquier valor a cualquiera _prop_.

Una vez que se registra un _prop_, puede pasarle datos como un atributo personalizado, de la siguiente manera:

```html
<div id="blog-post-demo" class="demo">
  <blog-post title="Mi viaje con Vue"></blog-post>
  <blog-post title="Blogging con Vue"></blog-post>
  <blog-post title="¿Por qué Vue es tan divertido?"></blog-post>
</div>
```

<common-codepen-snippet title="Básicos de componentes: pasar props" slug="PoqyOaX" tab="result" :preview="false" />

En una aplicación típica, sin embargo, es probable que tenga una matriz de publicaciones en `data`:

```js
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'Mi viaje con Vue' },
        { id: 2, title: 'Blogging con Vue' },
        { id: 3, title: '¿Por qué Vue es tan divertido?' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

Entonces querría renderizar un componente para cada una:

```html
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

Arriba, verá que podemos utilizar `v-bind` para pasar _props_ dinámicamente. Esto es especialmente útil cuando no se conoce el contenido exacto que se va a renderizar con anticipación.

Esto es todo lo que necesita saber sobre _props_ por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [_Props_](component-props.html).

## Escuchar a eventos de componentes secundarios

A medida que desarrollamos nuestro componente `<blog-post>`, es posible que algunas funciones requieran la comunicación hacia el componente padre. Por ejemplo, podemos decidir incluir una característica de accesibilidad para ampliar el texto de las publicaciones del blog, dejando el resto de la página en su tamaño por defecto:

En el padre, podemos soportar esta característica agregando una propiedad `postFontSize` en `data`:

```js
const App = {
  data() {
    return {
      posts: [
        /* ... */
      ],
      postFontSize: 1
    }
  }
}
```

Esta propiedad puede ser utilizado en la plantilla para controlar el tamaño de la fuente de todas las publicaciones del blog:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
    ></blog-post>
  </div>
</div>
```

Ahora agreguemos un botón para ampliar el texto justo antes del contenido de cada publicación:

```js
app.component('blog-post', {
  props: ['title'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button>
        Agrandar texto
      </button>
    </div>
  `
})
```

El problema es que este botón no hace nada:

```html
<button>
   Agrandar texto
</button>
```

Cuando hacemos clic en el botón, debemos comunicar al componente padre que debe agrandar el texto de todas las publicaciones. Para resolver este problema, las instancias componentes proporcionan una sistema de eventos personalizados. El padre puede optar por escuchar a cualquier evento de la instancia del componente secundario con `v-on` o `@`, justo como lo que haríamos con un evento nativo de DOM:

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

Entonces, el componente secundario puede emitir un evento en sí mismo mediante llamar el método integrado [**`$emit`**](../api/instance-methods.html#emit) pasando el nombre del evento:

```html
<button @click="$emit('enlargeText')">
  Enlarge text
</button>
```

Gracias al escuchador `@enlarge-text="postFontSize += 0.1"`, el padre recibirá el evento y actualizará el valor de `postFontSize`.

<common-codepen-snippet title="Básicos de componentes: emitir eventos" slug="KKpGyrp" tab="result" :preview="false" />

We can list emitted events in the component's `emits` option:

```js
app.component('blog-post', {
  props: ['title'],
  emits: ['enlargeText']
})
```

This will allow you to check all the events that a component emits and optionally [validate them](component-custom-events.html#validate-emitted-events).

### Emitting a Value With an Event

It's sometimes useful to emit a specific value with an event. For example, we may want the `<blog-post>` component to be in charge of how much to enlarge the text by. In those cases, we can pass a second parameter to `$emit` to provide this value:

```html
<button @click="$emit('enlargeText', 0.1)">
  Enlarge text
</button>
```

Then when we listen to the event in the parent, we can access the emitted event's value with `$event`:

```html
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

Or, if the event handler is a method:

```html
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

Then the value will be passed as the first parameter of that method:

```js
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Using `v-model` on Components

Custom events can also be used to create custom inputs that work with `v-model`. Remember that:

```html
<input v-model="searchText" />
```

does the same thing as:

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

When used on a component, `v-model` instead does this:

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

::: warning
Please note we used `model-value` with kebab-case here because we are working with in-DOM templates. You can find a detailed explanation on kebab-cased vs camelCased attributes in the [DOM Template Parsing Caveats](#dom-template-parsing-caveats) section
:::

For this to actually work though, the `<input>` inside the component must:

- Bind the `value` attribute to the `modelValue` prop
- On `input`, emit an `update:modelValue` event with the new value

Here's that in action:

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

Now `v-model` should work perfectly with this component:

```html
<custom-input v-model="searchText"></custom-input>
```

Another way of implementing `v-model` within this component is to use the ability of `computed` properties to define a getter and setter. The `get` method should return the `modelValue` property and the `set` method should emit the corresponding event:

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

That's all you need to know about custom component events for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Custom Events](component-custom-events.md).

## Content Distribution with Slots

Just like with HTML elements, it's often useful to be able to pass content to a component, like this:

```html
<alert-box>
  Something bad happened.
</alert-box>
```

Which might render something like:

<common-codepen-snippet title="Component basics: slots" slug="jOPeaob" :preview="false" />

This can be achieved using Vue's custom `<slot>` element:

```js
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

As you'll see above, we use the `<slot>` as a placeholder where we want the content to go – and that's it. We're done!

That's all you need to know about slots for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Slots](component-slots.md).

## Dynamic Components

Sometimes, it's useful to dynamically switch between components, like in a tabbed interface:

<common-codepen-snippet title="Component basics: dynamic components" slug="oNXaoKy" :preview="false" />

The above is made possible by Vue's `<component>` element with the special `is` attribute:

```html
<!-- Component changes when currentTabComponent changes -->
<component :is="currentTabComponent"></component>
```

In the example above, `currentTabComponent` can contain either:

- the name of a registered component, or
- a component's options object

See [this sandbox](https://codepen.io/team/Vue/pen/oNXaoKy) to experiment with the full code, or [this version](https://codepen.io/team/Vue/pen/oNXapXM) for an example binding to a component's options object, instead of its registered name.

You can also use the `is` attribute to create regular HTML elements.

That's all you need to know about dynamic components for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Dynamic & Async Components](./component-dynamic-async.html).

## DOM Template Parsing Caveats

If you are writing your Vue templates directly in the DOM, Vue will have to retrieve the template string from the DOM. This leads to some caveats due to browsers' native HTML parsing behavior.

:::tip
It should be noted that the limitations discussed below only apply if you are writing your templates directly in the DOM. They do NOT apply if you are using string templates from the following sources:

- String templates (e.g. `template: '...'`)
- [Single-file (`.vue`) components](single-file-component.html)
- `<script type="text/x-template">`
:::

### Element Placement Restrictions

Some HTML elements, such as `<ul>`, `<ol>`, `<table>` and `<select>` have restrictions on what elements can appear inside them, and some elements such as `<li>`, `<tr>`, and `<option>` can only appear inside certain other elements.

This will lead to issues when using components with elements that have such restrictions. For example:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

The custom component `<blog-post-row>` will be hoisted out as invalid content, causing errors in the eventual rendered output. We can use the special [`is` attribute](/api/special-attributes.html#is) as a workaround:

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
When used on native HTML elements, the value of `is` must be prefixed with `vue:` in order to be interpreted as a Vue component. This is required to avoid confusion with native [customized built-in elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

### Case Insensitivity

HTML attribute names are case-insensitive, so browsers will interpret any uppercase characters as lowercase. That means when you’re using in-DOM templates, camelCased prop names and event handler parameters need to use their kebab-cased (hyphen-delimited) equivalents:

```js
// camelCase in JavaScript

app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- kebab-case in HTML -->

<blog-post post-title="hello!"></blog-post>
```

That's all you need to know about DOM template parsing caveats for now - and actually, the end of Vue's _Essentials_. Congratulations! There's still more to learn, but first, we recommend taking a break to play with Vue yourself and build something fun.

Once you feel comfortable with the knowledge you've just digested, we recommend coming back to read the full guide on [Dynamic & Async Components](component-dynamic-async.html), as well as the other pages in the Components In-Depth section of the sidebar.
