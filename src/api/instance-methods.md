# Métodos de Instancias

## $watch

- **Argumentos:**

  - `{string | Function} source`
  - `{Function | Object} callback`
  - `{Object} options (opcional)`
    - `{boolean} deep`
    - `{boolean} immediate`
    - `{string} flush`

- **Retorna:** `{Function} unwatch`

- **Uso:**

  Observar los cambios de una propiedad reactiva o una función computada en la instancia de componente. El _callback_ será llamado con el valor nuevo y viejo para la propiedad dada. Podemos solo pasar nombres de las propiedades de nivel superior `data`, `props`, o `computed` como una cadena de caracteres. Para más expresiones complejas o propiedades anidadas, utilice una función en su lugar.

- **Ejemplo:**

  ```js
  const app = createApp({
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 4
        }
      }
    },
    created() {
      // nombre de una propiedad de nivel superior
      this.$watch('a', (newVal, oldVal) => {
        // hacer algo
      })

      // función para observar una sola propiedad anidada
      this.$watch(
        () => this.c.d,
        (newVal, oldVal) => {
          // hacer algo
        }
      )

      // función para observar una expresion compleja
      this.$watch(
        // cada vez la expresión `this.a + this.b` produce un resulto diferente,
        // el manejador será llamado. Es como si estuviéramos observando una propiedad
        // computada sin definir la propiedad computada mísma
        () => this.a + this.b,
        (newVal, oldVal) => {
          // hacer algo
        }
      )
    }
  })
  ```

  Cuando el valor observado es un objeto o matriz, cualquieres cambios a sus propiedades o elementos no dispararán el observador porque se refieren al mismo objeto/matriz:

  ```js
  const app = createApp({
    data() {
      return {
        article: {
          text: '¡Vue es genial!'
        },
        comments: ['¡De verdad!', 'Estoy de acuerdo']
      }
    },
    created() {
      this.$watch('article', () => {
        console.log('El artículo ha cambiado!')
      })

      this.$watch('comments', () => {
        console.log('Los comentarios han cambiado!')
      })
    },
    methods: {

      // Estos métodos no dispararán un observador porque cambiamos solo una propiedad del objeto/matriz,
      // en vez de sí mísmo
      changeArticleText() {
        this.article.text = 'Vue 3 es genial'
      },
      addComment() {
        this.comments.push('Nuevo comentario')
      },

      // Estos métodos dispararán un observador porque reemplazamos el objeto/matriz completamente
      changeWholeArticle() {
        this.article = { text: 'Vue 3 es genial' }
      },
      clearComments() {
        this.comments = []
      }
    }
  })
  ```

  `$watch` retorna una función de quitar observación (unwatch) que deje disparar el _callback_:

  ```js
  const app = createApp({
    data() {
      return {
        a: 1
      }
    }
  })

  const vm = app.mount('#app')

  const unwatch = vm.$watch('a', cb)
  // luego, derrumba el observador
  unwatch()
  ```

- **Opción: deep**

  Para también detectar cambios de valores anidados dentro de objetos, necesita pasar `deep: true` en el argumento de opciones. Esta opción también puede ser utilizada para observar mutaciones de matriz.

  > Note que cuando mute (en vez de reemplace) un objeto o matriz y observe con la opción _deep_, el valor viejo será igual como el valor nuevo porque se refieren al mismo objeto/matriz. Vue no posee una copia del valor antes de que se mute.

  ```js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback es disparado
  ```

- **Opción: immediate**

  Pasar `immediate: true` en la opción disparará el _callback_ inmediatamente con el valor corriente de la expresión:

  ```js
  vm.$watch('a', callback, {
    immediate: true
  })
  // `callback` es disparado inmediatamente con el valor corriente de `a`
  ```

  Note que con opción `immediate` no será capaz de quitar la observación a una propiedad dada en la primera llamada de _callback_.

  ```js
  // Este resultará un error
  const unwatch = vm.$watch(
    'value',
    function() {
      doSomething()
      unwatch()
    },
    { immediate: true }
  )
  ```

  Si todavía quiere llamar una función de quitar observación dentro del _callback_, debería comprobar su disponibilidad primero:

  ```js
  let unwatch = null

  unwatch = vm.$watch(
    'value',
    function() {
      doSomething()
      if (unwatch) {
        unwatch()
      }
    },
    { immediate: true }
  )
  ```

- **Opción: flush**

  La opción `flush` permite un mayor control sobre la temporizción del _callback_. Puede establecerse como `'pre'`, `'post'` o `'sync'`.

  El valor por defecto es `'pre'`, lo que especifica que el _callback_ debe ser invocado antes de la renderización. Este permite que el _callback_ actualice otros valores antes de que se ejecute la plantilla.

  El valor `'post'` puede ser utilizado para diferir el callback hasta después de la renderización. Este debería ser utilizado si el _callback_ necesite acceso al DOM actualizado o los componentes hijos mediante `$refs`.

  Si `flush` se establece como `'sync'`, el _callback_ será llamado sincrónicamente, tan pronto como se cambie el valor.

  Para `'pre'` y `'post'`, el _callback_ es amortiguado utilizando una cola. El _callback_ será agregado a la cola una sola vez, incluso si el valor observado se ha cambiado múltiples veces. El valor intermedio se omitirá y no se pasará al _callback_.

  Amortiguar el _callback_ no solo mejorar el rendimiento sino también ayuda a asegurarse la consistencia de dato. Los observadores no serán disparados hasta que se haya terminado el código que realice las actualizaciones de dato.

  Los observadores de `'sync'` deberían ser utilizados con moderación, como no poseen estos beneficios.

  Para más información sobre `flush` véase [la temporización para tirar de la cadena de los efectos secundarios](../guide/reactivity-computed-watchers.html#effect-flush-timing).

- **Vea también:** [Observadores](../guide/computed.html#watchers)

## $emit

- **Argumentos:**

  - `{string} eventName`
  - `...args (opcional)`

  Disparar un evento en la instancia corriente. Cualquieres argumentos adicionales serán pasados a la función _callback_ del escuchador.

- **Ejemplos:**

  Utilizar `$emit` con solo un nombre de evento:

  ```html
  <div id="emit-example-simple">
    <welcome-button v-on:welcome="sayHi"></welcome-button>
  </div>
  ```

  ```js
  const app = createApp({
    methods: {
      sayHi() {
        console.log('¡Hola!')
      }
    }
  })

  app.component('welcome-button', {
    emits: ['welcome'],
    template: `
      <button v-on:click="$emit('welcome')">
        Hazme clic para recibir bienvenidas
      </button>
    `
  })

  app.mount('#emit-example-simple')
  ```

  Utilizar `$emit` con argumentos adicionales:

  ```html
  <div id="emit-example-argument">
    <advice-component v-on:advise="showAdvice"></advice-component>
  </div>
  ```

  ```js
  const app = createApp({
    methods: {
      showAdvice(advice) {
        alert(advice)
      }
    }
  })

  app.component('advice-component', {
    emits: ['advise'],
    data() {
      return {
        adviceText: 'Cierto consejo'
      }
    },
    template: `
      <div>
        <input type="text" v-model="adviceText">
        <button v-on:click="$emit('advise', adviceText)">
          Hazme clic para enviar un consejo
        </button>
      </div>
    `
  })

  app.mount('#emit-example-argument')
  ```

- **Vea también:**
  - [la opción `emits`](./options-data.html#emits)
  - [Emitir un valor con un Evento](../guide/component-basics.html#emitting-a-value-with-an-event)

## $forceUpdate

- **Uso:**

  Forzar la rerenderización de la instancia de componente. Note que no aafecta a todos componentes hijos, solo la instancia mísma y los componentes hijos con contenidos de _slot_ insertados.

## $nextTick

- **Argumentos:**

  - `{Function} callback (opcional)`

- **Uso:**

  Diferir la ejecución del _callback_ hasta el próximo ciclo de actualización DOM. Utilícelo inmediatamente después de que haya cambiado unos datos para esperar la actualización DOM. Esto es lo mismo como el método global `nextTick`, excepto que el contexto `this` del _callback_ sea vinculado automáticamente a la instancia que llame a este método.

- **Ejemplo:**

  ```js
  createApp({
    // ...
    methods: {
      // ...
      example() {
        // modificar dato
        this.message = 'changed'
        // DOM aún no es actualizado
        this.$nextTick(function() {
          // DOM ya es actualizado
          // `this` es vinculado a la instancia corriente
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **Vea también:** [nextTick](global-api.html#nexttick)
