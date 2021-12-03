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

Ahora comencemos a extraer nuestra primer responsabilidad lógica (marcada como "1" en el _snippet_ original).

Now let’s start with extracting the first logical concern (marked as "1" in the original snippet).

> 1. Getting repositories from a presumedly external API for that user name and refreshing it whenever the user changes

We will start with the most obvious parts:

- The list of repositories
- The function to update the list of repositories
- Returning both the list and the function so they are accessible by other component options

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'

// inside our component
setup (props) {
  let repositories = []
  const getUserRepositories = async () => {
    repositories = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories // functions returned behave the same as methods
  }
}
```

This is our starting point, except it's not working yet because our `repositories` variable is not reactive. This means from a user's perspective, the repository list would remain empty. Let's fix that!

### Reactive Variables with `ref`

In Vue 3.0 we can make any variable reactive anywhere with a new `ref` function, like this:

```js
import { ref } from 'vue'

const counter = ref(0)
```

`ref` takes the argument and returns it wrapped within an object with a `value` property, which can then be used to access or mutate the value of the reactive variable:

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

Wrapping values inside an object might seem unnecessary but is required to keep the behavior unified across different data types in JavaScript. That’s because in JavaScript, primitive types like `Number` or `String` are passed by value, not by reference:

![Pass by reference vs pass by value](https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif)

Having a wrapper object around any value allows us to safely pass it across our whole app without worrying about losing its reactivity somewhere along the way.

::: tip Note
In other words, `ref` creates a **Reactive Reference** to our value. The concept of working with **References** will be used often throughout the Composition API.
:::

Back to our example, let's create a reactive `repositories` variable:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

// in our component
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

Done! Now whenever we call `getUserRepositories`, `repositories` will be mutated and the view will be updated to reflect the change. Our component should now look like this:

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

We have moved several pieces of our first logical concern into the `setup` method, nicely put close to each other. What’s left is calling `getUserRepositories` in the `mounted` hook and setting up a watcher to do that whenever the `user` prop changes.

We will start with the lifecycle hook.

### Lifecycle Hook Registration Inside `setup`

To make Composition API feature-complete compared to Options API, we also need a way to register lifecycle hooks inside `setup`. This is possible thanks to several new functions exported from Vue. Lifecycle hooks on composition API have the same name as for Options API but are prefixed with `on`: i.e. `mounted` would look like `onMounted`.

These functions accept a callback that will be executed when the hook is called by the component.

Let’s add it to our `setup` function:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// in our component
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // on `mounted` call `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}
```

Now we need to react to the changes made to the `user` prop. For that we will use the standalone `watch` function.

### Reacting to Changes with `watch`

Just like how we set up a watcher on the `user` property inside our component using the `watch` option, we can do the same using the `watch` function imported from Vue. It accepts 3 arguments:

- A **Reactive Reference** or getter function that we want to watch
- A callback
- Optional configuration options

**Here’s a quick look at how it works.**

```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
```

Whenever `counter` is modified, for example `counter.value = 5`, the watch will trigger and execute the callback (second argument) which in this case will log `'The new counter value is: 5'` into our console.

**Below is the Options API equivalent:**

```js
export default {
  data() {
    return {
      counter: 0
    }
  },
  watch: {
    counter(newValue, oldValue) {
      console.log('The new counter value is: ' + this.counter)
    }
  }
}
```

For more details on `watch`, refer to our [in-depth guide](reactivity-computed-watchers.md#watch).

**Let’s now apply it to our example:**

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// in our component
setup (props) {
  // using `toRefs` to create a Reactive Reference to the `user` property of `props`
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // update `props.user` to `user.value` to access the Reference value
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // set a watcher on the Reactive Reference to user prop
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

You probably have noticed the use of `toRefs` at the top of our `setup`. This is to ensure our watcher will react to changes made to the `user` prop.

With those changes in place, we've just moved the whole first logical concern into a single place. We can now do the same with the second concern – filtering based on `searchQuery`, this time with a computed property.

### Standalone `computed` properties

Similar to `ref` and `watch`, computed properties can also be created outside of a Vue component with the `computed` function imported from Vue. Let’s get back to our counter example:

```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```

Here, the `computed` function returns a _read-only_ **Reactive Reference** to the output of the getter-like callback passed as the first argument to `computed`. In order to access the **value** of the newly-created computed variable, we need to use the `.value` property just like with `ref`.

Let’s move our search functionality into `setup`:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

// in our component
setup (props) {
  // using `toRefs` to create a Reactive Reference to the `user` property of props
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // update `props.user` to `user.value` to access the Reference value
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // set a watcher on the Reactive Reference to user prop
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

We could do the same for other **logical concerns** but you might be already asking the question – _Isn’t this just moving the code to the `setup` option and making it extremely big?_ Well, that’s true. That’s why before moving on with the other responsibilities, we will first extract the above code into a standalone **composition function**. Let's start with creating `useUserRepositories`:

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

And then the searching functionality:

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

**Now having those two functionalities in separate files, we can start using them in our component. Here’s how this can be done:**

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
      // Since we don’t really care about the unfiltered repositories
      // we can expose the filtered results under the `repositories` name
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

At this point you probably already know the drill, so let’s skip to the end and migrate the leftover filtering functionality. We don’t really need to get into the implementation details as it’s not the point of this guide.

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
      // Since we don’t really care about the unfiltered repositories
      // we can expose the end results under the `repositories` name
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

And we are done!

Keep in mind that we've only scratched the surface of Composition API and what it allows us to do. To learn more about it, refer to the in-depth guide.
