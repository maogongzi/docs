# Setup

> Esta sección utiliza [componentes de un solo archivo](single-file-component.html) para ejemplos de códigos

> Esta página asume que usted ya ha leído [Introducción de la API de Composición](composition-api-introduction.html) y [Fundamentos de la Reactividad](reactivity-fundamentals.html). Léalos primero si usted es nuevo con la API de Composición.

## Argumentos

Cuando se utiliza la función `setup`, recibirá dos argumentos:

1. `props`
2. `context`

Profundicemos en cómo se utilice cada argumento.

### Props

El primer argumento de la función `setup` es el argumento `props`. Tal y como usted esperaría en un componente normal, `props` dentro de la función `setup` son reactivas y serán actualizadas cuando nuevas _props_ sean pasado.

```js
// MyBook.vue

export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

:::warning
Sin embargo, dado que las `props` son reactivas, usted **no puede utilizar desestructuración de ES6** porque esto removerá la reactividad de _props_.
:::

Si usted necesita desestructurar sus _props_, puede hacerlo con [toRefs](reactivity-fundamentals.html#destructuring-reactive-state) dentro de la función `setup`:

```js
// MyBook.vue

import { toRefs } from 'vue'

setup(props) {
  const { title } = toRefs(props)

  console.log(title.value)
}
```

Si `title` es una _prop_ opcional, podría ausentarse de `props`. En ese caso, `toRefs` no creará una referencia para `title`. En su lugar tendría que utilizar `toRef`:

```js
// MyBook.vue

import { toRef } from 'vue'

setup(props) {
  const title = toRef(props, 'title')

  console.log(title.value)
}
```

### Context

El segundo argumento pasado a la función `setup` es `context`. El argumento `context` es un objeto JavaScript común que expone otras propiedades que puedan ser útiles dentro de `setup`:

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Atributos (objeto no reactivo, equivalente a $attrs)
    console.log(context.attrs)

    // Slots (objeto no reactivo, equivalente a $slots)
    console.log(context.slots)

    // Emitir eventos (Función, equivalente a $emit)
    console.log(context.emit)

    // Exponer propiedades públicas (Función)
    console.log(context.expose)
  }
}
```

El objeto `context` es un objeto JavaScript común, es decir, no es reactivo, esto quiere decir que puede utilizar desestructuración de ES6 de forma segura sobre `context`.

```js
// MyBook.vue
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` y `slots` son objetos con estados que siempre son actualizados cuando el componente mismo se actualice. Esto quiere decir que usted debería evitar desestructurarlos y siempre referenciar sus propiedades como `attrs.x` o `slots.x`. También tenga en cuenta que, a diferencia de `props`, las propiedades de `attrs` y `slots` **no** son reactivas. Si usted se ve tentado a aplicar efectos secundarios basados de cambios a `attrs` o `slots`, usted debería realizarlo dentro del _hook_ de ciclo de vida `onBeforeUpdate`.

Explicaremos el rol de `expose` en breve.

## Acceder a Propiedades de Componentes

Cuando `setup` es ejecutada, la instancia del componente aún no ha sido creada. Como resultado, usted solo podrá acceder a las siguientes propiedades:

- `props`
- `attrs`
- `slots`
- `emit`

En otras palabras, usted **no tendrá acceso** a las siguientes opciones del componente:

- `data`
- `computed`
- `methods`
- `refs` (template refs)

## Uso con Plantillas

Si `setup` retorna un objeto, las propiedad de dicho objeto pueden ser accedidas desde la plantilla del componente, así como las propiedades de `props` pasadas a la función `setup`:

```vue-html
<!-- MyBook.vue -->
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    props: {
      collectionName: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Guía de Vue 3' })

      // exponer a la plantilla
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

Note que [refs](../api/refs-api.html#ref) retornadas desde `setup` son [desenvueltas automáticamente](/guide/reactivity-fundamentals.html#ref-unwrapping) cuando sean accedidas en la plantilla así usted no debería utilizar `.value` en las plantillas.

## Uso con Funciones de _render_

`setup` también puede retornar una función _render_, la cual puede directamente utilizar el estado reactivo declarado en el mismo alcance:

```js
// MyBook.vue

import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // Por favor note que aquí debemos utilizar explícitamente el valor de _ref_
    return () => h('div', [readersNumber.value, book.title])
  }
}
```

Retornar una función _render_ nos previene de retornar cualquiera otra coas. Internalmente eso no va a ser un problema, pero puede ser problemático si queremos exponer métodos de este componente al padre mediante _refs_ de plantillas.

Podemos resolver este problema mediante llamar `expose`, pasarlo un objeto que define las propiedades que deberían ser disponibles en la exterior instancia de componente:

```js
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

El método `increment` podría luego ser disponible en el componente padre mediante un _ref_ de plantilla.

## Uso de `this`

**Dentro de `setup()`, `this` no será una referencia a la instancia activa actual** Dado que `setup()` es llamada antes de que las otras opciones del componente sean resueltas, `this` dentro de `setup()` se comportará diferente que `this` en otras opciones. Esto puede causar confusiones al utilizar `setup()` junto con la API de Opciones.
