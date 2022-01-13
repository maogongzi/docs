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

// Async component without options
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// Async component with options
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

::: tip NOTE
Vue Router supports a similar mechanism for asynchronously loading route components, known as *lazy loading*. Despite the similarities, this feature is distinct from Vue's support for async components. You should **not** use `defineAsyncComponent` when configuring route components with Vue Router. You can read more about this in the [Lazy Loading Routes](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) section of the Vue Router documentation.
:::

Another change that has been made from 2.x is that the `component` option is now renamed to `loader` in order to accurately communicate that a component definition cannot be provided directly.

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

In addition, unlike 2.x, the loader function no longer receives the `resolve` and `reject` arguments and must always return a Promise.

```js
// 2.x version
const oldAsyncComponent = (resolve, reject) => {
  /* ... */
}

// 3.x version
const asyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /* ... */
    })
)
```

For more information on the usage of async components, see:

- [Guide: Dynamic & Async Components](/guide/component-dynamic-async.html#dynamic-components-with-keep-alive)
- [Migration build flag: `COMPONENT_ASYNC`](migration-build.html#compat-configuration)
