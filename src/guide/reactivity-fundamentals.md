# Los Fundamentos de Reactividad

> Esta sección utiliza el sintaxis de [componente de un solo archivo] para ejemplos de códigos

## Declarar Estado Reactivo

Para crear un estado reactivo desde un objeto JavaScript, podemos utilizar el método `reactive`:

```js
import { reactive } from 'vue'

// estado reactivo
const state = reactive({
  count: 0
})
```

El método `reactive` es el equivalente de la API `Vue.observable()` en Vue 2.x, renombrado para evitar confusión con _RxJS observables_. Aquí, el estado retornado es un objeto reactivo. La conversión es "profundo", afecta todas propiedades anidadas del objeto pasado.

El caso de uso esencial para estado reactivo en Vue es que podemos utilizarlo durante la renerización. Gracias al seguimiento de dependencias, la vista se actualiza automáticamente cuando el estado reactivo se cambie.

Esto es la quintaesencia del sistema de reactividad de Vue. Cuando retorna un objeto desde `data()` de un componente, se ha hecho internalmente reactivo mediante `reactive()`. La plantilla es compilada a una [función _render_](render-function.html) que utilice estas propiedades reactivas.

Puede aprender más sobre `reactive` en la sección [Básico de la API de Reactividad](../api/basic-reactivity.html)

## Crear valores reactivos individuales como `refs`

Imagine el caso dónode tengamos un valor primitivo individual (por ejemplo, una cadena de caracteres) y querramos hacerlo reactivo. Por supuesto, podríamos hacer un objeto con una sóla propiedad igual a nuestra cadena de caracteres, y la pasamos a `reactive`. Vue tiene un método que hará el mismo para nosotros, es la `ref`:

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref` retornará un objeto reactivo y mutable que servirá como una referencia reactiva de **ref** para el valor internal que posea, es el lugar dónde el nombre viene. Este objeto contiene la sóla propiedad nombrada `value`:

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

### Desenvolver una Ref

Cuando una _ref_ es retornada como una propiedad en el contexto de renderización (el objeto retornado de [setup()](composition-api-setup.html))) y accesada en la plantilla, se desenvolve automáticamente con poca profundidad (shallow unwraps) el valor internal. Solo la _ref_ anidada requerirá `.value` en la plantilla:

```vue-html
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Incrementar la suma</button>
    <button @click="nested.count.value ++">Incrementar la suma anidada</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count,

        nested: {
          count
        }
      }
    }
  }
</script>
```

:::tip
If you don't want to access the actual object instance, you can wrap it in a `reactive`:

```js
nested: reactive({
  count
})
```
:::

### Access in Reactive Objects

When a `ref` is accessed or mutated as a property of a reactive object, it automatically unwraps to the inner value so it behaves like a normal property:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

If a new ref is assigned to a property linked to an existing ref, it will replace the old ref:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```

Ref unwrapping only happens when nested inside a reactive `Object`. There is no unwrapping performed when the ref is accessed from an `Array` or a native collection type like [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):

```js
const books = reactive([ref('Vue 3 Guide')])
// need .value here
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// need .value here
console.log(map.get('count').value)
```

## Destructuring Reactive State

When we want to use a few properties of the large reactive object, it could be tempting to use [ES6 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to get properties we want:

```js
import { reactive } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = book
```

Unfortunately, with such a destructuring the reactivity for both properties would be lost. For such a case, we need to convert our reactive object to a set of refs. These refs will retain the reactive connection to the source object:

```js
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide' // we need to use .value as title is a ref now
console.log(book.title) // 'Vue 3 Detailed Guide'
```

You can learn more about `refs` in the [Refs API](../api/refs-api.html#ref) section

## Prevent Mutating Reactive Objects with `readonly`

Sometimes we want to track changes of the reactive object (`ref` or `reactive`) but we also want prevent changing it from a certain place of the application. For example, when we have a [provided](component-provide-inject.html) reactive object, we want to prevent mutating it where it's injected. To do so, we can create a readonly proxy to the original object:

```js
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

const copy = readonly(original)

// mutating original will trigger watchers relying on the copy
original.count++

// mutating the copy will fail and result in a warning
copy.count++ // warning: "Set operation on key 'count' failed: target is readonly."
```
