# Manejo de Estados

## Implementación oficial como Flux

Las aplicaciones a gran escala pueden a menudo incrementar complejidad, debido a que múltiples piezas de estado esparcidos por muchos componentes y las interacciones entre sí. Para solvar este problema, VUe proporciona [Vuex](https://next.vuex.vuejs.org/), nuestra propia librería de manejo de estados inspirado por Elm. Ella también está integrado en [vue-devtools](https://github.com/vuejs/vue-devtools), proporciona acceso a [depuración por viajes en el tiempo](https://raw.githubusercontent.com/vuejs/vue-devtools/legacy/media/demo.gif) con niguno configuración.

### Información para los desarrolladores vienen de React

Si usted viene de React, tal vez se estaría preguntando como comparar vuex con
[redux](https://github.com/reactjs/redux), la más favorita implementación de Flux en esa ecosistema. Redux es de hecho agonóstico a la capa de vista, por lo que puede ser utilizado fácilmente junto con Vue mediante [vinculaciones sencillos](https://classic.yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex es diferente en el aspecto que _percibe_ que se está dentro de una aplicación Vue. Esto permite que sea mejor integrado con Vue ofreciendo un API más intuitivo y optimizada experiencia de desarrollo.

## Manejo sencillo de estados desde cero

Se está frecuentemente ignorado que el fuente de verdad en una aplicación Vue es el objeto reactivo `data` - una instancia de componente solo delega acceso al objeto. Por lo tanto, si tiene una pieza de estado que debe ser compartido por múltiples instancias, puede utilizar el método [reactive](/guide/reactivity-fundamentals.html#declaring-reactive-state) para hacer un objeto reactivo:

```js
const { createApp, reactive } = Vue

const sourceOfTruth = reactive({
  message: 'Hola'
})

const appA = createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-a')

const appB = createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-b')
```

```html
<div id="app-a">App A: {{ message }}</div>

<div id="app-b">App B: {{ message }}</div>
```

Ahora cuando `sourceOfTruth` es mutada, tanto `appA` como `appB` actualizará sus vistas automáticamente. Tenemos un único fuente de verdad ahora, pero la depuración sería una pesadilla. Cualquiera pieza de dato puede ser cambiado por cualquier parte de nuestra applicación en cualquier momento sin dejando un rastro.

```js
const appB = createApp({
  data() {
    return sourceOfTruth
  },
  mounted() {
    sourceOfTruth.message = 'Adiós' // ambos de las aplicaciones renderizarán el mensaje 'Adiós' ahora
  }
}).mount('#app-b')
```

Para tratar de resolver este problema, podemos adoptar un **patrón de almación**:

```js
const store = {
  debug: true,

  state: reactive({
    message: '¡Hola!'
  }),

  setMessageAction(newValue) {
    if (this.debug) {
      console.log('setMessageAction disparado con', newValue)
    }

    this.state.message = newValue
  },

  clearMessageAction() {
    if (this.debug) {
      console.log('clearMessageAction está disparado')
    }

    this.state.message = ''
  }
}
```

Note que todas acciones que muten el estado del almacén son colocados dentro del almacén mismo. Este tipo de manejo de estado centralizado hace más sencillo comprender cual tipo de mutaciones podrían ocurrir y como son disparados. Ahora cuando algo sale mal, Obtendremos un registro de los occuridos que conducen al error.

Además, cada instancia/componente todavía puede poseer y manejar sus propios estados privados:

```html
<div id="app-a">{{sharedState.message}}</div>

<div id="app-b">{{sharedState.message}}</div>
```

```js
const appA = createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  },
  mounted() {
    store.setMessageAction('¡Adiós!')
  }
}).mount('#app-a')

const appB = createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}).mount('#app-b')
```

![Manejo de Estados](/images/state.png)

::: tip
Nunca debería replazar el original objeto de estado en tus acciones - los componentes y el almacén necesitan compartir la referiencia del mismo objeto para que los mutaciones sean observados.
:::

A medida que continuamos desarrollando la convención, donde los componentes nunca serán permitidos mutar directamente el estado que pertenece a un almacén, pero en vez despachar eventos que notifican el almacén para ejecutar acciones, eventualmente llegamos a la architectura [Flux](https://facebook.github.io/flux/). El beneficio de esta convención es que podemos recordar todas mutaciones de estado ocurriendo al almacén y implementar helpers avanzadas de depuración como registros de mutación, instantáneas, y retroceso de la historia / viaje por el tiempo.

Esto nos lleva completamente al origin de [Vuex](https://next.vuex.vuejs.org/), por eso si haya llegado a este parte ¡es probablemente el tiempo de probarlo!
