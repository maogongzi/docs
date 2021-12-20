# Dato

## data

- **Tipo:** `Function`

- **Detalles:**

  La función que retorna un objeto de dato para la instancia del componente. En `data`, no recomendamos observar objetos que poseen sus comportamientos propios con estado como los objetos de API del navegador y las propiedades de _prototype_. Una buena idea sería mantener aquí solo un objeto plano que represente los datos del componente.

  Una vez observado, ya no puede agregar propiedades reactivas al objeto raíz de dato. Por lo tanto, es recomendado declarar todas propiedades reactivas de nivel raíz por adelantado, antes de crear la instancia.

  Después de que se ha creado la instancia, el objeto original de dato puede ser accesado como `vm.$data`. La instancia del componente también delega todas las propiedades encontradas en el objeto de dato, así que `vm.a` será equivalente a `vm.$data.a`.

  Las propiedades que empiezan con `_` o `$` **no** serán delegadas en la instancia del componente porque pueden entrar en conflicto con las propiedades internales y métodos de API de Vue. Tendrá que accederlas como `vm.$data._property`.

- **Ejemplo:**

  ```js
  // crear una instancia directamente
  const data = { a: 1 }

  // El objeto es agregado a una instancia de componente
  const vm = createApp({
    data() {
      return data
    }
  }).mount('#app')

  console.log(vm.a) // => 1
  ```

  Note que si utiliza una función de flecha con la propiedad `data`, `this` no será la instancia del componente, pero puede también acceder la instancia como el primero argumento de la función:

  ```js
  data: vm => ({ a: vm.myProp })
  ```

- **Vea también:** [Reactividad en profundidad](../guide/reactivity.html)

## props

- **Tipo:** `Array<string> | Object`

- **Detalles:**

  Una lista/_hash_ de atributos que son expuestos para aceptar dato del componente padre. Tiene una sintaxis simple basada de _Array_ y una sintaxis alternativa basada de _Object_ que permite configuraciones avanzadas tales como comprobación de tipos, validación personalizada y valores por defecto.

  Con la sintaxis basada de _Object_, puede utilizar las siguientes opciones:

  - `type`: puede ser uno de los siguientes constructores nativos: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, cualquiera función de constructor personalizada u una matriz de estos. Comprobará si una _prop_ tiene un tipo dado, y lanzará una advertencia si no lo tiene. [Más información](../guide/component-props.html#prop-types) sobre tipos de _prop_.
  - `default`: `any`
    Especifica un valor por defector para la _prop_. Si la _prop_ no es pasada, este valor será utilizado en su lugar. Los valores por defecto de objeto or matriz deben retornarse de una función de fábrica.
  - `required`: `Boolean`
    Define si la _prop_ es requerida. En un entorno que no es de producción, una advertencia de consola será lanzada si este valor es verdadero y la _prop_ no es pasada.
  - `validator`: `Function`
    Función personalizada de validador que toma el valor de la _prop_ como el argumento solo. En un entorno que no es de producción, una advertencia será lanzada si esta función retorna un valor falso (p. ej. se falla la validación). Puede leer más sobre la validación de _prop_ [aquí](../guide/component-props.html#prop-validation).

- **Ejemplo:**

  ```js
  const app = createApp({})

  // la sintaxis simple
  app.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // La sintaxis de objeto con validación
  app.component('props-demo-advanced', {
    props: {
      // comprobación de tipo
      height: Number,
      // comprobación de tipo más otras validaciones
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: value => {
          return value >= 0
        }
      }
    }
  })
  ```

- **Vea también:** [_Props_](../guide/component-props.html)

## computed

- **Tipo:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **Detalles:**

  Las propiedades computadas para ser fundidas en la instancia de componente. Todos captadores y establecedores tienen sus contextos de `this` automáticamente vinculados a la instancia de componente.

  Note que si utiliza una función de flecha con una propiedad computada, `this` no será la instancia de componente, pero puede también acceder la instancia como el primero argumento de la función:

  ```js
  computed: {
    aDouble: vm => vm.a * 2
  }
  ```

  Las propiedades computadas son almacenadas en _cache_, y solo recalculadas cuando se cambien las dependencias reactivas. Note que si una cierta dependencia es afuera del alcance de la instancia (es decir, non reactiva), la propiedad computada **no** será actualizada.

- **Ejemplo:**

  ```js
  const app = createApp({
    data() {
      return { a: 1 }
    },
    computed: {
      // solo captador
      aDouble() {
        return this.a * 2
      },
      // captador y establecedor
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    }
  })

  const vm = app.mount('#app')
  console.log(vm.aPlus) // => 2
  vm.aPlus = 3
  console.log(vm.a) // => 2
  console.log(vm.aDouble) // => 4
  ```

- **Vea también:** [Propiedades Computadas](../guide/computed.html)

## methods

- **Tipo:** `{ [key: string]: Function }`

- **Detalles:**

  Métodos para ser fundidas en la instancia de componente. Puede acceder estos métodos directamente en la instancia VM, o utilizarlos en expresiones directivas. Todos métodos tendrán sus contextos de `this` automáticamente vinculados a la instancia de componente.

  :::tip Note
  Note que **no debe utilizar una función de flecha para definir un método** (p. ej. `plus: () => this.a++`). La razón es que las funciones de flecha vinculan al contexto padre, así que `this` no será la instancia de componente como usted espere y `this.a` será _undefined_.
  :::

- **Ejemplo:**

  ```js
  const app = createApp({
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    }
  })

  const vm = app.mount('#app')

  vm.plus()
  console.log(vm.a) // => 2
  ```

- **Vea también:** [Manejo de Eventos](../guide/events.html)

## watch

- **Tipo:** `{ [key: string]: string | Function | Object | Array}`

- **Detalles:**

  Un objeto dónde las claves son propiedades reactivas para observar, los ejemplos incluyen propiedades de [_data_](/api/options-data.html#data-2) o [_computed_](/api/options-data.html#computed), y los valores son los _callbacks_ correspondientes. El valore puede también ser una cadena de caracteres del nombre de un método, o un objeto que contiene opciones adicionales. La instancia de componente llamará `$watch()` para cada entrada del objeto cuando se instancie. Vea [$watch](instance-methods.html#watch) para más información sobre las opciones `deep`, `immediate` y `flush`.

- **Ejemplo:**

  ```js
  const app = createApp({
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // Observar propiedades de nivel superior
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // nombre de método de cadena de caracteres
      b: 'someMethod',
      // el callback será llamado siempre que cualquiera de las propiedades del objeto observado se cambie, sin tener en cuenta sus profundidades anidadas.
      c: {
        handler(val, oldVal) {
          console.log('c se ha cambiado')
        },
        deep: true
      },
      // Observar una sola propiedad anidada:
      'c.d': function (val, oldVal) {
        // hacer algo
      },
      // el callback será llamado inmediatamente después del inicio de la observación
      e: {
        handler(val, oldVal) {
          console.log('e se ha cambiado')
        },
        immediate: true
      },
      // puede pasar una matriz de callbacks, serán llamado uno por uno
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 disparado')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 disparado')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b se ha cambiado')
      },
      handle1() {
        console.log('handle 1 disparado')
      }
    }
  })

  const vm = app.mount('#app')

  vm.a = 3 // => new: 3, old: 1
  ```

  ::: tip Note
  Note que _no debe utilizar una función de flecha para definir un observador_ (p. ej. `searchQuery: newValue => this.updateAutocomplete(newValue)`). La razón es que las funciones de flecha vinculan al contexto padre, así que `this` no será la instancia de componente como usted espere y `this.updateAutocomplete` será _undefined_.
  :::

- **Vea también:** [Observadores](../guide/computed.html#watchers)

## emits

- **Tipo:** `Array<string> | Object`

- **Detalles:**

  Una lista/_hash_ de eventos personalizados que pueden ser emitidos del componente. Tiene una sintaxis simple basada de _Array_ y una sintaxis alternativa basada de _Object_ que permite configurar una validación de evento.

  En la sintaxis basada de _Object_, el valor de cada propiedad puede ser tanto `null` como una función de validador. La función de validación recibirá los argumentos adicionales pasados a la llamada `$emit`. Por ejemplo, si `this.$emit('foo', 1)` es llamado, el validador correspondiente para `foo` recibirá el argumento `1`. La función de validador debe retornar un booleano para indicar si los argumentos de evento sean válidos o no.

- **Uso:**

  ```js
  const app = createApp({})

  // La sintaxis de Array
  app.component('todo-item', {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  })

  // la sintaxis de Object
  app.component('reply-form', {
    emits: {
      // sin validación
      click: null,

      // con validación
      submit: payload => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`¡Cargamento inválido de evento submit!`)
          return false
        }
      }
    }
  })
  ```

  ::: tip Note
  Eventos enumerados en la opción `emits` **no** serán heredados por el elemento raíz del componente y también serán excluidos de la propiedad `$attrs`.
  :::

* **Vea también:** [Herencia de Atributos](../guide/component-attrs.html#attribute-inheritance)

## expose <Badge text="3.2+" />

- **Tipo:** `Array<string>`

- **Detalles:**

  Una lista de propiedades para exponer en la instancia pública del componente.
  A list of properties to expose on the public component instance.

  Por defecto, la instancia pública accesada mediante [`$refs`](/api/instance-properties.html#refs), [`$parent`](/api/instance-properties.html#parent), o [`$root`](/api/instance-properties.html#root) es la mísma como la instancia internal de componente utilizada por la plantilla. La opción `expose` limita las propiedades que puedan ser accesadas mediante la instancia pública.

  Las propiedades definidas por Vue mismo, tales como `$el` y `$parent`, serán siempre disponibles en la instancia pública y no necesitan ser enumeradas.

- **Uso:**

  ```js
  export default {
    // _increment_ será expuesto pero _count_
    // será solo disponible internalmente
    expose: ['increment'],

    data() {
      return {
        count: 0
      }
    },

    methods: {
      increment() {
        this.count++
      }
    }
  }
  ```

- **Vea también:** [defineExpose](/api/sfc-script-setup.html#defineexpose)
