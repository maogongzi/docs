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

Además, cada vez que se actualice el componente padre, todas las _props_ del componente secundario se actualizarán con el último valor. Esto significa que usted **no** debe intentar mutar una _prop_ dentro de un componente secundario. Si lo hace, Vue le advertirá en la consola.

Normalmente hay dos casos en los que es tentador mutar una _prop_:

1. **La _prop_ es utilizado para pasar un valor inicial; el componente secundario desea utilizarlo como una local propiedad de datos más adelante.** En este caso, es mejor definir una local propiedad de datos que utiliza la _prop_ como su valor inicial:

```js
props: ['initialCounter'],
data() {
  return {
    counter: this.initialCounter
  }
}
```

2. **La _prop_ se pasa como un valor crudo que debe transformarse.** En este caso, es mejor definir una propiedad computada utilizando el valor de la _prop_:

```js
props: ['size'],
computed: {
  normalizedSize() {
    return this.size.trim().toLowerCase()
  }
}
```

::: tip Note
Tenga en cuenta que los objetos y las matrices en JavaScript se pasan por referencia, por lo que si la _prop_ es una matriz u objeto, mutar el objeto o la matriz mismo dentro del componente secundario **afectará** el estado del padre.
:::

## Validación de la _Prop_

Los componentes pueden especificar requisitos para sus _props_, como los tipos que ya ha visto. Si no se cumple un requisito, Vue le avisará en la consola de JavaScript del navegador. Esto es especialmente útil cuando se desarrolla un componente que está destinado a ser utilizado por otros.

Para especificar validaciones de _props_, puede proporcionar un objeto con requisitos de validación al valor de `props`, en lugar de una matriz de cadenas de caracteres. Por ejemplo:

```js
app.component('my-component', {
  props: {
    // Comprobación de tipo básico (`null` y `undefined` coincide con cualquier tipo)
    propA: Number,
    // Múltiples tipos posibles
    propB: [String, Number],
    // se requiere cadena de caracteres
    propC: {
      type: String,
      required: true
    },
    // Número con un valor por defecto
    propD: {
      type: Number,
      default: 100
    },
    // Objeto con un valor por defecto
    propE: {
      type: Object,
      // Los valores por defecto del objeto o matriz deben retornarse desde
      // una función de fábrica
      default() {
        return { message: 'hello' }
      }
    },
    // Función de validación personalizada
    propF: {
      validator(value) {
        // El valor debe coincidir con una de estas cadenas de caracteres
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Función con un valor por defecto
    propG: {
      type: Function,
      // A diferencia de los valores por defecto de objetos o matrices, esta no es una función de fábrica - esta es una función para servirse como un valor por defecto.
      default() {
        return 'Función por defecto'
      }
    }
  }
})
```

Cuando falla la validación de _prop_, Vue producirá una advertencia en la consola (si se utiliza la compilación de desarrollo).

::: tip Note
Tenga en cuenta que las _props_ se validan **antes de que** se cree una instancia de componente, por lo que las propiedades de la instancia (p. ej. `data`, `computed`, etc.) no estarán disponibles dentro de las funciones `default` o `validator`.
:::

### Validación de Tipos

La opción `type` puede ser uno de los siguientes constructores nativos:

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

Además, `type` también puede ser una función constructora personalizada y la aserción se realizará con una comprobación de `instanceof`. Por ejemplo, dada la siguiente función constructora:

```js
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

Usted podría utilizar:

```js
app.component('blog-post', {
  props: {
    author: Person
  }
})
```

para validar que el valor de la _prop_ `author` fue creado con `new Person`.

## Formateando las _Props_ (camelCase versus kebab-case)

Los nombres de atributos HTML no distinguen entre mayúsculas y minúsculas, por lo que los navegadores interpretarán los caracteres en mayúscula como en minúscula. Eso significa que cuando utiliza plantillas del DOM, los nombres de _props_ de _camelCase_ necesitan utilizar sus equivalentes de _kebab-case_ (delimitados por guiones):

```js
const app = Vue.createApp({})

app.component('blog-post', {
  // _camelCase_ en JavaScript
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

```html
<!-- kebab-case en HTML -->
<blog-post post-title="hello!"></blog-post>
```

Otra vez, si está utilizando plantillas de cadenas de caracteres, esta limitación no se aplica.
