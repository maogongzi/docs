# API de Composición

> Esta sección utiliza la sintaxis de [componentes de un solo archivo](../guide/single-file-component.html) para ejemplos de código

## `setup`

Una opción de componente que se va a ejecutar **antes** de que se cree el componente, tan pronto son recuperados las `props`. Sirve como el punto de entrada para APIs de composición.

- **Argumentos:**

  - `{Data} props`
  - `{SetupContext} context`

  Similar a `this.$props` cuando se utiliza la API de opciones, el objeto `props` solo contendrá _props_ declaradas explícitamente. También, todas claves declaradas de _props_ serán presentes en el objeto `props`, sin tener en cuenta de si fue pasada por el componente padre o no. Las _props_ opcionales ausentes tendrán un valor de `undefined`.

  Si necesita comprobar la ausencia de una _prop_ opcional, puede darle un Symbol como su valor por defecto:

  ```js
  const isAbsent = Symbol()

  export default {
    props: {
      foo: { default: isAbsent }
    },
    setup(props) {
      if (props.foo === isAbsent) {
        // foo no fue proporcionado
      }
    }
  }
  ```

- **Tipar**:

  ```ts
  interface Data {
    [key: string]: unknown
  }

  interface SetupContext {
    attrs: Data
    slots: Slots
    emit: (event: string, ...args: unknown[]) => void
    expose: (exposed?: Record<string, any>) => void
  }

  function setup(props: Data, context: SetupContext): Data
  ```

  ::: tip
  Para obtener inferencia de tipo para los argumentos pasados a `setup()`, el uso de [defineComponent](global-api.html#definecomponent) es necesario.
  :::

- **Ejemplo**

  Con la plantilla:

  ```vue-html
  <!-- MyBook.vue -->
  <template>
    <div>{{ readersNumber }} {{ book.title }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const readersNumber = ref(0)
        const book = reactive({ title: 'El guía de Vue 3' })

        // expone a la plantilla
        return {
          readersNumber,
          book
        }
      }
    }
  </script>
  ```

  Con una función render:

  ```js
  // MyBook.vue

  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'El guía de Vue 3' })
      // Por favor note que necesitamos explícitamente utilizar valor de ref aquí
      return () => h('div', [readersNumber.value, book.title])
    }
  }
  ```

  Si retorna una función render, luego no puede retornar cualquieras otras propiedades. Si necesita exponer propiedades para que puedan ser accesadas externamente, p. ej, mediante una `ref` en el padre, puede utilizar `expose`:

  ```js
  // MyBook.vue

  import { h } from 'vue'

  export default {
    setup(props, { expose }) {
      const reset = () => {
        // unas lógica de reestablecer (reset)
      }

      // La función expose puede ser llamada solo una vez. 
      // Si necesita exponer múltiples propiedades, todos de ellas deben ser 
      // incluidas en el objeto pasado a _expose_.
      expose({
        reset
      })

      return () => h('div')
    }
  }
  ```

- **Vea también**: [`setup` en la API de Composición](../guide/composition-api-setup.html)

## Hooks de ciclo de vida

Los hooks de ciclo de vida pueden ser registrados con las funciones `onX` importadas directamente:

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```

Estas funciones de registración de ciclo de vida pueden ser utilizadas solo sincrónicamente durante [`setup()`](#setup), debido a que dependen de estado global internal para ubicar la instancia activa actual (la instancia de componente cuya `setup()` está siendo llamada ahora mismo). Llamarlas sin una instancia activa actual resultará un error.

El contexto de la instancia del componente es también establecido durante la ejecución síncrona de los hooks de ciclo de vida. Como un resultado, los observadores y propiedades computadas creados sincrónicamente dentro de hooks de ciclo de vida son también automáticamente destruidos cuando el componente se desmonte.
 
- **Mapping entre las opciones de ciclo de vida de API de opciones y API de composición**

  - ~~`beforeCreate`~~ -> utilice `setup()`
  - ~~`created`~~ -> utilice `setup()`
  - `beforeMount` -> `onBeforeMount`
  - `mounted` -> `onMounted`
  - `beforeUpdate` -> `onBeforeUpdate`
  - `updated` -> `onUpdated`
  - `beforeUnmount` -> `onBeforeUnmount`
  - `unmounted` -> `onUnmounted`
  - `errorCaptured` -> `onErrorCaptured`
  - `renderTracked` -> `onRenderTracked`
  - `renderTriggered` -> `onRenderTriggered`
  - `activated` -> `onActivated`
  - `deactivated` -> `onDeactivated`


- **Vea también**: [hooks de ciclo de vida de API de composición](../guide/composition-api-lifecycle-hooks.html)

## Provide / Inject

`provide` y `inject` habilitan inyección de dependencia. Ambos pueden solo ser llamado durante [`setup()`](#setup) con una instancia activa actual.

- **Tipar**:

  ```ts
  interface InjectionKey<T> extends Symbol {}

  function provide<T>(key: InjectionKey<T> | string, value: T): void

  // sin un valor por defecto
  function inject<T>(key: InjectionKey<T> | string): T | undefined
  // con un valor por defecto
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
  // con una factoría
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

  Vue porporciona una interfaz `InjectionKey` que es un tipo genénico que extienda `Symbol`. Puede ser utilizada para sincronizar el tipo del valor inyectado entre el proveedor y el consumidor:

  ```ts
  import { InjectionKey, provide, inject } from 'vue'

  const key: InjectionKey<string> = Symbol()

  provide(key, 'foo') // provee valores que no son cadenas de caracteres resultará un error

  const foo = inject(key) // tipo de foo: string | undefined
  ```

  Si se utiliza claves de cadena de caracteres o _symbols_ sin tipo, el tipo del valor inyectado necesitará ser explícitamente declarado:

  ```ts
  const foo = inject<string>('foo') // string | undefined
  ```

- **Vea también**:
  - [Provide / Inject](../guide/component-provide-inject.html)
  - [Provide / Inject de API de composición](../guide/composition-api-provide-inject.html)

## `getCurrentInstance`

`getCurrentInstance` habilita acceso a una instancia internal de componente.

:::warning
`getCurrentInstance` solo es expuesto para casos de usuario avanzados, típicamente en librerías. El uso de `getCurrentInstance` es totalmente desaconsejado en el código de aplicación. **NO** lo utilice como una salida de emergencia para obtener el equivalente de `this` en API de composición.
:::

```ts
import { getCurrentInstance } from 'vue'

const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance()

    internalInstance.appContext.config.globalProperties // acceder a globalProperties
  }
}
```

`getCurrentInstance` **solo** funciona durante [setup](#setup) o [hooks de ciclo de vida](#lifecycle-hooks)

> Cuando se utiliza afuera de [setup](#setup) o [hooks de ciclo de vida](#lifecycle-hooks), por favor llame a `getCurrentInstance()` en `setup` y utilice la instancia en su lugar.

```ts
const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance() // funciona

    const id = useComponentId() // funciona

    const handleClick = () => {
      getCurrentInstance() // no funciona
      useComponentId() // no funciona

      internalInstance // funciona
    }

    onMounted(() => {
      getCurrentInstance() // funciona
    })

    return () =>
      h(
        'button',
        {
          onClick: handleClick
        },
        `uid: ${id}`
      )
  }
}

// también funciona si está llamada en un _composable_
function useComponentId() {
  return getCurrentInstance().uid
}
```
