# _Refs_

> Esta sección utiliza la sintaxis de [componentes de un solo archivo](../guide/single-file-component.html) para ejemplos de código

## `ref`

Toma un valor interno y retorna un objeto reactivo y mutable de _ref_. El objeto de _ref_ tiene una sola propiedad `.value` que apunta al valore interno.

**Ejemplo:**

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

Si un objeto es asignado como el valor de una _ref_, el objeto se hace reactivo profundamente por la función [reactive](./basic-reactivity.html#reactive).

**Tipar:**

```ts
interface Ref<T> {
  value: T
}

function ref<T>(value: T): Ref<T>
```

Algunas veces necesitaríamos especificar tipos complejos para un valor interno de una _ref_. Podemos hacerlo sucintamente mediante pasar un argumento genérico cuando llame `ref` para sobreescribir la inferencia por defecto:

```ts
const foo = ref<string | number>('foo') // el tipo de foo: Ref<string | number>

foo.value = 123 // ok!
```

Si el tipo del genérico es desconocido, es recomendable fundir `ref` a `Ref<T>`:

```ts
function useState<State extends string>(initial: State) {
  const state = ref(initial) as Ref<State> // state.value -> State extiende string
  return state
}
```

## `unref`

Retorna el valor interno si el argumento es una [`ref`](#ref), de lo contrario retorna el argumento mísmo. Este es una función súgar para `val = isRef(val) ? val.value : val`.

```ts
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped está garantizado para ser un número ahora
}
```

## `toRef`

Puede ser utilizado para crear una [`ref`](#ref) para una propiedad en un objeto reactivo original. La _ref_ puede luego ser pasada libremente, reteniendo la conexión a su propiedad original.

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

`toRef` es útil cuando quiere pasar la _ref_ de una _prop_ a una función de composición:

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  }
}
```

`toRef` retornará una _ref_ utilizable incluso si la propiedad original no existe en la actualidad. Este lo hace específicamente útil cuando se trabaja con _props_ opcionales, las que no serían recogidas por [`toRefs`](#torefs).

## `toRefs`

Covierte un objeto reactivo a un objeto plano dónde cada propiedad del objeto resultante es una [`ref`](#ref) que apunte a la propiedad correspondiente del objeto original.

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)
/*
Tipo de stateAsRefs:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// La ref y la propiedad original son "vinculadas"
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

`toRefs` es útil cuando retorna un objeto reactivo desde una función de composición para que el componente que consume las refs pueden desestructurar/extender el objeto retornado sin perder la reactividad:

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // operación lógica en _state_

  // convertirlo a refs al tiempo de retornarlo
  return toRefs(state)
}

export default {
  setup() {
    // puede desestructurarse sin perder reactividad
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar
    }
  }
}
```

`toRefs` solo generará `refs` para propiedades que son incluidas en el objeto original. Para crear una _ref_ para una propiedad específica, utilice [`toRef`](#toref) en su lugar.

## `isRef`

Comprueba si un valor es un objeto de _ref_.

## `customRef`

Crea una _ref_ personalizada con control explícito sobre su seguimiento de dependencias y el disparar de actualizaciones. Espera una función de factoría, la que recibe funciones `track` y `trigger` como argumentos y debe retornar un objeto con `get` y `set`.

- Ejemplo que utiliza una ref personalizada para implementar _debounce_ con `v-model`:

  ```html
  <input v-model="text" />
  ```

  ```js
  function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }

  export default {
    setup() {
      return {
        text: useDebouncedRef('hello')
      }
    }
  }
  ```

**Tipar:**

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

## `shallowRef`

Crea una _ref_ que rastrea su propia mutación de `.value` pero no lo hace reactivo a su valor.

```js
const foo = shallowRef({})
// mutar el valor de la ref es reactivo
foo.value = {}
// pero el valor no será convertido.
isReactive(foo.value) // false
```

**Vea también:** [crear valores reactivos independientes como `refs`](../guide/reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs)

## `triggerRef`

Ejecuta cuaqlquieres efectos vinculados a [`shallowRef`](#shallowref) manualmente.

```js
const shallow = shallowRef({
  greet: 'Hola, mundo'
})

// registra "Hola, mundo" una vez para la primera ejecución
watchEffect(() => {
  console.log(shallow.value.greet)
})

// Este no disparará el efecto porque la ref es _shallow_
shallow.value.greet = 'Hola, universo'

// registra "Hola, universo"
triggerRef(shallow)
```

**Vea también:** [_computed_ y _watch_ - watchEffect](./computed-watch-api.html#watcheffect)
