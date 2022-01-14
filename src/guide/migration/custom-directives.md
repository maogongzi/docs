---
badges:
  - breaking
---

# Directivas Personalizadas <MigrationBadges :badges="$frontmatter.badges" />

## Visión General

Las funciones hook para directivas han sido renombradas para mejor alinear con el ciclo de vida de componentes.

Además, la cadena de caracteres `expression` ya no es pasada como un parte del objeto `binding`.

## Sintaxis para 2.x

En Vue 2, directivas personalizadas fueron creadas mediante utilizar hooks listados abajo para apuntar al ciclo de vida de un elemento, todos de estos son opcionales:

- **bind** - Llamado una vez que la directiva sea vinculada al element. Llamado solo una vez.
- **inserted** - Llamado una vez que el element sea insertado en el DOM padre.
- **update** - Este  hook es llamado cuando el element se actualice, pero los hijos aún no sean actualizados.
- **componentUpdated** - Este hook es llamado una vez que el componente y sus hijos hayan sido actualizados.
- **unbind** - Este hook es llamado una vez que la directiva sea eliminado. También solo llamado una vez.

Aquí es un ejemplo de esto:

```html
<p v-highlight="'yellow'">Destacar este texto como amarillo claro</p>
```

```js
Vue.directive('highlight', {
  bind(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

Aquí, en la configuración inicial para este elemento, la directiva vincula un estilo mediante pasar un valor, que puede ser actualizado a valores diferentes a través de la aplicación.

## Sintaxis para 3.x

En Vue 3, sin embargo, hemos creado una API cohesivo para directivas personalizadas. Como puede ver, difieren en gran medida de nuestros métodos de ciclo de vida de componentes aunque estamos enganchando en eventos similares. Ahora los hemos unificado de esta manera:

- **created** - ¡nuevo! Este es llamado antes de que sean aplicados los atributos o escuchadores de eventos del elemento.
- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate**: !nuevo! Este es llamado antes de que el elemento mismo sea actualizado, muy similar a los hooks de ciclo de vida de componentes.
- update → !eliminado! Hay demasiado similaridades para ser actualizados, así que este es redundante. Por favor utilice `updated` en su lugar.
- componentUpdated → **updated**
- **beforeUnmount**: !nuevo! Similar a los hooks de ciclo de vida de componentes, este será llamado justo antes de que un elemento sea desmontado.
- unbind -> **unmounted**

The final API is as follows:

```js
const MyDirective = {
  created(el, binding, vnode, prevVnode) {}, // new
  beforeMount() {},
  mounted() {},
  beforeUpdate() {}, // new
  updated() {},
  beforeUnmount() {}, // new
  unmounted() {}
}
```

The resulting API could be used like this, mirroring the example from earlier:

```html
<p v-highlight="'yellow'">Highlight this text bright yellow</p>
```

```js
const app = Vue.createApp({})

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

Now that the custom directive lifecycle hooks mirror those of the components themselves, they become easier to reason about and remember!

### Edge Case: Accessing the component instance

It's generally recommended to keep directives independent of the component instance they are used in. Accessing the instance from within a custom directive is often a sign that the directive should rather be a component itself. However, there are situations where this actually makes sense.

In Vue 2, the component instance had to be accessed through the `vnode` argument:

```js
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

In Vue 3, the instance is now part of the `binding`:

```js
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning
With [fragments](/guide/migration/fragments.html#overview) support, components can potentially have more than one root node. When applied to a multi-root component, a custom directive will be ignored and a warning will be logged.
:::

## Estrategia para Migración

[Indicadores de compilación de migración: `CUSTOM_DIR`](migration-build.html#compat-configuration)
