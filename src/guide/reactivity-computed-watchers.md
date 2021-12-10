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

### Depuración de Observador (Watcher Debugging)

Las opciones `onTrack` y `onTrigger` pueden ser utilizadas para depurar el comportamiento de un observador.

- `onTrack` será llamado cuando una propiedad reactiva o _ref_ es rastreada como una dependencia.
- `onTrigger` será llamado cuando el _callback_ del observador esté disparado por la mutación de una dependencia.

Ambos _callbacks_ recibirán un evento de depuración que contenga información sobre la dependencia en cuestión. Es recomendado poner una declaración `debugger` en estos _callbacks_ para inspeccionar la dependencia interactivamente:

```js
watchEffect(
  () => {
    /* efecto secundario */
  },
  {
    onTrigger(e) {
      debugger
    }
  }
)
```

`onTrack` y `onTrigger` sólo funcionan en el modo de desarrollo.

## `watch`

La API `watch` es el exacto equivalente de la propiedad [watch](computed.html#watchers) de los componentes. `watch` requiere observar una fuente específica de dato y aplicar efectos secundarios in una función separada de _callback_. También es perezosa por defecto, es decir, el _callback_ sólo es llamado cuando la fuente observada se haya cambiada.

- Comparado con [watchEffect](#watcheffect), `watch` nos permite:

  - realizar el efecto secundario perezosamente;
  - ser más específico sobre cuál estado debe disparar el observador para que se reejecute;
  - Acceder tanto el valor previo como el corriente del estado observado.

### Observar un Solo Fuente

La fuente de dato de un observador puede ser tanto una función de captador que retorna un valor como directamente a `ref`:

```js
// observar un captador
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// observar directamente una _ref_
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### Observar Múltiples Fuentes

On observador puede también observar múltiples fuentes al mismo tiempo utilizando una matriz:

```js
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // registra: ["John", ""] ["", ""]
lastName.value = 'Smith' // registra: ["John", "Smith"] ["John", ""]
```

Sin embargo, si está cambiando ambos fuentes observadas simultáneamente en la misma función, el observador será ejecutado solo una vez:

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
    // registra: ["John", "Smith"] ["", ""]
  }

  return { changeValues }
}
```

Note que múltiples cambios sícronos solo dispararán el observador una vez.

Es posible obligar el observador disparar después cada cambio mediante utilizar la configuración `flush: 'sync'`, aunque no es recomendado generalmente. Alternativamente, [nextTick](/api/global-api.html#nexttick) puede ser utilizada para esperar hasta que se ejecute el observador antes de haga más cambios, p. ej.:

```js
const changeValues = async () => {
  firstName.value = 'John' // registra: ["John", ""] ["", ""]
  await nextTick()
  lastName.value = 'Smith' // registra: ["John", "Smith"] ["John", ""]
}
```

### Observar Objetos Reactivos

Para comparar valores de una matriz reactiva o un objeto reactivo utilizando un observador, se requiere que tiene una copia hecha de solo los valores.

```js
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // registra: [1,2,3,4,5] [1,2,3,4]
```

Tratar de verificar cambios de propiedades en un objeto o una matriz anidado profundamente todavía requerirá de que la opción `deep` sea `true`:

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

state.attributes.name = 'Alex' // registra: "deep" "Alex" "Alex"
```

Sin embargo, observar un objeto o una matriz reactivo siempre retornará una referencia al valor corriente de ese objeto para tanto el valor corriente como el valor previo del estado. Para complementamente observar profundamente objetos y matrices anidados, una copia profunda de valores sería necesaria. Esto se puede lograr con una utilidad como [lodash.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep)

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

state.attributes.name = 'Alex' // registra: "Alex" ""
```

### Comportamiento Compartido con `watchEffect`

`watch` comparte comportamiento con [`watchEffect`](#watcheffect) en términos de [detención manual (manual stoppage)](#stopping-the-watcher), [invalidación de efecto secundario (side effect invalidation)](#side-effect-invalidation) (con `onInvalidate` pasado al _callback_ como el tercero argumento en su lugar), [temporización para tirar de la cadena de los efectos secundarios (flush timing)](#effect-flush-timing) y [depuración](#watcher-debugging).
