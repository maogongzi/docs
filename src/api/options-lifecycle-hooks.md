# _Hooks_ de ciclo de vida

:::tip Note
Todos los _hooks_ de ciclo de vida automáticamente tienen sus contextos de `this` vinculados a la instancia, así que puede acceder dato, propiedades computadas y métodos. Este significa que **no debe utilizar funciones de flecha para definir un método de ciclo de vida** (p. ej. `created: () => this.fetchTodos()`). La razón es que las funciones de flecha vinculan al contexto padre, así que `this` no será la instancia de componente como usted espere y `this.fetchTodos` será _undefined_.
:::

## beforeCreate

- **Tipo:** `Function`

- **Detalles:**

  Llamado sincrónicamente inmediatamente después de que la instancia se haya inicializada, antes la observación de dato y la configuración de eventos/observadores.

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## created

- **Tipo:** `Function`

- **Detalles:**

  LLamado sincrónicamente después de que la instancia se haya creada. En esta fase, la instancia ya ha terminado procesar las opciones, lo que significa que las siguientes se han establecidas: observación de dato, propiedades computadas, métodos, _callbacks_ de observación/evento. Sin embargo, la fase de montaje no se ha empezada, y la propiedad `$el` no será disponible todavía.

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## beforeMount

- **Tipo:** `Function`

- **Detalles:**

  Llamado justo antes de que se empiece el montaje: la función `render` está a punto de ser llamada por la primera vez.

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## mounted

- **Tipo:** `Function`

- **Detalles:**

  Llamado después de que la instancia se haya montada, dónde el elemento pasado a [`app.mount`](/api/application-api.html#mount) esté reemplazado por la recién creada `vm.$el`. Si la instancia raíz es montada a un elemento en el documento, `vm.$el` también será en el documento cuando `mounted` esté llamado.

  Note que `mounted` **no** garantiza que todos componentes hijos también se han montados. Si quiere esperar hasta que la vista entera se haya rerenderizada, puede utilizar [vm.$nextTick](../api/instance-methods.html#nexttick) en vez de `mounted`:

  ```js
  mounted() {
    this.$nextTick(function () {
      // El código que solo se ejecute después de
      // que la vista entera se haya rerenderizada
    })
  }
  ```

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## beforeUpdate

- **Tipo:** `Function`

- **Detalles:**

  Llamado cuando se cambie el dato, antes de que el DOM sea parcheado. Este es un buen lugar para acceder el DOM existente antes de una actualización, p. ej. eliminar escuchadores de evento agregados manualmente.

  **Este _hook_ no se llama durante la renderización del lado de servidor. Porque sólo la renderización inicial es realizada del lado de servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## updated

- **Tipo:** `Function`

- **Detalles:**

  Llamado después de que un cambio de dato provoque que el DOM virtual sea rerenderizado y parcheado.

  El DOM del componente se habrá actualizado cuando este _hook_ sea llamado, así que puede realizar operaciones que dependen del DOM aquí. Sin embargo, en la mayoría de casos debería evitar cambiar el estado dentro del _hook_. Para reaccionar a cambios de estado, es usualmente mejor utilizar una [propiedad computada](./options-data.html#computed) o [observador](./options-data.html#watch) en su lugar.

  Note que `updated` **no** garantiza que todos componentes hijos también se han rerenderizados. Si quiere esperar hasta que la vista entera se haya rerenderizada, puede utilizar [vm.$nextTick](../api/instance-methods.html#nexttick) en vez de `updated`:

  ```js
  updated() {
    this.$nextTick(function () {
      // El código que solo se ejecute después de
      // que la vista entera se haya rerenderizada
    })
  }
  ```

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## activated

- **Tipo:** `Function`

- **Detalles:**

  Llamado cuando un componente de _keep-alive_ sea activado.

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:**
  - [`keep-alive` con Componentes Dinámicos](../guide/component-dynamic-async.html#dynamic-components-with-keep-alive)

## deactivated

- **Tipo:** `Function`

- **Detalles:**

  Llamado cuando un componente de _keep-alive_ sea desactivado.

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:**
  - [`keep-alive` con Componentes Dinámicos](../guide/component-dynamic-async.html#dynamic-components-with-keep-alive)

## beforeUnmount

- **Tipo:** `Function`

- **Detalles:**

  Llamado justo antes de que una instancia de componente sea desmontada. En esta fase la instancia es todavía funcional.

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## unmounted

- **Tipo:** `Function`

- **Detalles:**

  Llamado después de que una instancia de componente se haya desmontada. Cuando este _hook_ sea llamado, todas directivas de la instancia del componente se hayan desvinculadas, todos escuchadores de evento se hayan eliminados, y todas instancias de componentes hijos también se hayan desmontadas.

  **Este _hook_ no se llama durante la renderización del lado de servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)

## errorCaptured

- **Tipo:** `(err: Error, instance: Component, info: string) => ?boolean`

- **Detalles:**

  Llamado cuando un error de cualquier componente secundario sea capturado. El _hook_ recibe tres argumentos: el error, la instancia de componente que disparó el error, y una cadena de caracteres que contiene información sobre dónde el error fuera capturado. El _hook_ puede retornar `false` para dejar el error de propagarse más lejos.

  :::tip
  Puede modificar el estado de componente en este _hook_, Sin embargo, es importante tener declaraciones condicionales (conditionals) en su plantilla o función _render_ que puedan saltarse otros contenidos cuando un error haya sido capturado, de lo contrario el componente puede entrar en un bucle infinito de renderización.
  :::

  **Reglas de Propagación de Error**

  - Por defecto, todos errores son todavía enviados al manejador global `config.errorHandler` si está definido, así que estos errores pueden todavía ser entregados a un servicio de análisis en un solo lugar.

  - Si múltiples _hooks_ de `errorCaptured` existen en la cadena de herencia o en la cadena de padres de un componente, todos ellos serán invocados sobre el mismo error.

  - Si el _hook_ `errorCaptured` mismo lanza un error, tanto este error como el error original capturado son enviados al manejador global `config.errorHandler`.

  - Un hook `errorCaptured` puede retornar `false` para dejar el error de propagarse más lejos. Esto es escencialmente decir que "este error ha sido manejado y debe ser ignorado." Prevendrá cualquieres _hooks_ adicionales de `errorCaptured` o el manejador global `config.errorHandler` de ser invocados sobre este error.

## renderTracked

- **Tipo:** `(e: DebuggerEvent) => void`

- **Detalles:**

  Llamado cuando la rerenderización de DOM virtual está rastreada. El _hook_ recibe un `debugger event` (evento de depuración) como un argumento. Este evento le informa qué operación rastreó el componente y el objeto de destino y clave de la operación.

- **Uso:**

  ```html
  <div id="app">
    <button v-on:click="addToCart">Añadir al carrito</button>
    <p>Carrito({{ cart }})</p>
  </div>
  ```

  ```js
  const app = createApp({
    data() {
      return {
        cart: 0
      }
    },
    renderTracked({ key, target, type }) {
      console.log({ key, target, type })
      /* Este será registrado cuando el componente sea renderizado por la primera vez:
      {
        key: "cart",
        target: {
          cart: 0
        },
        type: "get"
      }
      */
    },
    methods: {
      addToCart() {
        this.cart += 1
      }
    }
  })

  app.mount('#app')
  ```

## renderTriggered

- **Tipo:** `(e: DebuggerEvent) => void`

- **Detalles:**

  Llamado cuando la rerenderización de DOM virtual está rastreada. Similar a [`renderTracked`](#rendertracked), recibe un `debugger event` como un argumento. Este evento le informa qué operación disparó la rerenderización y el objeto de destino y clave de la operación.

- **Uso:**

  ```html
  <div id="app">
    <button v-on:click="addToCart">Añadir al carrito</button>
    <p>Carrito({{ cart }})</p>
  </div>
  ```

  ```js
  const app = createApp({
    data() {
      return {
        cart: 0
      }
    },
    renderTriggered({ key, target, type }) {
      console.log({ key, target, type })
    },
    methods: {
      addToCart() {
        this.cart += 1
        /* Este causará la llamada de renderTriggered
          {
            key: "cart",
            target: {
              cart: 1
            },
            type: "set"
          }
        */
      }
    }
  })

  app.mount('#app')
  ```
