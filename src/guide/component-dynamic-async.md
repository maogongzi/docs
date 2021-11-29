# Componentes Dinámicos & Asíncronos

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

## `keep-alive` con Componentes Dinámicos

Anteriormente, usamos el atributo `is` para cambiar entre componentes en una interfaz con pestañas:

```vue-html
<component :is="currentTabComponent"></component>
```

Sin embargo, al cambiar entre estos componentes, a veces querrá mantener su estado o evitar la re-renderización por motivos de rendimiento. Por ejemplo, al expandir nuestra interfaz con pestañas:

<common-codepen-snippet title="Componentes Dinámicos: sin keep-alive" slug="jOPjZOe" tab="html,result" />

Notará que si selecciona una publicación, cambie a la pestaña _Archive_, luego vuelva a _Posts_, ya no se muestra la publicación que seleccionó. Esto se debe a que cada vez que cambia a una nueva pestaña, Vue crea una nueva instancia de `currentTabComponent`.

La recreación de componentes dinámicos suele ser un comportamiento útil, pero en este caso, nos gustaría que esas instancias de componentes de pestañas se almacenen en caché una vez que se crean por primera vez. Para resolver este problema, podemos envolver nuestro componente dinámico con un elemento `<keep-alive>`:

```vue-html
<!-- ¡Componentes inactivos se almacenarán en caché! -->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

Eche un vistazo a los resultados a continuación:

<common-codepen-snippet title="Componentes Dinámicos: con keep-alive" slug="VwLJQvP" tab="html,result" />

Ahora la pestaña _Posts_ mantiene su estado (la publicación seleccionada) incluso cuando no está renderizada.

Por más detalles sobre `<keep-alive>` eche un vistazo a [Referencia de API](../api/built-in-components.html#keep-alive).

## Componentes asíncronos

En aplicaciones grandes, es posible que tengamos que dividir la aplicación en partes más pequeñas y solo cargar un componente del servidor cuando sea necesario. Para facilitarlo, Vue proporciona un método `defineAsyncComponent`:

```js
const { createApp, defineAsyncComponent } = Vue

const app = createApp({})

const AsyncComp = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: '<div>I am async!</div>'
      })
    })
)

app.component('async-example', AsyncComp)
```

Como puede ver, este método recibe una función de fábrica que retorna un `Promise`.
la _callback_ `resolve` del Promise debería llamarse cuando haya recuperado su definición de componente desde el servidor. También puede llamar a `reject(motivo)` para indicar que la carga ha fallado.

Puede también retornar un `Promise` en la función de fábrica, así que con Webpack 2 o más avanzado y la sintaxis ES2015 puede hacer esto:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

Puede también utilizar `defineAsyncComponent` cuando [Registar un componente localmente](component-registration.html#local-registration):

```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

### Utilizar con _Suspense_

Los componentes asíncronos soportan suspenderse (_suspensible_) por defecto. Esto significa que si tiene un `<Suspense>` en la cadena de los componentes padres, será tratado como una dependencia asíncrona de ese `<Suspense>`. En este caso, el estado de cargamento será controlado por el `<Suspense>`, y sus propios estados como cargamento, error, demora y las opciones de tiempo de espera serán ignorado.

El componente asíncrono puede excluir el control de `Suspense` y dejar que el componente simpre controlar sus propios estados de cargamento mediante especificar `suspensible: false` en sus opciones.

Puede consultar la lista de opciones disponibles en la [Referencia de API](../api/global-api.html#arguments-4).
