# Mixins

## Básicos

Los _mixins_ distribuyen funcionalidades reutilizables para componentes Vue. Un objeto _mixin_ puede contener cualquier opción de componente. Cuando un componente utiliza un _mixin_, todas las opciones en el mixins se “mezclarán” en las propias opciones del componente.

Ejemplo:

```js
// definir un objeto mixin
const myMixin = {
  created() {
    this.hello()
  },
  methods: {
    hello() {
      console.log('¡hola desde mixin!')
    }
  }
}

// definir una aplicación qu utiliza este _mixin_
const app = Vue.createApp({
  mixins: [myMixin]
})

app.mount('#mixins-basic') // => "¡hola desde mixin!"
```

## Fusión de Opciones

Cuando un _mixin_ y el componente mismo contienen opciones superpuestas, se “fusionarán” utilizando estrategias apropiadas.

Por ejemplo, cada _mixin_ puede tener su propia función `data`. Cada una de ellas serán llamado, y los objetos retornados serán fusionado. Las propiedades de los propios datos del componente tienen prioridad en caso de conflictos.

```js
const myMixin = {
  data() {
    return {
      message: 'hola',
      foo: 'abc'
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  data() {
    return {
      message: 'adiós',
      bar: 'def'
    }
  },
  created() {
    console.log(this.$data) // => { message: "adiós", foo: "abc", bar: "def" }
  }
})
```

Las funciones _hook_ con el mismo nombre serán fusionado en una matriz para que todas de ellas serán llamado. Hooks de _mixin_ serán llamado **antes** de los propios hooks del componente.

```js
const myMixin = {
  created() {
    console.log('hook de mixin está llamado')
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  created() {
    console.log('hook del componente está llamado')
  }
})

// => "hook de mixin está llamado"
// => "hook del componente está llamado"
```

Las opciones, excepto valores de objetos, por ejemplo `methods`, `components` y `directives`, serán fusionado en el mismo objeto. Las opciones del componente tendrán prioridad cuando hay claves conflictos en estos objetos:

```js
const myMixin = {
  methods: {
    foo() {
      console.log('foo')
    },
    conflicting() {
      console.log('desde mixin')
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  methods: {
    bar() {
      console.log('bar')
    },
    conflicting() {
      console.log('desde sí mismo')
    }
  }
})

const vm = app.mount('#mixins-basic')

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "desde sí mismo"
```

## Mixin Global

Puede también aplicar un _mixin_ globalmente para una aplicación Vue:

```js
const app = Vue.createApp({
  myOption: '¡hola!'
})

// inyectar un manejador para la opción personalizada `myOption`
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

app.mount('#mixins-global') // => "¡hola!"
```

¡Utilizarlo con precaución! Una vez que aplique un _mixin_ globalmente, afectará **cada** instancia de componente creada posteriormente en la aplicación dada (por ejemplo, en los componentes secundarios):

```js
const app = Vue.createApp({
  myOption: '¡hola!'
})

// inyectar un manejador para la opción personalizada `myOption`
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

// también agregar myOption a componentes secundarios
app.component('test-component', {
  myOption: '¡hola desde el component!'
})

app.mount('#mixins-global')

// => "¡hola!"
// => "¡hola desde el component!"
```

En la mayoría de los casos, debería solo utilizarlo para manipular opciones personalizadas como demonstrado en el ejemplo anterior arriba. Es también un buen idea ofrecerlos como [plugins](plugins.html) para evitar aplicación doble.

## Estrategias de Fusión de Opciones Personalizadas

Cuando las opciones personalizadas se fusionan, utilizan la estrategia por defecto que sobrescribe el valor existente. Si desea que una opción personalizada se fusione utilizando lógica personalizada, debe adjuntar una función a `app.config.optionMergeStrategies`:

```js
const app = Vue.createApp({})

app.config.optionMergeStrategies.customOption = (toVal, fromVal) => {
  // retorna valor fusionado
}
```

La estrategia de fusión recibe el valor de aquella opción definida en la instancia de padre y hijo como el primero y segundo argumento, respectivamente. Tratemos de probar qué tenemos en estos parámetros cuando utilizamos un _mixin_:

```js
const app = Vue.createApp({
  custom: '¡hola!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => {
  console.log(fromVal, toVal)
  // => "¡adiós!", undefined
  // => "¡hola!", "¡adiós!"
  return fromVal || toVal
}

app.mixin({
  custom: '¡adiós!',
  created() {
    console.log(this.$options.custom) // => "¡hola!"
  }
})
```

Como puede ver, en la consola tenemos `toVal` y `fromVal` impreso primero desde el _mixin_ y luego de la `app`. Siempre retornamos `fromVal` si existe, eso es porque `this.$options.custom` se establece como `¡hola!` al fin. Tratemos de cambiar una estrategia para que _siempre retorne un valor desde la instancia del hijo_:

```js
const app = Vue.createApp({
  custom: '¡hola!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => toVal || fromVal

app.mixin({
  custom: '¡adiós!',
  created() {
    console.log(this.$options.custom) // => "¡adiós!"
  }
})
```

## Ddesventajas

En Vue 2, _mixins_ estuvieron la hierramienta primaria para abstraer partes de la lógica de componentes en fragmentos reutilizables. Sin embargo, tuvieron unas problemas:

- _Mixins_ son fáciles de provocar conflictos: Debido a que las propiedades de cada _mixin_ son fusionado en el mismo componente, todavía tiene que saber todos los otros _mixins_ para evitar conflictos de nombres de propiedades.

- Parece que las propiedades aparecen de la nada: si un componente utiliza múltiples _mixins_, no es muy claro cual propiedad viene de cual _mixin_.

- Reutilizabilidad es limitado: no podemos pasar cualquiere parámetro al _mixin_ para cambiar su lógica, lo cual reduce su flexibilidad en términos de abstraer lógica.

Para abordar estas problemas, agregamos un nuevo método para organizar código por preocupaciones lógicas: la [API de Composición](composition-api-introduction.html).
