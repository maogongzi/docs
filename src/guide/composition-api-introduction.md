# Introducción

## ¿Por qué la API de Composición?

::: tip Note
Al haber llegado tan lejos en la documentación, usted ya debería estar familiarizado tanto con [los conceptos básicos de Vue](introduction.md) y con [crear componentes](component-basics.md).
:::

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api" title="Aprender cómo la API de Composición funciona en profundidad con Vue Mastery">Vea un video gratis sobre la API de Composición en Vue Mastery</VideoLesson>

Crear componentes Vue nos permite extraer partes repetibles de la interfaz junto con su funcionalidad en piezas reutilizables de código. Esto puedo hacer que nuestra aplicación llegue bastante lejos en términos de mantenibilidad y flexibilidad. Sin embargo, nuestra experiencia colectiva ha demostrado que esto solo no sería suficiente, especialmente cuando nuestra aplicación se está volviendo realmente grade - piense varios cientos de componentes. Al lidiar con aplicaciones a esta escala, compartir y reutilizar código se vuelve crucial.

Imaginemos que en nuestra aplicación, tenemos una vista que muestra una lista de repositorios de un cierto usuario. Sobre esto, querremos agregar capacidad de buscar y filtrar. Nuestro componente para dicha vista podría verse como esto:

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // utilizando `this.user` para cargar los repositorios del usuario
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

Este componente tiene varias responsabilidades:

1. Obtener los repositorios de una API presuntamente externa para ese nombre de usuario y refrescarlos siempre que el usuario cambie
2. Buscar repositorios utilizando la cadena de caracteres `searchQuery`
3. Filtrar repositorios utilizando el objeto `filters`

Orgnizar la lógica en las opciones del componente (`data`, `computed`, `methods`, `watch`) funciona en la mayoría de los casos. Sin embargo, cuando el componente crece, la lista de **responsabilidades lógicas** también crece. Esto puede llevar a componentes difíciles de leer y comprender, en especial para las personas que no las escribieron en primer lugar.

![API de Opciones de Vue: código agrupado por tipo de opción](/images/options-api.png)

Ejemplo presentado un componente grande donde sus **responsabilidades lógicas** están agrupadas por colores.

Esta fragmentación es la que hace difícil entender y mantener un componente complejo. La separación de opciones oscurece las responsabilidades lógicas subyacentes. Además, cuando se trabaja en una única responsabilidad lógica, tenemos que "saltar" constantemente a través de los diferentes bloques de opciones para hallar el código relevante.

Sería mucho mejor si pudiéramos colocar el código relacionado a la misma responsabilidad lógica junto. Y esto es exactamente lo que la API de Composición nos permite hacer.

## Aspectos Básicos de la API de Composición

Ahora que sabemos el **por qué** podemos entrar en el **cómo**. Para comenzar trabajar con la API de Composición primero necesitamos un lugar donde la podamos utilizar. En un componente Vue, nosotros llamamos a este lugar el `setup`.

### Opción de Componente `setup`

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-essentials/setup-and-reactive-references" title="Aprender cómo funciona _setup_ con Vue Mastery">Vea un video gratis sobre setup en Vue Mastery</VideoLesson>

La nueva opción de componente `setup` se ejecuta **antes** de que el componente sea creado, una vez que las `props` sean resuelto, y sirve como punto de entrada para la API de Composición.

::: warning
Debería evitar utilizar `this` dentro de `setup` debido a que no se refiera a la instancia de componente. `setup` es llamado antes de que se resuelvan las propiedades de `data`, las propiedades computadas o los métodos, por eso no son disponibles dentro de `setup`.
:::

La opción `setup` debe ser una función que acepte `props` y `context`, sobre los cuales hablaremos [más adelante](composition-api-setup.html#arguments). También, todo lo que retornamos de `setup` será expuesto al resto de nuestro componente (propiedades computadas, métodos, _hooks_ del ciclo de video y más) así como a la plantilla del componente.

Agreguemos `setup` a nuestro componente:

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    console.log(props) // { user: '' }

    return {} // cualquier cosa retornada aquí será disponible en el resto de nuestro componente
  }
  // el "resto" de nuestro componente
}
```

Ahora comencemos a extraer nuestra primer responsabilidad lógica (marcada como "1" en el fragmento original).

> 1. Obtener los repositorios de una API presuntamente externa para ese nombre de usuario y refrescarlos siempre que el usuario cambie

Vamos a comenzar con las partes más obvias:

- La lista de repositorios
- La función para actualizar la lista de repositorios
- Retornar tanto la lista como la función para que sean accesibles por otras opciones del componente

```js
// src/components/UserRepositories.vue `setup` función
import { fetchUserRepositories } from '@/api/repositories'

// dentro de nuestro componente
setup (props) {
  let repositories = []
  const getUserRepositories = async () => {
    repositories = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories // funciones retornadas se comportan igual que los métodos
  }
}
```

Este es nuestro punto de partida, excepto que todavía no funciona dado que nuestra variable `repositories` no es reactiva. Esto quiere decir que, desde el punto de vista del usuario, la lista de repositorios se mantendría vacía. Arreglémoslo!

### Variables Reactivas con `ref`

En Vue 3.0 podemos crear una variable reactiva en cualquier lugar con una nueva función `ref`, de la siguiente manera:

```js
import { ref } from 'vue'

const counter = ref(0)
```

`ref` toma el argumento y lo retorna envuelto en un objeto que tiene una propiedad `value`, la cual puede ser utilizado para acceder o mutar el valor de la variable reactiva:

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

Envolver valores dentro de un objeto puede parecer innecesario, pero es requerido para mantener un comportamiento unificado a través de diferentes tipos de datos en JavaScript. Esto se debe a que en JavaScript, las primitivas como `Number` o `String` son pasado por valor, y no por referencia:

![Pasar por referencia versus pasar por valor](https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif)

Tener un objeto que envuelve cualquier valor nos permite pasarlo de forma segura a través de toda la aplicación sin preocuparnos de perder la reactividad en el camino.

::: tip Note
En otras palabras, `ref` crea una **Referencia Reactiva** a nuestro valor. El concepto de trabajar con **Referencias** será utilizado a menudo en toda la API de Composición.
:::

Volviendo a nuestro ejemplo, crearemos una variable reactive `repositories`:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

// en nuestro componente
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories
  }
}
```

¡Listo! Ahora siempre que llamemos `getUserRepositories`, `repositories` será mutado y la vista se actualizará para reflejar el cambio. Nuestro componente debería verse de la siguiente manera:

```js
// src/components/UserRepositories.vue
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const repositories = ref([])
    const getUserRepositories = async () => {
      repositories.value = await fetchUserRepositories(props.user)
    }

    return {
      repositories,
      getUserRepositories
    }
  },
  data () {
    return {
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

Hemos movido unas cuantas partes de nuestra primera responsabilidad lógica al método `setup`, muy cerca una de la otra. Lo que nos queda es invocar `getUserRepositories` dentro del _hook_ `mounted` y configurar un _watcher_ para realizarlo cada vez que nuestra prop `user` cambie.

Comenzaremos con el _hook_ de ciclo de vida.

### Registro de un _Hook_ del Ciclo de Vida dentro de `setup`

Para hacer que la API de Composición fuese completa en comparación a la API de Opciones, también necesitamos una manera para registrar _hooks_ de ciclo de vida dentro de `setup`. Esto es posible gracias a algunas funciones exportadas por Vue. Los _hooks_ de ciclo de vida en la API de Composición tienen el mismo nombre al que tienen en la API de Opciones, pero tienen el prefijo `on`: es decir, `mounted` sería `onMounted`.

Estas funciones aceptan un `callback` que será ejecutado cuando el _hook_ es llamado por el componente.

Agreguemos esto a nuestra función `setup`:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// en nuestro componente
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // al "montarse" invoca `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}
```

Ahora necesitamos reaccionar a los cambios hechos a la _prop_ `user`. Para eso utilizaremos la función independiente `watch`.

### Reaccionar a Cambios con `watch`

Al igual que cómo configuramos un _watcher_ sobre la propiedad `user` dentro de nuestro componente utilizando la opción `watch`, podemos hacer lo mismo utilizando la función `watch` importada desde Vue. Esta acepta 3 argumentos:

- Una **Referencia Reactiva** o función de captador que queremos observar
- Un _callback_
- Opciones de Configuración opcionales

**Aquí hay un ejemplo de cómo funciona.**

```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('El nuevo valor de counter es: ' + counter.value)
})
```

Siempre que `counter` sea modificado, por ejemplo `counter.value = 5`, el _watch_ disparará y ejecutará el _callback_ (segundo argumento) que en este caso resistrará `'El nuevo valor de counter es: 5'` en nuestra consola.

**Abajo esta el equivalente utilizando la API de Opciones:**

```js
export default {
  data() {
    return {
      counter: 0
    }
  },
  watch: {
    counter(newValue, oldValue) {
      console.log('El nuevo valor de counter es: ' + this.counter)
    }
  }
}
```

Por más detalles sobre `watch`, vea nuestra [guía en profundidad](reactivity-computed-watchers.md#watch).

**Ahora apliquemoslo a nuestro ejemplo:**

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// en nuestro componente
setup (props) {
  // utilizar `toRefs` para crear Referencias Reactivas para la _prop_ `user`
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // actualizar `props.user` a `user.value` para acceder al valor de Referencia
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // establecer un _watcher_ en la Referencia Reactica para la _prop_ `user`
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

Probablemente haya notado el uso de `toRefs` al comienzo de nuestro `setup`. Esto se realiza para asegurar que nuestro _watcher_ reaccione a los cambios realizados a la _prop_ `user`.

Con estos cambios listos, hemos movido toda la primer responsabilidad lógica a un único lugar. Ahora podemos hacer lo mismo con la segunda responsabilidad - filtrar según `searchQuery`, esta vez con una propiedad computada.

### Propiedad Computadas Independientes

De forma similar a `ref` y `watch`, las propiedades computadas también pueden ser creado afuera de un componente Vue con la función `computed` importada desde Vue. Volvamos a nuestro ejemplo de contador:

```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```

Aquí, la función `computed` retorna una **Referencia Reactiva** de _sólo lectura_ a la salida del _getter-like callback_ (un _callback_ que funciona igual como un captador) pasado como primer argumento a `computed`. Para poder acceder al **valor** de la nueva variable computada, debemos utilizar la propiedad `.value`, al igual que con `ref`.

Movamos nuestra funcionalidad de búsqueda a `setup`:

Let’s move our search functionality into `setup`:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

// en nuestro componente
setup (props) {
  // utilizar `toRefs` para crear Referencias Reactivas para la _prop_ `user`
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // actualizar `props.user` a `user.value` para acceder al valor de Referencia
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // establecer un _watcher_ en la Referencia Reactica para la _prop_ `user`
  watch(user, getUserRepositories)

  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })

  return {
    repositories,
    getUserRepositories,
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

Podríamos realizar lo mismo para otras **responsabilidades lógicas**, pero usted seguramente se este realizando la siguiente pregunta - _¿Esto no es simplemente mover el código a la opción `setup` y hacerla extremadamente grande?_ Bueno, eso es cierto. Es porque antes de abordar las otras responsabilidades, primero extraeremos el código de arribo en una **función de composición** independiente. Comencemos por crear `useUserRepositories`:

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

Y luego nuestra funcionalidad de búsqueda:

```js
// src/composables/useRepositoryNameSearch.js

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

**Ahora, al tener ambas funcionalidades en archivos separados, podemos utilizarlas dentro de nuestro componente. Así es como esto se haría:**

```js
// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // Dado que realmente no nos importan los repositorios no filtrados
      // podemos exponer el resultado filtrado bajo la variable `repositories`
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}
```

En este punto usted ya sabe como va la cosa, así que vayamos al final y migremos la funcionalidad de filtrado restante. No tenemos que entrar en los detalles de implementación, puesto que no va al caso de esta guía.

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // Dado que realmente no nos importan los repositorios no filtrados
      // podemos exponer el resultado final bajo la variable `repositories`
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

¡Y terminamos!

Recuerde que solamente razgamos la superficie de la API de Composición y lo que esta nos permite hacer. Para aprender más acerca de ella, vea la guía en profundidad.
