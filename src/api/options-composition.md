# Composición

## mixins

- **Tipo:** `Array<Object>`

- **Detalles:**

  La opción `mixins` acepta una matriz de objetos _mixin_. Estos objetos _mixin_ pueden contener opciones de instancia como objetos normales de instancias, y serán fundidos contra las opciones eventuales utilizando la cierta lógica para fundir opciones. Por ejemplo, si su _mixin_ contiene un _hook_ `created` y el componente mismo también tiene uno, ambos funciones serán llamados.

  Los _hooks_ _mixin_ son llamados en el order que son proporcionados, y llamados antes de los propios hooks del componente.

  :::info
  En Vue 2, mixins fueron el principal mecanismo para crear fragmentos reutilizables de lógica de componente. Mientras mixins siguen siendo soportado en Vue 3, la [API de Composición](/guide/composition-api-introduction.html) ahora es el enfoque preferido para la reutilización de código entre componentes.
  :::

- **Ejemplo:**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

- **Vea también:** [Mixins](../guide/mixins.html)

## extends

- **Tipo:** `Object`

- **Detalles:**

  Permite un componente de extender otro, heredando sus opciones de componente.

  Desde una perspectiva de implementación, `extends` es casi igual a `mixins`. El componente especificado por `extends` será tratado como si sea el primero mixin.

  Sin embargo, `extends` y `mixins` expresan intenciones diferentes. La opcion `mixins` es principalmente utilizada para componer fragmentos de funcionalidad, mientras `extends` se ocupa principalmente de herencia.

  Como con `mixins`, cualquieras opciones serán fundidas utilizando la estrategia relevante de fundir.

- **Ejemplo:**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

## provide / inject

- **Tipo:**

  - **provide:** `Object | () => Object`
  - **inject:** `Array<string> | { [key: string]: string | Symbol | Object }`

- **Detalles:**

  Este par de opciones son utilizadas juntos para permitir un componente ancestro para servir como un inyector de dependencias para todos sus descendientes, sin tener en cuenta la profundidad de jerarquía de componente, siempre y cuando son en la misma cadena padre. Si está familizar con React, este es muy similar a la característica `context` de React.

  La opción `provide` debería ser un objeto u una función que retorna un objeto. Este objeto contiene las propiedades que son disponibles para inyección a sus descendientes. Puede utilizar los Symbols de ES2015 como claves en este objeto, pero solo en entornos que originalmente soportan `Symbol` y `Reflect.ownKeys`.

  La opción `inject` debería ser cualquier de las siguientes:

  - una matriz de cadenas de caracteres, o
  - un objeto dónode las claves son los nombres locales de vinculación y el valor es cualquier de estos:
    - la clave (cadena de caracteres o Symbol) para buscar en inyecciones disponibles, o
    - un objeto dónde:
      - la propiedad `from` es la clave (cadena de caracteres o Symbol) para buscar en inyecciones disponibles, y
      - la propiedad `default` es utilizada como un valor por defecto (fallback)

  > Note que las vinculaciones de `provide` y `inject` NO son reactivas. Este es deliberado. Sin embargo, si pasa un objeto reactivo, las propiedades de ese objeto mantienen reactivas.

- **Ejemplo:**

  ```js
  // el componente padre proporciona 'foo'
  const Provider = {
    provide: {
      foo: 'bar'
    }
    // ...
  }

  // el componente hijo inyecta 'foo'
  const Child = {
    inject: ['foo'],
    created() {
      console.log(this.foo) // => "bar"
    }
    // ...
  }
  ```

  Con Symbols de ES2015, función `provide` y objeto `inject`:

  ```js
  const s = Symbol()

  const Provider = {
    provide() {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s }
    // ...
  }
  ```

  Utilizando un valor inyectado como el valor por defecto para una _prop_:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Utilizando un valor inyectado como una entrada de dato:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Las inyecciones pueden ser opcionales con valores por defecto:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Si necesita inyectar una propiedad con un diferente nombre, utilice `from` para denotar la propiedad origional:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Similar a los valores por defecto de _prop_, necesita utilizar una función de fábrica para los valores que no son primitivos:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **Vea también:** [Provide / Inject](../guide/component-provide-inject.html)

## setup

- **Tipo:** `Function`

La función `setup` es una nueva opción de componente. Sirve como la punta de entrada para utilizar la API de Composición dentro de componentes.

- **Invocation Timing**

  `setup` es llamado justo después de la resolución inicial de _props_ cuando una instancia de componente sea creada. Lo mismo como el ciclo de vida, es llamado antes del hook [beforeCreate](./options-lifecycle-hooks.html#beforecreate) hook.

- **Uso con Plantillas**

  Si `setup` retorna un objeto, las propiedades del objeto serán fundidas en el contexto de renderización para la plantilla del componente:

  ```html
  <template>
    <div>{{ count }} {{ object.foo }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const count = ref(0)
        const object = reactive({ foo: 'bar' })

        // exponer a la plantilla
        return {
          count,
          object
        }
      }
    }
  </script>
  ```

  Note que [refs](refs-api.html#ref) retornadas de `setup` son automáticamente desenvueltas cuand accesadas en la plantilla, así que no es necesario escribir `.value` en las plantillas.

- **Uso con Funciones Render / JSX**

  `setup` puede también retornar una función _render_, lo que puede directamente aprovecha estados reactivos declarados en el mismo alcance:

  ```js
  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })

      return () => h('div', [count.value, object.foo])
    }
  }
  ```

- **Argumentos**

  La función recibe las _props_ resueltas como su primer argumento:

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      console.log(props.name)
    }
  }
  ```

  Note que este objeto `props` es reactivo, es decir, es actualizado cuando nuevas _props_ son pasados adentro, y puede ser observado y reaccionado según utilizar `watchEffect` o `watch`:

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      watchEffect(() => {
        console.log(`El nombre es: ` + props.name)
      })
    }
  }
  ```

  Sin embargo, NO desestructure el objeto `props`, debido a que se perderá la reactividad:

  ```js
  export default {
    props: {
      name: String
    },
    setup({ name }) {
      watchEffect(() => {
        console.log(`El nombre es: ` + name) // ¡Será reactivo!
      })
    }
  }
  ```

  El objeto `props` es inmutable para código del lado de usuario durante desarrollo (lanzará advertencias si el código de usuario trate de mutarlo).

  El segundo argumento proporciona un objeto de contexto que exponga varios objetos y funciones que podrían ser útiles en `setup`:

  ```js
  const MyComponent = {
    setup(props, context) {
      context.attrs
      context.slots
      context.emit
      context.expose
    }
  }
  ```

  `attrs`, `slots`, y `emit` son equivalentes a las propiedades de instancia [`$attrs`](/api/instance-properties.html#attrs), [`$slots`](/api/instance-properties.html#slots), y [`$emit`](/api/instance-methods.html#emit), respectivamente. 

  `attrs` y `slots` son _proxies_ a los valores correspondientes en la instancia internal de componente. Este asegura que siempre exponen los últimos valores, incluso detrás actualizaciones, así que podemos desestructurarlos sin preocuparnos por acceder una referencia obsoleta:

  ```js
  const MyComponent = {
    setup(props, { attrs }) {
      // Una función que podría ser llamada en una fase posterior
      function onClick() {
        console.log(attrs.foo) // garantizado como la última referencia
      }
    }
  }
  ```

  `expose`, agregado en Vue 3.2, es una función que permite especificar propiedades para ser expuestas mediante la instancia pública de componente. Por defecto, la instancia pública de componente recuperada utilizando refs, `$parent`, o `$root` es equivalente a la instancia internal utilizada por la plantilla. Llamar `expose` creará una instancia pública separada con las propiedades especificadas:

  ```js
  const MyComponent = {
    setup(props, { expose }) {
      const count = ref(0)
      const reset = () => count.value = 0
      const increment = () => count.value++

      // solo _reset_ será disponible externamente, p. ej. mediante $refs
      expose({
        reset
      })

      // Internamente, la plantilla tiene acceso a _count_ y _increment_
      return { count, increment }
    }
  }
  ```

  Hay un número de razones para poner `props` como un primero argumento separado en vez de incluirlo en el contexto:

  - Es mucho más común para un componente para utilizar `props` que otras propiedades, y muy a menudo un componente utiliza sólo `props`.

  - Tener `props` como un argumento separado lo hace más fácil para tiparlo individualmente sin confundir con los tipos de otras propiedades en el contexto. También lo hace posible mantener una signatura consistente entre `setup`, `render` y componentes planos funcionales con soporte de TSX.

- **Vea también:** [API de Composición](composition-api.html)
