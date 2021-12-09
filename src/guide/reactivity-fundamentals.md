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
Si no quiere acceder la instancia actual del objeto, puede envolverla en un `reactive`:

```js
nested: reactive({
  count
})
```
:::

### El Acceso en Objetos Reactivos

Cuando una `ref` es accesada o mutada como una propiedad d un objeto reactivo, se desenvolve automáticamente al valor internal, así que se comporte como una propiedad normal:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Si una nueva _ref_ es asignada a una propiedad vinculada a una _ref_ existente, reemplazará la _ref_ vieja:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```
El desembalaje de _ref_ solo ocurre cuando se encuentre anidada dentro de un `Object` reactivo. Eso no ocurrirá cuando la _ref_ es accesada de un `Array` o un tipo nativo de conjunto como [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):

```js
const books = reactive([ref('Vue 3 Guide')])
// requiere .value aquí
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// requiere .value aquí
console.log(map.get('count').value)
```

## Desestructurar Estado Reactivo

Cuando queramos utilizar unas propiedades del gran objeto reactivo, sería tentador utilizar [desestructuración de ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para obtener propiedades que queramos:

```js
import { reactive } from 'vue'

const book = reactive({
  author: 'El equipo Vue',
  year: '2020',
  title: 'La guía de Vue 3',
  description: 'Está leyendo este libro ahora mismo ;)',
  price: 'gratis'
})

let { author, title } = book
```

Desafortunadamente, con tal desestructuración las reactividaded para ambos propiedades serían perdidas. Para tal caso, necesitamos convertir nuestro objeto reactivo a un conjunto de _refs_. Estas _refs_ mantendrán la conexión reactiva al objeto de la fuente:

```js
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'El equipo Vue',
  year: '2020',
  title: 'La guía de Vue 3',
  description: 'Está leyendo este libro ahora mismo ;)',
  price: 'gratis'
})

let { author, title } = toRefs(book)

title.value = 'La guía detallada de Vue 3' // necesitamos utilizar .value debido a que _title_ ahora es una _ref_
console.log(book.title) // 'La guía detallada de Vue 3'
```

Puede aprender más sobre `refs` en la sección [API de _Refs_](../api/refs-api.html#ref)

## Prevenir Mutar Objetos Reactivos con `readonly`

Algunas veces queremos rastrear cambios del objeto reactivo (`ref` o `reactive`) pero también queremos prevenir cambiarlo de un cierto lugar de la aplicación. Por ejemplo, cuando tenemos un objeto reactivo [proporcionado (provided)](component-provide-inject.html), queremos prevenir mutarlo dónde esté inyectado. Para hacer esto, podemos crear un _proxy_ de solo lectura (readonly) al objeto original:

```js
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

const copy = readonly(original)

// mutar el objeto original disparará observadores que dependan de la copia
original.count++

// mutar la copia fallará y resultará en una advertencia
copy.count++ // warning: "Set operation on key 'count' failed: target is readonly."
```
