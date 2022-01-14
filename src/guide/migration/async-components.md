---
badges:
  - new
---

# Componentes Asíncronos <MigrationBadges :badges="$frontmatter.badges" />

## Visión General

Aquí es una visión general de alto nivel de los que ya han cambiado:

- Nuevo método de ayuda `defineAsyncComponent` que explícitamente define componentes asíncronos
- La opción `component` es renombrada a `loader`
- Función de cargador no recibe inherentemente argumentos `resolve` y `reject` y debe retornar un Promise

Para una explicación más profundo, ¡sigue leyendo!

## Introducción

Anteriormente, los componentes asíncronos son creados mediante simplemente definir un componente como una función que retorne un Promise, tal como:

```js
const asyncModal = () => import('./Modal.vue')
```

O, para la más avanzada sintaxis de componente con opciones:

```js
const asyncModal = {
  component: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```

## Sintaxis para 3.x

Ahora, en Vue 3, debido a que componentes funcionales son definidos como funciones puras, las definiciones de componentes asíncronos necesitan ser definidas mediante envolverla en un nuevo ayudante `defineAsyncComponent` helper:

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// Componente asíncrono sin opciones
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// Componente asíncrono con opciones
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

::: tip NOTE
Vue Router soporta un mecanismo similar para cargar componentes de ruta asíncronamente, conocido como *cargamiento perezoso (lazy loading)*. Pese a las semejanzas, esta característica es distinta del soporte Vue para components asíncronos. **No** debe utilizar `defineAsyncComponent` cuando configura componentes de ruta con Vue Router. Puede leer más sobre este en la sección [rutas cargadas perezosamente](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) de la documentación de Vue Router.
:::

Otro cambio que se ha hecho desde 2.x es que la opción `component` ahora es renombrada a `loader` para informar con prcisión que una definición de componente no se puede proveer directamente.

```js{4}
import { defineAsyncComponent } from 'vue'

const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

Además, al contrario de 2.x, la función de cargador ya no recibe los argumentos `resolve` y `reject` y debe siempre retornar un Promise.

```js
// versión 2.x
const oldAsyncComponent = (resolve, reject) => {
  /* ... */
}

// versión 3.x
const asyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /* ... */
    })
)
```

Para más información sobre el uso de componentes asíncronos, vea:

- [Guía: Componentes Dinámicos & Asíncronos](/guide/component-dynamic-async.html#dynamic-components-with-keep-alive)
- [Indicadores de compilación de migración: `COMPONENT_ASYNC`](migration-build.html#compat-configuration)
