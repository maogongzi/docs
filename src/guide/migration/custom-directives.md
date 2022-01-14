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

La API final es como lo siguiente:

```js
const MyDirective = {
  created(el, binding, vnode, prevVnode) {}, // nuevo
  beforeMount() {},
  mounted() {},
  beforeUpdate() {}, // nuevo
  updated() {},
  beforeUnmount() {}, // nuevo
  unmounted() {}
}
```

La API resultante podría ser utilizado como esto, reflejando el ejempo de antes:

```html
<p v-highlight="'yellow'">Destacar este texto como amarillo claro</p>
```

```js
const app = Vue.createApp({})

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

Ahora que los hooks de ciclo de vida de directivas personalizadas reflejan aquellos de los componentes mismos, ¡se vuelven más fáciles de razonar y memorizar!

### Caso Extremo: Acceder la instancia de componente

Generalmente es recomendado mantener directivas independientes de las instancias de componentes en que son utilizadas. Acceder la instancia desde dentro de una directiva personalizada es a menudo una señal que sea mejor convertir la directiva misma a un componente. Sin embargo, hay situaciones dónde este actualmente tiene sentido.

En Vue 2, la instancia de componente tuvo que ser accsada mediante el argumento `vnode`:

```js
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

En Vue 3, la instancia es ahora una parte de la `binding`:

```js
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning
Con el soporte de [fragmentos](/guide/migration/fragments.html#overview), los componentes pueden potencialmente tener más que un nodo raíz. Cuando se aplica a un componente con múltiples nodos raíces, una directiva personalizada serán ignorada y se registrará una advertencia.
:::

## Estrategia para Migración

[Indicadores de compilación de migración: `CUSTOM_DIR`](migration-build.html#compat-configuration)
