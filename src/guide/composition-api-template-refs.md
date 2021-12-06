# Template Refs

> Esta sección utiliza [componentes de un solo archivo](single-file-component.html) para ejemplos de códigos

> Esta página asume que usted ya ha leído [Introducción de la API de Composición](composition-api-introduction.html) y [Fundamentos de la Reactividad](reactivity-fundamentals.html). Léalos primero si usted es nuevo con la API de Composición.

Cuando se utiliza la API de Composición, los conceptos de [refs reactivas](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) y [template refs](component-template-refs.html) son el mismo. Para obtener la referencia de un elemento en plantilla o una instancia de un componente, podemos declarar una _ref_ como lo hacemos usualmente y retornarla desde [setup()](composition-api-setup.html).

```html
<template>
  <div ref="root">Este es un elemento raíz</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // El elemento del DOM será asignado a la ref luego de la renderización inicial
        console.log(root.value) // <div>Este es un elemento raíz</div>
      })

      return {
        root
      }
    }
  }
</script>
```

Aquí estamos exponiendo `root` en el contexto de _render_ y vinculándolo al elemento _div_ como su _ref_ utilizando `ref="root"`. En el algoritmo de _patch_ del DOM Virtual, si la `ref` de un VNode corresponde a una `ref` en el context de _render_,  el elemento correspondiente o instancia de componente de dicho VNode será asignado al valor de dicha ref. Esto se realiza durante el proceso de montaje o de _patch_ del DOM Virtual, por lo cual _refs_ de plantilla solo tendrán valores asignados luego de la renderización inicial.

Refs utilizadas como _refs_ de plantilla se comportan igual que cualquieras otras refs: son reactivas y puede ser pasadas a (o retornadas de) funciones de composición.

## Uso con JSX

```js
export default {
  setup() {
    const root = ref(null)

    return () =>
      h('div', {
        ref: root
      })

    // con JSX
    return () => <div ref={root} />
  }
}
```

## Uso dentro de `v-for`

Las _refs_ de plantilla de la API de Composición no tienen un manejo especial cuando son utilizadas dentro de `v-for`. En su lugar, utilice _refs_ de función para realizar un manejo manual:

```html
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // make sure to reset the refs before each update
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```

## Observar Refs de Plantilla

Observar una _ref_ de plantilla para cambios puede ser una alternativa al uso de _hooks_ de ciclo de vida demostradado en previos ejemplos.

Pero una diferencia clave a _hooks_ de ciclo de vida es que los _effects_ de `watch()` y `watchEffect()` son ejecutados *antes* de que el DOM se monte o se actualice, así que la _ref_ de plantilla no haya sido actualizada cuando el observador ejecute el _effect_:

```vue
<template>
  <div ref="root">Este es un elemento raíz</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        // Este _effect_ ejecuta antes de que el DOM se actualice, en consecuencia,
        // la _ref_ de plantilla todavía no posee una referencia al elemento
        console.log(root.value) // => null
      })

      return {
        root
      }
    }
  }
</script>
```

Por lo tanto, los observadores que utilizan _refs_ de plantilla deberían ser definidos con la opción `flush: 'post'`. Este va a ejecutar el _effect_ *después* de que el DOM se haya actualizado y asegurar que la _ref_ de plantilla quede sincronizado con el DOM y se refiera al elemento correcto.

```vue
<template>
  <div ref="root">Este es un elemento raíz</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        console.log(root.value) // => <div>Este es un elemento raíz</div>
      }, 
      {
        flush: 'post'
      })

      return {
        root
      }
    }
  }
</script>
```

* Vea también: [_Computed_ y _Watchers_](./reactivity-computed-watchers.html#effect-flush-timing)
