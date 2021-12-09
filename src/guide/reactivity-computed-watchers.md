# _Computed_ y _Watch_

> Esta sección utiliza el sintaxis de [componente de un solo archivo] para ejemplos de códigos

## Los valores _Computed_

Algunas veces necesitamos un estado que dependa de un otro, en vue, esto es manejado con las [propiedades computadas](computed.html#computed-properties) de los componentes. Para crear un valor computado directamente, podemos utilizar la función `computed`: toma un función de captador y retorna un objeto de [ref](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) reactiva inmutable para el valor retornado desde el captador.

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

Alternativamente, puede tomar un objeto con funciones `get` y `set` para crear un objeto editable de _ref_.

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

### La depuración de _Computed_ <Badge text="3.2+" />

`computed` acepta un segundo argumento con opciones `onTrack` y `onTrigger`:

- `onTrack` será llamado cuando una propiedad reactiva o _ref_ es rastreada como una dependencia.
- `onTrigger` será llamado cuando el _callback_ del observador es disparado por la mutación de una dependencia.

Ambos _callbacks_  recibirán un evento de _debugger_ que contiene información sobre la dependencia en cuestión. Es recomendado poner una declaración `debugger` en estos _callbacks_ para inspeccionar interactivamente la dependencia:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // disparado cuando count.value es rastreado como una dependencia
    debugger
  },
  onTrigger(e) {
    // disparado cuando count.value es mutado
    debugger
  }
})

// al acceder plusOne, se dispararía onTrack
console.log(plusOne.value)

// al mutar count.value, se dispararía onTrigger
count.value++
```

`onTrack` y `onTrigger` solo funcionan en el modo de desarrollo.

## `watchEffect`

Para aplicar y _automáticamente reaplicar_ un efecto secundario basado de estado reactivo, podemos utilizar la función `watchEffect`. Ejecuta una función inmediatamente mientras rastrea sus dependencias reactivamente y la reejecuta siempre y cuando las dependencias sean cambiadas.

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> registra 0

setTimeout(() => {
  count.value++
  // -> registra 1
}, 100)
```

### Detener el Observador

Cuando `watchEffect` es llamado durante la función [setup()](composition-api-setup.html) de un componente o sus [_hooks_ de ciclo de vida](composition-api-lifecycle-hooks.html), el observador es vinculado al ciclo de vida del componente y será detenido automáticamente cuando el componente sea desmontado.

En otros casos, retorna un manejador de detención que pueda ser llamado para explícitamente detener el observador:

```js
const stop = watchEffect(() => {
  /* ... */
})

// luego
stop()
```

### Invalidación de Efectos Secundarios

Algunas veces la función observada de _effect_ realizará efectos secundarios asíncronos que necesitan ser limpiados cuando el _effect_ esté invalidado (es decir, el estado cambia antes de que se hayan completados los _effects_). La función de _effect_ recibe una función `onInvalidate` que pueda ser utilizada para registrar un _callback_ de invalidación. Este _callback_ de invalidación es llamado cuando cuando:

- el _effect_ está a punto de reejecutar
- el observador está detenido (es decir, cuando el componente es desmontado mientras `watchEffect` es utilizada dentro de `setup()` o _hooks_ de ciclo de vida de el)

```js
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id ha cambiado o el observador se ha detenido.
    // invalidar la operación anterior pendiente asíncrono
    token.cancel()
  })
})
```

Estamos registrando el _callback_ de invalidación mediante una función pasada en vez de retornarla del _callback_ porque el valor retornado es importante para la manipulación asíncrona de errores. Es muy común que la función de _effect_ sea una función asíncrona cuando se realiza la recuperación de datos:

```js
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {
    /* ... */
  }) // registramos una función de limpieza antes de que se resuelva el Promise
  data.value = await fetchData(props.id)
})
```

Una función asíncrona implícitamente retorna un Promise, pero la función de limpieza necesita registrarse inmediatamente antes de que se resuelva el Promise. Además, Vue cuenta con el Promise retornado para automáticamente manipular errores potenciales en la cadena de Promise.

### La temporización para tirar de la cadena de los efectos secundarios (Effect Flush Timing)

El sistema de reactividad de Vue amortigua (buffers) los efectos invalidados y tira de la cadena de ellos asincrónicamente para evitar invocaciones repetidas innecesarias cuando hay muchas mutaciones de estado ocurriendo en el mismo "tic (tick)". Internalmente, la función `update` de un componente es también un efecto observado. Cuando un efecto de usuario se ha puesto en cola, es por defecto invocado **antes** todos efectos de `update` de componente:

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  setup() {
    const count = ref(0)

    watchEffect(() => {
      console.log(count.value)
    })

    return {
      count
    }
  }
}
</script>
```

En este ejemplo:

- El _count_ será registrado sincrónicamente en la ejecución inicial.
- Cuando `count` esté mutado, el _callback_ será llamado **antes** de que el componente se haya actualizado.

En casos dónde un _effect_ de observador (watcher effect) necesita reejecutarse **después** de las actualizaciones de componente (es decir, cuando se trabaja con [_refs_ de plantillas](./composition-api-template-refs.md#watching-template-refs)), podemos pasar un objeto adicional `options` con la opción `flush` (cuya valor por defecto es `'pre'`):

```js
// disparar después de las actualizaciones de componente, así que puede acceder el DOM actualizado
// Nota: este también posponerá la ejecución inicial del _effect_ hasta que la
// primera renderización del componente haya terminado
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'post'
  }
)
```

La opción `flush` también acepta `'sync'`, lo cual obliga que el _effect_ siempre dispare sincrónicamente. Este, sin embargo, es ineficiente y rara vez sería necesario.

En Vue >= 3.2.0, se puede también utilizar los alias `watchPostEffect` y `watchSyncEffect` para hacer la intención de código más obvia.

### Watcher Debugging

The `onTrack` and `onTrigger` options can be used to debug a watcher's behavior.

- `onTrack` will be called when a reactive property or ref is tracked as a dependency.
- `onTrigger` will be called when the watcher callback is triggered by the mutation of a dependency.

Both callbacks will receive a debugger event which contains information on the dependency in question. It is recommended to place a `debugger` statement in these callbacks to interactively inspect the dependency:

```js
watchEffect(
  () => {
    /* side effect */
  },
  {
    onTrigger(e) {
      debugger
    }
  }
)
```

`onTrack` and `onTrigger` only work in development mode.

## `watch`

The `watch` API is the exact equivalent of the component [watch](computed.html#watchers) property. `watch` requires watching a specific data source and applies side effects in a separate callback function. It also is lazy by default - i.e. the callback is only called when the watched source has changed.

- Compared to [watchEffect](#watcheffect), `watch` allows us to:

  - Perform the side effect lazily;
  - Be more specific about what state should trigger the watcher to re-run;
  - Access both the previous and current value of the watched state.

### Watching a Single Source

A watcher data source can either be a getter function that returns a value, or directly a `ref`:

```js
// watching a getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// directly watching a ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### Watching Multiple Sources

A watcher can also watch multiple sources at the same time using an array:

```js
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

However, if you are changing both watched sources simultaneously in the same function, the watcher will be executed only once:

```js{9-13}
setup() {
  const firstName = ref('')
  const lastName = ref('')

  watch([firstName, lastName], (newValues, prevValues) => {
    console.log(newValues, prevValues)
  })

  const changeValues = () => {
    firstName.value = 'John'
    lastName.value = 'Smith'
    // logs: ["John", "Smith"] ["", ""]
  }

  return { changeValues }
}
```

Note that multiple synchronous changes will only trigger the watcher once.

It is possible to force the watcher to trigger after every change by using the setting `flush: 'sync'`, though that isn't usually recommended. Alternatively, [nextTick](/api/global-api.html#nexttick) can be used to wait for the watcher to run before making further changes. e.g.:

```js
const changeValues = async () => {
  firstName.value = 'John' // logs: ["John", ""] ["", ""]
  await nextTick()
  lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
}
```

### Watching Reactive Objects

Using a watcher to compare values of an array or object that are reactive requires that it has a copy made of just the values.

```js
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
```

Attempting to check for changes of properties in a deeply nested object or array will still require the `deep` option to be true:

```js
const state = reactive({
  id: 1,
  attributes: {
    name: ''
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log('not deep', state.attributes.name, prevState.attributes.name)
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log('deep', state.attributes.name, prevState.attributes.name)
  },
  { deep: true }
)

state.attributes.name = 'Alex' // Logs: "deep" "Alex" "Alex"
```

However, watching a reactive object or array will always return a reference to the current value of that object for both the current and previous value of the state. To fully watch deeply nested objects and arrays, a deep copy of values may be required. This can be achieved with a utility such as [lodash.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep)

```js
import _ from 'lodash'

const state = reactive({
  id: 1,
  attributes: {
    name: ''
  }
})

watch(
  () => _.cloneDeep(state),
  (state, prevState) => {
    console.log(state.attributes.name, prevState.attributes.name)
  }
)

state.attributes.name = 'Alex' // Logs: "Alex" ""
```

### Shared Behavior with `watchEffect`

`watch` shares behavior with [`watchEffect`](#watcheffect) in terms of [manual stoppage](#stopping-the-watcher), [side effect invalidation](#side-effect-invalidation) (with `onInvalidate` passed to the callback as the 3rd argument instead), [flush timing](#effect-flush-timing) and [debugging](#watcher-debugging).
