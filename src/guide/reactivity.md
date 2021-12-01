# Reactividad en profundidad

¡Ha llegado la hora de profundizar en el asunto! Una de las características más distintas de Vue es su discreto sistema de reactividad. Los modelos simplemente son objetos delegados (proxied) de JavaScript. Cuando los modifique, se actualizará la vista. Esto hace que el gestor de estados sea sencillo e intuitivo, pero también es importante entender como funciona para evitar algunos errores comunes. En esta sección, vamos a indagar en algunos detalles de bajo nivel del sistema de reactividad de Vue.

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity" title="Aprender cómo funciona la reactividad a fondo con Vue Mastery">Ver un video gratis sobre Reactividad en profundidad en Vue Mastery</VideoLesson>

## ¿Que es Reactividad?

Este término surge en programación muy frecuente estos días, ¿pero que quiere decir cuando la gente lo menciona? Reactividad es una paradigma de programación que nos permite adaptar a cambios en una manera declarativa. El ejemplo canónico que la gente a menudo demuestra, porque es genial, es una hoja de cálculo de Excel.

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  Su navegador no soporta la etiqueta video.
</video>

Si pone el número 2 en la primera celda, y el número 3 en la segunda y pide la SUM, la hoja de cálculo le daría. No hay sorpresas allí. Pero si actualiza el primero número, la SUM se actualiza automáticamente, también.

JavaScript usualmente no funciona como esto. Si estuviéramos escribiendo algo similar en JavaScript:

```js
let val1 = 2
let val2 = 3
let sum = val1 + val2

console.log(sum) // 5

val1 = 3

console.log(sum) // Still 5
```

Si actualizamos el primer valor, el sum no es adaptado.

Entonces, ¿cómo podríamos hacerlo en JavaScript?

Como una visión general de alto nivel, hay unas cuantas cosas que debemos ser capaz de hacer:

1. **Rastrear cuándo un valor esté leido.** p. ej. `val1 + val2` lee tanto `val1` como `val2`.
2. **Detectar cuándo un valor se cambie.** p. ej. cuando asignamos `val1 = 3`.
3. **Reejecutar el código que lea el valor originalmente.** p. ej. Ejecutar `sum = val1 + val2` de nuevo para actualizar el valor de `sum`.

No podemos hacerlo directamente utilizando el código desde el previo ejemplo, pero volverémos a este ejemplo más adelante para ver como adaptarlo para sea compatible con el sistema de reactividad de Vue.

Primero, vamos a profundizar un poco más en cómo Vue implementa los requisitos núcleos de reactividad descritos anteriormente.

## Cómo Vue sabe que código está ejecutando

Para ser capaz de obtener nuestra suma cada vez que los valores se cambien, la primera cosa que debemos hacer es envolverlo en una función:

```js
const updateSum = () => {
  sum = val1 + val2
}
```

Pero, ¿cómo informamos a Vue sobre esta función?

Vue realiza un seguimiento de cual función está ejecutando en la actualidad, mediante utilizar un **effect**. Un _effect_ es una envoltura alrededor de la función que inicie el seguimiento justo antes de que se llame la función. Vue sabe cual _effect_ está ejecutando en cualquier momento y puede ejecutarlo de nuevo cuando sea necesario.

Para comprenderlo mejor, tratemos de implementar algo similar nosotros, sin Vue, para ver cómo podría funcionar.

Lo que necesitamos es algo que pueda envolver nuestra suma, como esto:

```js
createEffect(() => {
  sum = val1 + val2
})
```

Necesitamos `createEffect` para realizar un seguimiento de cuando la suma está ejecutando. Podríamos implementarlo de alguna manera como esto:

```js
// Mantener una pila de _effects_ que están ejecutando
const runningEffects = []

const createEffect = fn => {
  // Envolver la función pasada en una función _effect_
  const effect = () => {
    runningEffects.push(effect)
    fn()
    runningEffects.pop()
  }

  // Automáticamente ejecutar el _effect_ inmediatmente
  effect()
}
```

Cuando nuestro _effect_ está llamado, se empuja a sí mismo en la matriz `runningEffects`, antes de llamar `fn`. Cualquiera cosa que necesita saber cual _effect_ está ejecutando en la actualidad puede revisar la matriz.

_Effects_ actúan como el punto de partida para muchas características fundamentales. Por ejemplo, tanto la renderización de componentes como las propiedades computadas utilizan _effects_ internalmente. Cualquier tiempo cuando algo responda a cambios de datos mágicamente, puede ser casi seguro que se haya envuelto en un _effect_.

Mientras la API pública de Vue no incluye nada de maneras para crear un _effect_ directamente, en verdad expone una función llamada `watchEffect`, lo que se porta muy similar como la función `createEffect` de nuestro ejemplo. Discutirémoslo con más detalles [más adelante en la guía](/guide/reactivity-computed-watchers.html#watcheffect).

Pero saber qué código está ejecutando es solo un parte del puzle. ¿Cómo sabe Vue qué valores utiliza el _effect_ y cuando se cambian?

## Cómo Vue rastrear estos cambios

No podemos rastrear reasignación de variables locales como esos en nuestros ejemplos anteriores, simplemente no hay mecanismo para hacerlo en JavaScript. Los que podemos rastrear son los cambios de las propiedades de objetos.

Cuando retornamos un objeto JavaScript plano desde la función `data` de un componente, Vue va a envolver ese objeto en un [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) con manejadores para `get` y `set`. Los _proxies_ estuvieron introducido en ES6 y le permite a Vue 3 a evitar unas de las advertencias de reactividad que existen en las versiones anteriores de Vue.

<div class="reactivecontent">
  <common-codepen-snippet title="Proxies y la Reactividad de Vue Explicados Visualmente" slug="VwmxZXJ" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

¡Eso fue muy rápido y requiere unos conocimientos de [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) para comprender! Por eso dejamos profundizar un poco. Hay muchos para conocer sobre _Proxies_, pero lo que en realidad necesita saber es que un **Proxy** es un objeto que encierra otro objeto y le permite interceptar cualquier interacción con el objeto encerrado.**

Utilizámoslo como este: `new Proxy(target, handler)`

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property) {
    console.log('intercepted!')
    return target[property]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

Aquí hemos interceptado los intentos de leer propiedades del objeto objetivo. Una función de manejador como este es también conocido como una *trampa*. Hay muchos tipos diferentes de *trampas* disponibles, cada uno maneja un tipo diferente de interacción.

Más allá de un registro de la consola, podríamos hacer cualquier cosa que nos gustaríamos aquí. Podríamos incluso _no_ retornar el valor verdadero si quisiéramos. Este hace que _Proxies_ sea muy poderoso para crear API.

Un reto que se encuentra cuando se utiliza un _Proxy_ es la vinculación de `this`. Querríamos que cualquier método sea vinculado al _Proxy_ en lugar del objeto objetivo, así que podemos interceptarlos también. Afortunadamente, ES6 introdujo otra nueva característica, llamada `Reflect`, lo que nos permite eliminar este problema con mínimo esfuerzo:

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

El primero paso hacia implementar reactividad con un _Proxy_ es rastrear cuando una propiedad sea leido. Hacemoslo en el manejador, en una función llamada `track`, a la que pasamos `target` y `property`:

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

La implementación de `track` no está mostrado aquí. Comprobará cual *effect* está ejecutando en la actualidad y lo grabará junto con `target` y `property`. Esto es cómo Vue sabe que la propiedad es una dependencia del _effect_.

Por fin, necesitamos reejecutar el _effect_ cuando el valor de la propiedad haya cambiado. Para esto vamos a necesitar un manejador `set` en nuestro _Proxy_:

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

¿Recuerda esta lista de antes? Ahora tenemos algunas respuestas para cómo Vue implementa estos pasos fundamentales:

1. **Rastrear cuándo un valor esté leido**: la función `track` en el manejador `get` del _proxy_ graba la propiedad y el actual _effect_.
2. **Detectar cuándo un valor se cambie**: el manejador `set` está llamado en el _proxy_.
3. **Reejecutar el código que lea el valor originalmente:** la función `trigger` busca cuales _effects_ dependen de la propiedad y los ejecute.

El objeto delegado (proxied) es invisible al usuario, pero fundamentalmente le permite a Vue a realizar el seguimiento de dependencias y notificación a cambios cuando las propiedades son accesado o modificado. Una advertencia es que el registro de la consola va a formatear los objetos delegados (proxied) de maneras diferentes, así que querría instalar [vue-devtools](https://github.com/vuejs/vue-devtools) para una interfaz más faborable a la inspección.

Si queremos reescribir nuestro ejemplo original utilizando un componente, podríamos hacerlo de una manera como esto:

```js
const vm = createApp({
  data() {
    return {
      val1: 2,
      val2: 3
    }
  },
  computed: {
    sum() {
      return this.val1 + this.val2
    }
  }
}).mount('#app')

console.log(vm.sum) // 5

vm.val1 = 3

console.log(vm.sum) // 6
```

El objeto retornado por `data` será envuelto en un _proxy_ reactivo y almacenado como `this.$data`. Las propiedades `this.val1` y `this.val2` son alias para `this.$data.val1` y `this.$data.val2`, respectivamente, po eso vienen del mismo _proxy_.

Vue envolverá la función para `sum` en un _effect_. Cuando tratamos de acceder `this.sum`, ejecutará ese _effect_ para calcular el valor. El _proxy_ reactivo alrededor `$data` rastreará que las propiedades `val1` y `val2` sean leido cuando ese _effect_ sea ejecutando.

A partir de Vue 3, nuestra reactividad es ahora disponible en un [paquete separado](https://github.com/vuejs/vue-next/tree/master/packages/reactivity). La función que envolve `$data` en un _proxy_ es llamado [`reactive`](/api/basic-reactivity.html#reactive). Podemos llamar este directamente por nosotros mismos, permitíendonos envolver un objeto en un _proxy_ reactivo sin necesidad de utilizar un componente:

```js
const proxy = reactive({
  val1: 2,
  val2: 3
})
```

Explorarémos la funcionalidad expuesta por el paquete de reactividad a lo largo del curso de las siguientes páginas de esta guía. Eso incluye funciones como `reactive` y `watchEffect` que ya hemos encontrado, así como maneras para utilizar otras características de reactividad, como `computed` y `watch`, sin necesidad de crear un componente.

### Objetos Delegados (Proxied)

Vue rastrea todos objetos que se han hecho reactivo internalmente, así que siempre retorna el mismo _proxy_ para el mismo objeto.

Cuando un objeto anidado está accesado desde un _proxy_ reactivo, ese objeto es _también_ convertido en un _proxy_ antes de ser retornado:

```js{6-7}
const handler = {
  get(target, property, receiver) {
    track(target, property)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      // Wrap the nested object in its own reactive proxy
      return reactive(value)
    } else {
      return value
    }
  }
  // ...
}
```

### Proxy versus la identidad original

El uso de _Proxy_ de hecho introduce una nueva advertencia que deba tener en cuenta: el objeto delegado no es igual al objeto original en términos de la comparación de identidad (`===`). Por ejemplo:

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

Otras operacions que dependen de las comparaciones estrictas de igualdad pueden también ser afectado, como `.includes()` o `.indexOf()`.

La mejor práctica aquí es nunca poseer una referencia al crudo objeto original y solo trabajar con la versión reactiva:

```js
const obj = reactive({
  count: 0
}) // no referencia al original
```

Este asegura que tanto las comparaciones de igualdad como la reactividad se comportan como se espera.

Note que Vue no envolver los valores primitivos como los números o cadenas de caracteres en un _proxy_, por eso puede todavía utilizar `===` directamente con esos valores:

```js
const obj = reactive({
  count: 0
})

console.log(obj.count === 0) // true
```

## Cómo la renderización reacciona a cambios

La plantilla para un componente es compilado en una función [`render`](/guide/render-function.html). La función `render` crea los [VNodes (Nodos Virtuales)](/guide/render-function.html#the-virtual-dom-tree) que describen como el componente se debe renderizar. Es envuelto en un _effect_, permitiendo que Vue rastree las propiedades que son 'tocado' mientras está ejecutando.

Una función `render` es conceptualmente muy similar a la propiedad `computed`. Vue no rastrea exactamente cómo las dependencias son utilizado, solo sabe que ellas hayan sido utilizado en algún momento mientras la función está ejecutando. Si cualquiera de estas propiedades cambia posteriormente, disparará el _effect_ para ejecutar de nuevo, reejecutando la función `render` para generar nuevos VNodes. Estos son luego utilizado para hacer los cambios necesarios al DOM.

<div class="reactivecontent">
  <common-codepen-snippet title="La Segunda Reactividad con Proxies en El Explicador de Vue 3" slug="wvgqyJK" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

> Si está utilizando Vue 2.x y bajo, le podría interesar en algunas de las advertencias de detección de cambios que existen en esos versiones, [explicados con más detalles aquí](change-detection.md).
