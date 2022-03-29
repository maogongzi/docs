# Crear una Aplicación Vue

## La instancia de aplicación

Cada aplicación Vue empieza mediante crear una nueva **instancia de aplicación** con la función [`createApp`](/api/application#createapp):


```js
import { createApp } from 'vue'

const app = createApp({
  /* opciones del componente raíz */
})
```

## El componente raíz

De hecho, el objeto que pasamos a `createApp` es un componente. Cada aplicación requiere un "componente raíz" que contenga otros componentes como sus hijos.

Si estás utilizando componentes de un solo archivo, típicamente importamos el componente raíz desde otro archivo:

```js
import { createApp } from 'vue'
// importar la aplicación de componente raíz desde un componente de un solo archivo.
import App from './App.vue'

const app = createApp(App)
```

Mientras muchos ejemplos en este guía solo necesitan un solo componente, la mayoría de las aplicaciones reales se organizan en un árbol de componentes anidados y reutilizables. Por ejemplo, el árbol de componentes de una aplicación Todo podría verse así:

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

Hablaremos como definir y componer múltiples componentes juntos en las secciones siguientes del guía. Antes de eso, Nos enfocaremos en qué ocurre dentro de un solo componente.

## Montar la aplicación

Una instancia de aplicación no se renderizará de nada hasta que su método `.mount()` sea llamado. Se espera un argumento "container", lo que puede ser un elemento DOM actual o una cadena de caracteres de selector:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

The content of the app's root component will be rendered inside the container element. The container element itself is not considered part of the app.

The `.mount()` method should always be called after all app configurations and asset registrations are done. Also note that its return value, unlike the asset registration methods, is the root component instance instead of the application instance.

### In-DOM Root Component Template

When using Vue without a build step, we can write our root component's template directly inside the mount container:

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Vue will automatically use the container's `innerHTML` as the template if the root component does not already have a `template` option.

## App Configurations

The application instance exposes a `.config` object that allows us to configure a few app-level options, for example defining an app-level error handler that captures errors from all descendent components:

```js
app.config.errorHandler = (err) => {
  /* handle error */
}
```

The application instance also provides a few methods for registering app-scoped assets. For example, registering a component:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

This makes the `TodoDeleteButton` available for use anywhere in our app. We will discuss registration for components and other types of assets in later sections of the guide. You can also browse the full list of application instance APIs in its [API reference](/api/application).

Make sure to apply all app configurations before mounting the app!

## Multiple application instances

You are not limited to a single application instance on the same page. The `createApp` API allows multiple Vue applications to co-exist on the same page, each with its own scope for configuration and global assets:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

If you are using Vue to enhance server-rendered HTML and only need Vue to control specific parts of a large page, avoid mounting a single Vue application instance on the entire page. Instead, create multiple small application instances and mount them on the elements they are responsible for.
