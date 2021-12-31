# APIs de Reactividad Básicas

> Esta sección utiliza la sintaxis de [componentes de un solo archivo](../guide/single-file-component.html) para ejemplos de código

## `reactive`

Retorna una copia reactiva del objeto.

```js
const obj = reactive({ count: 0 })
```

La conversión reactiva es "profunda", afecta todas propiedades anidadas. En la implementación basada de [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), el proxy retornado **no** es igual al objeto original. Es recomendado trabajar exclusivamente con el proxy reactivo y evitar depender del objeto original. 

**Tipar:**

```ts
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

::: tip Note
`reactive` desenvolverá todas [refs](./refs-api.html#ref) profundas. mientras mantendrá la reactividad de la _ref_

```ts
const count = ref(1)
const obj = reactive({ count })

// la ref será desenvuelta
console.log(obj.count === count.value) // true

// actualizará `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// it will also update `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

:::

::: warning Important
Cuando asigna una [ref](./refs-api.html#ref) a una propiedad `reactiva`, esa _ref_ será automáticamente desenvuelta. 

```ts
const count = ref(1)
const obj = reactive({})

obj.count = count

console.log(obj.count) // 1
console.log(obj.count === count.value) // true
```

:::

## `readonly`

Toma un objeto (reactivo o plano) o una [ref](./refs-api.html#ref) y retorna un proxy de solo lectura al original. Un proxy de solo lectura es profundo: cualquiera propiedad anidada accesada será también de solo lectura.

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // funciona para el seguimiento de reactividad
  console.log(copy.count)
})

// mutar el original disparará observadores que dependan de la copia
original.count++

// mutar la copia fallará y resultará una advertencia
copy.count++ // ¡advertencia!
```

Como con [`reactive`](#reactive), si cualquiera propiedad utiliza una `ref`, será desenvuelta automáticamente cuando sea accesada mediante el proxy:

```js
const raw = {
  count: ref(123)
}

const copy = readonly(raw)

console.log(raw.count.value) // 123
console.log(copy.count) // 123
```

## `isProxy`

Comproba si un objeto es un proxy creado por [`reactive`](#reactive) o [`readonly`](#readonly).

## `isReactive`

Comproba si un objeto es un proxy reactivo creado por [`reactive`](#reactive).

```js
import { reactive, isReactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    console.log(isReactive(state)) // -> true
  }
}
```

También retorna `true` si el proxy es creado por [`readonly`](#readonly), pero está envolviendo otro proxy creado por [`reactive`](#reactive).

```js{7-15}
import { reactive, isReactive, readonly } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    // proxy de solo lectura creado desde un objeto plano
    const plain = readonly({
      name: 'Mary'
    })
    console.log(isReactive(plain)) // -> false

    // proxy de solo lectura creado desde un proxy reactivo
    const stateCopy = readonly(state)
    console.log(isReactive(stateCopy)) // -> true
  }
}
```

## `isReadonly`

Comproba is un objeto es un proxy de solo lectura creado por [`readonly`](#readonly).

## `toRaw`

Retorna el objeto crudo y original de un proxy de [`reactive`](#reactive) o [`readonly`](#readonly). Este es una salida de emergencia que puede ser utilizado para temporalmente leer sin incurrir con los gastos generales que provienen del acceso/seguimiento del proxy o escribir sin disparar cambios. **No** es recomendado mantener una referencia persistente al objeto original. Utilízalo con precaución.

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## `markRaw`

Marca un objeto para que nunca será convertido a un proxy. Retorna el objeto mísmo.

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// también funciona cuando está anidado dentro de otros objetos reactivos
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

::: warning
`markRaw` y las APIs _shallowXXX_ abajo le permiten selectivamente dejar la conversión por defecto de reactividad o de solo lectura, y incorporar objetos crudos, no son envueltos por _proxies_ en su gráfico de estados. Pueden ser utilizadas para varias razones:

- Algunos valores siempre no se deben hacerse reactivos. por ejemplo una instancia compleja de clase de tercera, o un objeto de componente Vue.

- Saltar la conversión de proxy puede proveer mejoras de rendimiento cuando se rendericen grandes listas con fuentes de dato inmutables.

Son consideradas avanzadas porque la exclusión cruda (raw opt-out) solo funciona en el nivel superior, así si establece un objeto crudo, anidado y sin marcado en un objeto reactivo y luego le accede de nuevo, obtiene la versión con proxy. Este puede conducir a **peligros de identidad (identity hazards)**, es decir, realiza una operación que dependa de un objeto mísmo pero utiliza juntos la versión cruda y la versión con proxy del mismo objeto:

```js
const foo = markRaw({
  nested: {}
})

const bar = reactive({
  // aunque `foo` es marcado como crudo, foo.nested no es lo mismo.
  nested: foo.nested
})

console.log(foo.nested === bar.nested) // false
```

Los peligros de identidad son raros generalmente. Sin embargo, para utilizar estas APIs de forma adecuada mientras evitar peligros de identidad con seguridad requiere un conocimiento sólido de cómo se funcione el sistema de reactividad.
:::

## `shallowReactive`

Crea un proxy reactivo que rastree la reactividad de sus propias propiedades pero no realice conversiones reactivas profundas de objetos anidados (expone valores crudos).

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// es reactivo mutar las propias propiedades de _state_
state.foo++
// ...pero no es así para los objetos anidados
isReactive(state.nested) // false
state.nested.bar++ // no es reactivo
```

No es igual a [`reactive`](#reactive), cualquiera propiedad que utiliza una [`ref`](/api/refs-api.html#ref) **no** será desenvuelta automáticamente por el proxy.

## `shallowReadonly`

Crea un proxy que haga que sus propias propiedades a solo lectura, pero no realice conversión profunda de solo lectura a objetos anidados (expone valores crudos).

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// fallará mutar las propias propiedades de _state_
state.foo++
// ...pero funciona con objetos anidados
isReadonly(state.nested) // false
state.nested.bar++ // funciona
```

No es igual a [`readonly`](#readonly), cualquiera propiedad que utiliza una [`ref`](/api/refs-api.html#ref) **no** será desenvuelta automáticamente por el proxy.
