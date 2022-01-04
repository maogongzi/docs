# _Computed_ y _watch_

> Esta sección utiliza la sintaxis de [componentes de un solo archivo](../guide/single-file-component.html) para ejemplos de código

## `computed`

Toma una función de cargador y retorna un objeto de [ref](./refs-api.html#ref) reactivo inmutable para el valor retornado del cargador.

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

Alternativamente, también toma un objeto con funciones `get` y `set` para crear un objeto de _ref_ escribible.

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

**Tipar:**

```ts
// de solo lectura
function computed<T>(
  getter: () => T,
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// escribible
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>

interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}
```

## `watchEffect`

Ejecuta una función inmediatamente mientras reactivamente rastrea sus dependencias y la reejecuta siempre y cuando las dependencias son cambiados.

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> registra 0

setTimeout(() => {
  count.value++
  // -> registra 1
}, 100)
```

**Tipar:**

```ts
function watchEffect(
  effect: (onInvalidate: InvalidateCbRegistrator) => void,
  options?: WatchEffectOptions
): StopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync' // por defecto: 'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

**Vea también**: [guía de `watchEffect`](../guide/reactivity-computed-watchers.html#watcheffect)

## `watchPostEffect` <Badge text="3.2+" />

Alias para `watchEffect` con opción `flush: 'post'`.

## `watchSyncEffect` <Badge text="3.2+" />

Alias de `watchEffect` con opción `flush: 'sync'`.

## `watch`

La API `watch` es el equivalente exacto de la API de opciones [this.\$watch](./instance-methods.html#watch) (y la opción correspondiente [watch](./options-data.html#watch)). `watch` requiere observar un fuente de dato específico y aplica efectos secundarios en una función de callback separada. También es peresozo por defecto, es decir, el callback es solo llamado cuando el fuente observado haya cambiado.

- Comparado con [watchEffect](#watcheffect), `watch` nos permite:

  - Realizar el efecto secundario perezosamente;
  - Ser más específico sobre qué estado debe dispare el observador para reejecutar;
  - Acceder tanto el valor previo como el actual del estado observado.

### Observar un solo fuente

Un fuente de dato de observación puede ser una función de cargador que retorne un valor, o directamente una [ref](./refs-api.html#ref):

```js
// Observar un cargador
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// directamente observar una ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### Observar múltiples fuentes

Un observador puede también observar múltiples fuentes al mismo tiempo utilizando una matriz:

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### Comportamiento compartido con `watchEffect`

`watch` comparte comportamiento con [`watchEffect`](#watcheffect) en términos de [detención manual](../guide/reactivity-computed-watchers.html#stopping-the-watcher), [invalidación de efecto secundario](../guide/reactivity-computed-watchers.html#side-effect-invalidation) (con `onInvalidate` pasado al callback como el tercero argumento en su lugar), [temporización para tirar de la cadena](../guide/reactivity-computed-watchers.html#effect-flush-timing) y [depuración](../guide/reactivity-computed-watchers.html#watcher-debugging).

**Tipar:**

```ts
// observar un solo fuente
function watch<T>(
  source: WatcherSource<T>,
  callback: (
    value: T,
    oldValue: T,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHandle

// observar múltiples fuentes
function watch<T extends WatcherSource<unknown>[]>(
  sources: T
  callback: (
    values: MapSources<T>,
    oldValues: MapSources<T>,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options? : WatchOptions
): StopHandle

type WatcherSource<T> = Ref<T> | (() => T)

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

// vea los tipos de `watchEffect` para opciones compartidas
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // por defecto: false
  deep?: boolean
}
```

**Vea también**: [guía de `watch`](../guide/reactivity-computed-watchers.html#watch)
