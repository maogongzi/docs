# _Props_

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

<VideoLesson href="https://vueschool.io/lessons/vue-3-reusable-components-with-props?friend=vuejs" title="Lección gratis sobre props de componente de Vue.js">Aprender cómo funciona las _props_ de componente con una lección gratis en Vue School</VideoLesson>

## Tipos de _Prop_

Hasta ahora, solo hemos visto las _props_ listadas como una matriz de cadenas de caracteres:

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

Sin embargo, por lo general, querrá que cada _prop_ sea un tipo específico de valor. En estos casos, puede enumerar las _props_ como un objeto, donde los nombres y valores de las propiedades de este objeto contienen los nombres y tipos de las _props_, respectivamente:

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // o cualquier otro constructor
}
```

Esto no solo documenta su componente, sino que también advertirá a los usuarios en la consola de JavaScript del navegador si se está pasando el tipo incorrecto. Aprenderá mucho más sobre [verificaciones de tipos y otras validaciones de _props_](#prop-validation) más adelante en esta página.

## Pasar _props_ estáticas o dinámicas 

Hasta ahora, ha visto que las _props_ pasaban un valor estático, como en:

```html
<blog-post title="My journey with Vue"></blog-post>
```

También ha visto _props_ asignadas dinámicamente con `v-bind` o su abreviatura, el carácter `:`, como en:

```html
<!-- Asigna dinámicamente el valor de una variable -->
<blog-post :title="post.title"></blog-post>

<!-- Asigna dinámicamente el valor de una expresión compleja. -->
<blog-post :title="post.title + ' por ' + post.author.name"></blog-post>
```

En los dos ejemplos anteriores, pasamos valores de cadena de caracteres, pero _cualquier_ tipo de valor se puede pasar a una _prop_.

### Pasar un número

```html
<!-- Aunque `42` es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de caracteres. -->
<blog-post :likes="42"></blog-post>

<!-- Asigna dinámicamente el valor de una variable. -->
<blog-post :likes="post.likes"></blog-post>
```

### Pasar un booleano

```html
<!-- Incluir la prop sin valor implicará `true` -->
<!-- Si no asigna Boolean al tipo de is-published en props, será una cadena de caracteres vacía en vez del valor "true" -->
<blog-post is-published></blog-post>

<!-- Aunque `false` es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de caracteres. -->
<blog-post :is-published="false"></blog-post>

<!-- Asigna dinámicamente el valor de una variable. -->
<blog-post :is-published="post.isPublished"></blog-post>
```

### Pasar una matriz

```html
<!-- Aunque la matriz es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de caracteres. -->
<blog-post :comment-ids="[234, 266, 273]"></blog-post>

<!-- Asigna dinámicamente el valor de una variable. -->
<blog-post :comment-ids="post.commentIds"></blog-post>
```

### Pasar un objeto

```html
<!-- Aunque el objeto es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de caracteres. -->
<blog-post
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- Asigna dinámicamente el valor de una variable. -->
<blog-post :author="post.author"></blog-post>
```

### Pasar las propiedades de un objeto

Si desea pasar todas las propiedades de un objeto como _props_, puede usar `v-bind` sin un argumento (`v-bind` en lugar de `:prop-name`). Por ejemplo, dado un objeto `post`:

```js
post: {
  id: 1,
  title: 'Mi viaje con vue'
}
```

La siguiente plantilla:

```html
<blog-post v-bind="post"></blog-post>
```

Será equivalente a:

```html
<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

## Flujo de datos de una sola dirección

Todas las _props_ forman una **vinculación de una sola dirección** entre la propiedad del hijo y la de su padre: cuando la propiedad del padre se actualice, fluirá hacia el hijo, pero no al revés. Esto evita que los componentes secundarios muten accidentalmente el estado de los padres, lo que puede hacer que el flujo de datos de su aplicación sean más difíciles de entender.

In addition, every time the parent component is updated, all props in the child component will be refreshed with the latest value. This means you should **not** attempt to mutate a prop inside a child component. If you do, Vue will warn you in the console.

There are usually two cases where it's tempting to mutate a prop:

1. **The prop is used to pass in an initial value; the child component wants to use it as a local data property afterwards.** In this case, it's best to define a local data property that uses the prop as its initial value:

```js
props: ['initialCounter'],
data() {
  return {
    counter: this.initialCounter
  }
}
```

2. **The prop is passed in as a raw value that needs to be transformed.** In this case, it's best to define a computed property using the prop's value:

```js
props: ['size'],
computed: {
  normalizedSize() {
    return this.size.trim().toLowerCase()
  }
}
```

::: tip Note
Note that objects and arrays in JavaScript are passed by reference, so if the prop is an array or object, mutating the object or array itself inside the child component **will** affect parent state.
:::

## Prop Validation

Components can specify requirements for their props, such as the types you've already seen. If a requirement isn't met, Vue will warn you in the browser's JavaScript console. This is especially useful when developing a component that's intended to be used by others.

To specify prop validations, you can provide an object with validation requirements to the value of `props`, instead of an array of strings. For example:

```js
app.component('my-component', {
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    propA: Number,
    // Multiple possible types
    propB: [String, Number],
    // Required string
    propC: {
      type: String,
      required: true
    },
    // Number with a default value
    propD: {
      type: Number,
      default: 100
    },
    // Object with a default value
    propE: {
      type: Object,
      // Object or array defaults must be returned from
      // a factory function
      default() {
        return { message: 'hello' }
      }
    },
    // Custom validator function
    propF: {
      validator(value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Function with a default value
    propG: {
      type: Function,
      // Unlike object or array default, this is not a factory function - this is a function to serve as a default value
      default() {
        return 'Default function'
      }
    }
  }
})
```

When prop validation fails, Vue will produce a console warning (if using the development build).

::: tip Note
Note that props are validated **before** a component instance is created, so instance properties (e.g. `data`, `computed`, etc) will not be available inside `default` or `validator` functions.
:::

### Type Checks

The `type` can be one of the following native constructors:

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

In addition, `type` can also be a custom constructor function and the assertion will be made with an `instanceof` check. For example, given the following constructor function exists:

```js
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

You could use:

```js
app.component('blog-post', {
  props: {
    author: Person
  }
})
```

to validate that the value of the `author` prop was created with `new Person`.

## Prop Casing (camelCase vs kebab-case)

HTML attribute names are case-insensitive, so browsers will interpret any uppercase characters as lowercase. That means when you're using in-DOM templates, camelCased prop names need to use their kebab-cased (hyphen-delimited) equivalents:

```js
const app = Vue.createApp({})

app.component('blog-post', {
  // camelCase in JavaScript
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

```html
<!-- kebab-case in HTML -->
<blog-post post-title="hello!"></blog-post>
```

Again, if you're using string templates, this limitation does not apply.
