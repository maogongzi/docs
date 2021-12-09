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

### Side Effect Invalidation

Sometimes the watched effect function will perform asynchronous side effects that need to be cleaned up when it is invalidated (i.e. state changed before the effects can be completed). The effect function receives an `onInvalidate` function that can be used to register an invalidation callback. This invalidation callback is called when:

- the effect is about to re-run
- the watcher is stopped (i.e. when the component is unmounted if `watchEffect` is used inside `setup()` or lifecycle hooks)

```js
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id has changed or watcher is stopped.
    // invalidate previously pending async operation
    token.cancel()
  })
})
```

We are registering the invalidation callback via a passed-in function instead of returning it from the callback because the return value is important for async error handling. It is very common for the effect function to be an async function when performing data fetching:

```js
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {
    /* ... */
  }) // we register cleanup function before Promise resolves
  data.value = await fetchData(props.id)
})
```

An async function implicitly returns a Promise, but the cleanup function needs to be registered immediately before the Promise resolves. In addition, Vue relies on the returned Promise to automatically handle potential errors in the Promise chain.

### Effect Flush Timing

Vue's reactivity system buffers invalidated effects and flushes them asynchronously to avoid unnecessary duplicate invocation when there are many state mutations happening in the same "tick". Internally, a component's `update` function is also a watched effect. When a user effect is queued, it is by default invoked **before** all component `update` effects:

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

In this example:

- The count will be logged synchronously on initial run.
- When `count` is mutated, the callback will be called **before** the component has updated.

In cases where a watcher effect needs to be re-run **after** component updates (i.e. when working with [Template Refs](./composition-api-template-refs.md#watching-template-refs)), we can pass an additional `options` object with the `flush` option (default is `'pre'`):

```js
// fire after component updates so you can access the updated DOM
// Note: this will also defer the initial run of the effect until the
// component's first render is finished.
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'post'
  }
)
```

The `flush` option also accepts `'sync'`, which forces the effect to always trigger synchronously. This is however inefficient and should be rarely needed.

In Vue >= 3.2.0, `watchPostEffect` and `watchSyncEffect` aliases can also be used to make the code intention more obvious.

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
