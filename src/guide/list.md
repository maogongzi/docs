# Renderización de lista

<VideoLesson href="https://vueschool.io/lessons/list-rendering-in-vue-3?friend=vuejs" title="Aprender cómo renderizar listas en Vue School">Aprender cómo renderizar listas con una lección gratis en Vue School</VideoLesson>

## Mapear una matriz a elementos con v-for

Podemos utilizar la directiva `v-for` para renderizar una lista de elementos basada en una matriz. La directiva `v-for` requiere una sintaxis especial en forma de `item in items`, donde los `items` son la matriz de datos de origen y el `item` es un **alias** para el elemento de matriz que se está iterando:

```html
<ul id="array-rendering">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

```js
Vue.createApp({
  data() {
    return {
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  }
}).mount('#array-rendering')
```

Resultado:

<common-codepen-snippet title="v-for con matriz" slug="VwLGbwa" tab="js,result" :preview="false" />

Dentro de los bloques `v-for` tenemos acceso completo a las propiedades del alcance del padre. `v-for` también soporta un segundo argumento opcional para el índice del elemento actual.

```html
<ul id="array-with-index">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```js
Vue.createApp({
  data() {
    return {
      parentMessage: 'Parent',
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  }
}).mount('#array-with-index')
```

Resultado:

<common-codepen-snippet title="v-for con matriz y índice" slug="wvaEdBP" tab="js,result" :preview="false" />

También puede utilizar `of` como delimitador en lugar de `in`, de modo que esté más cerca de la sintaxis de JavaScript para los iteradores:

```html
<div v-for="item of items"></div>
```

## `v-for` con un Objeto

También puede utilizar `v-for` para iterar a través de las propiedades de un objeto.

```html
<ul id="v-for-object" class="demo">
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

```js
Vue.createApp({
  data() {
    return {
      myObject: {
        title: 'Cómo manipular las listas en in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}).mount('#v-for-object')
```

Resultado:

<common-codepen-snippet title="v-for con Objeto" slug="NWqLjqy" tab="js,result" :preview="false" />

También puede proporcionar un segundo argumento para el nombre de la propiedad:

You can also provide a second argument for the property's name (también conocido como clave):

```html
<li v-for="(value, name) in myObject">
  {{ name }}: {{ value }}
</li>
```

<common-codepen-snippet title="v-for con Objeto y clave" slug="poJOPjx" tab="js,result" :preview="false" />

Y otro para el índice:

```html
<li v-for="(value, name, index) in myObject">
  {{ index }}. {{ name }}: {{ value }}
</li>
```

<common-codepen-snippet title="v-for con clave de Objeto y índice" slug="abOaWdo" tab="js,result" :preview="false" />

:::tip Note
Al iterar sobre un objeto, el orden es basado en el orden de enumeración de claves de `Object.keys()`, lo que no se garantiza que sea consistente en todas las implementaciones del motor de JavaScript.
:::

## Mantener Estados

Cuando Vue está actualizando una lista de elementos renderizados por `v-for`, por defecto utiliza una estrategia "parchear in situ". Si el orden de los elementos de dato ha cambiado, en vez de mover los elementos DOM para que coinciden con el orden de los elementos de dato, Vue parcheará cada elemento in situ y se asegurará de que refleje lo que debe renderizarse en el índice particular.

Este modo por defecto es eficiente, pero **solo es adecuado cuando la salida de la renderización de su lista no se base en el estado del componente secundario o el estado temporal de DOM (por ejemplo, valores de entrada de formulario)**.

Para proporcionar a Vue una sugerencia para que pueda rastrear la identidad de cada nodo y, por lo tanto, reutilizar y reordenar los elementos existentes, debe proporcionar un atributo `key` único para cada elemento:

```html
<div v-for="item in items" :key="item.id">
  <!-- contenido -->
</div>
```

[Se recomienda](/style-guide/#keyed-v-for-essential) proporcionar una `key` a `v-for` siempre que sea posible, a menos que el contenido DOM iterado sea simple, o esté confiando intencionalmente en el comportamiento por defecto para obtener ganancias en el rendimiento.

Como es un mecanismo genérico para Vue para identificar nodos, la `key` también tiene otros usos que no están específicamente vinculados a `v-for`, como veremos más adelante en la guía.

:::tip Note
No utilice valores no primitivos como objetos y matrices como claves de `v-for`. Utilice cadena de caracteres o valores numéricos en su lugar.
:::

Para usos detallados del atributo `key`, véase el [documentación de API de `key`](../api/special-attributes.html#key).

## Detección de cambios en Matriz

### Métodos de Mutación

Vue envuelve los métodos de mutación de una matriz observada para que también activen las actualizaciones de vista. Los métodos envueltos son:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Puede abrir la consola y probar con la matriz de `items` de los ejemplos anteriores llamando a sus métodos de mutación. Por ejemplo: `example1.items.push({ message: 'Baz' })`.

### Reemplazar una Matriz

Métodos de mutación, como su nombre indica, muta la matriz original por la que son llamados. En comparación, hay también métodos que no mutan, por ejemplo `filter()`, `concat()` y `slice()`, los que no mutan la matriz original pero **siempre retornan una nueva matriz**. Cuando trabaje con métodos que no mutan, puede reemplazar la matriz vieja con la nueva:

```js
example1.items = example1.items.filter(item => item.message.match(/Foo/))
```

Podría pensar que esto hará que Vue elimine el DOM existente y vuelva a renderizar la lista completa; afortunadamente, ese no es el caso. Vue implementa algunas heurísticas inteligentes para maximizar la reutilización de elementos DOM, por lo tanto, reemplazar una matriz con otra matriz que contenga objetos superpuestos es una operación muy eficiente.

## Mostrando Resultados Filtrados/Ordenados

A veces, queremos mostrar una versión filtrada u ordenada de una matriz sin mutar o restablecer los datos originales. En este caso, puede crear una propiedad computada que retorna la matriz filtrada u ordenada.

Por ejemplo:

```html
<li v-for="n in evenNumbers" :key="n">{{ n }}</li>
```

```js
data() {
  return {
    numbers: [ 1, 2, 3, 4, 5 ]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(number => number % 2 === 0)
  }
}
```

En situaciones donde las propiedades computadas no son factibles (por ejemplo, dentro de los bucles `v-for` anidados), puede utilizar un método:

```html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
</ul>
```

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

## `v-for` con un Rango

`v-for` también puede tomar un entero. En este caso repetirá la plantilla de las mismas veces del entero.

```html
<div id="range" class="demo">
  <span v-for="n in 10" :key="n">{{ n }} </span>
</div>
```

Resultado:

<common-codepen-snippet title="v-for con un rango" slug="NWqLjNY" tab="html,result" />

## `v-for` en un `<template>`

De forma similar a la plantilla `v-if`, también puede utilizar una etiqueta `<template>` con `v-for` para renderizar un bloque de varios elementos. Por ejemplo:

```html
<ul>
  <template v-for="item in items" :key="item.msg">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` con `v-if`

:::tip
Tenga en cuenta que **no** se recomienda utilizar `v-if` y `v-for` juntos. Consulte [la guía de estilo](../style-guide/#avoid-v-if-with-v-for-essential) por más detalles.
:::

Cuando existen en el mismo nodo, `v-if` tiene una prioridad más alta que `v-for`. Eso significa que el condición de `v-if` no tendrá acceso a variables del alcance del `v-for`:

```html
<!-- Esto arrojará un error porque la propiedad "todo" no es definida en la instancia. -->

<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Esto puede ser arreglado mediante mover `v-for` a una etiqueta envoltura `<template>`:

```html
<template v-for="todo in todos" :key="todo.name">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## `v-for` con un Componente

> Esta sección asume el conocimiento de [Components](component-basics.md). Siéntese libre de saltearlo y volver más tarde.

Puede utilizar `v-for` directamente en un componente personalizado, como cualquier elemento normal:

```html
<my-component v-for="item in items" :key="item.id"></my-component>
```

Sin embargo, esto no pasará automáticamente ningún dato al componente, porque los componentes tienen sus propios alcances aislados. Para pasar los datos iterados al componente, también debemos utilizar _props_:

```html
<my-component
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
></my-component>
```

La razón para no inyectar automáticamente el `item` en el componente es porque hace que el componente esté estrechamente acoplado a cómo funciona `v-for`. Ser explícito acerca de dónde provienen sus datos hace que el componente sea reutilizable en otras situaciones.

Aquí hay un ejemplo completo de una lista de tareas sencilla:

```html
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Agregar tarea</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="P. ej. Alimentar al gato"
    />
    <button>Agregar</button>
  </form>
  <ul>
    <todo-item
      v-for="(todo, index) in todos"
      :key="todo.id"
      :title="todo.title"
      @remove="todos.splice(index, 1)"
    ></todo-item>
  </ul>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      newTodoText: '',
      todos: [
        {
          id: 1,
          title: 'Lavar los platos'
        },
        {
          id: 2,
          title: 'Sacar la basura'
        },
        {
          id: 3,
          title: 'Cortar el césped'
        }
      ],
      nextTodoId: 4
    }
  },
  methods: {
    addNewTodo() {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})

app.component('todo-item', {
  template: `
    <li>
      {{ title }}
      <button @click="$emit('remove')">Eliminar</button>
    </li>
  `,
  props: ['title'],
  emits: ['remove']
})

app.mount('#todo-list-example')
```

<common-codepen-snippet title="v-for con componentes" slug="abOaWpz" tab="js,result" :preview="false" />
