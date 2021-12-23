# Provide / Inject

> Esta sección utiliza [componentes de un solo archivo](single-file-component.html) para ejemplos de códigos

> Esta guía asume que usted ya ha leído [Provide / Inject](component-provide-inject.html), la [Introducción de la API de Composición](composition-api-introduction.html), [Fundamentos de la Reactividad](reactivity-fundamentals.html).

También podemos utilizar [provide / inject](component-provide-inject.html) con la API de Composición. Ambos solo pueden ser invocados durante el [`setuo()`](composition-api-setup.html) con una instance activa actual.

## Explicación del Escenario

Asumamos que queremos reescribir el siguiente código, el cual contiene un componente `MyMap` que proporciona a un componente `MyMarker` la ubicación del usuario, utilizando la API de Composición.

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  provide: {
    location: 'Polo Norte',
    geolocation: {
      longitude: 90,
      latitude: 135
    }
  }
}
</script>
```

```vue
<!-- src/components/MyMarker.vue -->
<script>
export default {
  inject: ['location', 'geolocation']
}
</script>
```

## Utilizar _Provide_

Cuando se utiliza `provide` dentro de `setup()`, comenzamos importando este método desde `Vue` de forma explícita. Esto nos permite definir cada propiedad con su propia invocación de `provide`.

La función `provide` le permite definir la propiedad a través de dos parámetros:

1. El nombre de la propiedad (de tipo `<String>`)
2. El valor de la propiedad

Utilizando nuestro componente `MyMap`, nuestro valores _proporcionado (provided)_ pueden ser refactorizados de la siguiente forma:

```vue{7,14-20}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    provide('location', 'Polo Norte')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}
</script>
```

## Utilizar _Inject_

Cuando se utilizada `inject` dentro de `setuo()`, también debemos importarlo desde `Vue` de forma explícita. Una vez que lo hagamos, nos permitirá invocarlo para definir cómo queremos exponerlo a nuestro componente.

La función `inject` recibe dos parámetros:

1. El nombre de la propiedad a inyectar
2. Un valor por defecto (**Opcional**)

Utilizando nuestro componente `MyMarker`, podemos refactorizar nuestro código de la siguiente forma:

```vue{3,6-14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'El Universo')
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}
</script>
```

## Reactividad

### Agregar Reactividad

Para agregar reactividad entre valores _proporcionados (provided)_ e _inyectados (injected)_, podemos utilizar [ref](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) o [reactive](reactivity-fundamentals.html#declaring-reactive-state) cuando proveemos un valor.

Utilizando nuestro componente `MyMap`, podemos actualizar nuestro código de la siguiente forma:

```vue{7,15-22}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('Polo Norte')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
</script>
```

Ahora, si algo cambia en cualquiera de las propiedades, el componente `MyMarker` también se actualizará automáticamente!

### Mutar Propiedades Reactivas

Al utilizar valores _provide_ / _inject_ reactivos, **se recomienda que las mutaciones a propiedades reactivas se realicen dentro del _provider_ siempre que sea posible**.

Por ejemplo, en el evento necesitabamos cambiar la ubicación del usuario, idealmente haríamos esto dentro del componente `MyMap`.

```vue{28-32}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('Polo Norte')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)

    return {
      location
    }
  },
  methods: {
    updateLocation() {
      this.location = 'Polo Sur'
    }
  }
}
</script>
```

Sin embargo, hay ocasiones en los que necesita actualizar el dato dentro del componente en el que el mismo fue inyectado. En este escenario, recomendamos proveer un método que sea responsable de mutar la propiedad reactiva.

```vue{21-23,27}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('Polo Norte')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'Polo Sur'
    }

    provide('location', location)
    provide('geolocation', geolocation)
    provide('updateLocation', updateLocation)
  }
}
</script>
```

```vue{9,14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'El Universo')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>
```

Finalmente, recomendamos el uso de `readonly` en propiedades _proporcionadas (provided)_ si usted quiere asegurarse que el dato pasado a través de `provide` no pueda ser mutado por el componente que lo inyecte.

```vue{7,25-26}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('Polo Norte')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'Polo Sur'
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)
  }
}
</script>
```
