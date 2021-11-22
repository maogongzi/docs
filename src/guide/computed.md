# Propiedades Computadas y Observadores

## Propiedades Computadas

<VideoLesson href="https://vueschool.io/lessons/computed-properties-in-vue-3?friend=vuejs" title="Aprender cómo propiedades computadas funcionan en Vue School">Aprender cómo propiedades computadas funcionan con una lección gratis en Vue School</VideoLesson>

Las expresiones dentro de plantillas son muy convenientes, pero son diseñado para operaciones sencillas. Poner demasiada lógica dentro de tus plantillas puede hacerlas infladas y difíciles de mantener. Por ejemplo, si tenemos un objeto con una matriz anidado:

```js
Vue.createApp({
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Guía Avanzada',
          'Vue 3 - Guía Básica',
          'Vue 4 - El Misterio'
        ]
      }
    }
  }
})
```

Y queremos mostrar mensajes diferentes dependiendo de si `author` ya ha poseído unos libros o no

```html
<div id="computed-basics">
  <p>Ha publicado libros:</p>
  <span>{{ author.books.length > 0 ? 'Sí' : 'No' }}</span>
</div>
```

En este momento, la plantilla no es más sencilla y declarativa. Tiene que revisarlo por un segundo antes de darse cuenta de que ejerza una calculación dependiendo de `author.books`. El problema empeorará cuando quiere incluir esta calculación en tu plantilla más que una vez.

Es porque para lógica compleja que incluye dato reactivo, debería utilizar una **propiedad computada**.

### Ejemplo Básico

```html
<div id="computed-basics">
  <p>Ha publicado libros:</p>
  <span>{{ publishedBooksMessage }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Guía Avanzada',
          'Vue 3 - Guía Básica',
          'Vue 4 - El Misterio'
        ]
      }
    }
  },
  computed: {
    // un captador computado
    publishedBooksMessage() {
      // `this` apunta a la instancia vm
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}).mount('#computed-basics')
```

Resultado:

<common-codepen-snippet title="Ejemplo básico de Computed" slug="NWqzrjr" tab="js,result" :preview="false" />

Aquí hemos declarado una propiedad computada `publishedBooksMessage`.

Trate de cambiar el valor de la matriz `books` del atributo `data` de la aplicación y verá como `publishedBooksMessage` está cambiando en consecuencia.

Puede vincular datos a las propiedades computadas en plantillas justo como a propiedades normales. Vue es consciente de que `vm.publishedBooksMessage` depende de `vm.author.books`, así que actualizará cualquieras vinculaciones que dependan de `vm.publishedBooksMessage` cuando `vm.author.books` cambie. Y la mejor parte es que hemos creado esta relación de dependencia declaramente: el función de captador computado no tiene efectos secundarios, lo cual hace que sea más fácil para probar y comprender.

### Caché de Computed versus Métodos

Usted puede haber notado que podemos lograr el mismo resultado mediante invocar un método en la expresión:

```html
<p>{{ calculateBooksMessage() }}</p>
```

```js
// dentro del componente
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Sí' : 'No'
  }
}
```

En ves de una propiedad computada, podemos definir el mismo función como un método, para el resultado final, los dos enfoques son en efecto el mismo, exactamente. Sin embargo, la diferencia es que **las propiedades computadas son almacenado en caché basado de sus dependencias reactivas.** Una propiedad computado solo será reevaluado cuando unos de sus dependencias reactivas hayan cambiado. Esto significa que siempre y cuando `author.books` no haya cambiado, múltiples accesos a la propiedad computada `publishedBooksMessage` retornará inmediatamente el previo resultado computado sin ejecutar el función de nuevo.

Esto también significa que la siguiente propiedad computada nonca se actualizará, porque `Date.now()` no es una dependencia reactiva:

```js
computed: {
  now() {
    return Date.now()
  }
}
```

En comparación, una invocación de método **siempre** ejecutará el función cada vez que una re-renderización occurre.

Por qué necesitamos caché? Imagine que tenemos una propiedad computada `list`, lo que requiere recorrer una gran matriz y hacer un montón de computaciones, Entonces podríamos tener otras propiedades computadas que a su vez depende de `list`. Sin caché, ¡estaríamos ejecutiendo el cargador de `list` muchos más veces de lo necesario! En los casos donde no necesita caché, utilice un `método` en su lugar.

### Establecedor Computado

Las propiedades computadas son por defecto solo cargadores, pero puede también proporcionar un establecedor cuando lo necesite:

```js
// ...
computed: {
  fullName: {
    // cargador
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // establecedor
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Ahora cuando ejecuta `vm.fullName = 'John Doe'`, el establecedor será invocado y `vm.firstName` y `vm.lastName` serán actualizado en consecuencia.

## Observadores

Mientras que propiedades computadas son más apropiadas en la mayoría de los casos, hay momentos cuando un observador personalizada es necesario. Eso es porque Vue proporciona una manera más genérica para reaccionar a cambios de datos por la opción `watch`. Esto es muy útil cuando quiere ejecutar operaciones asincrónicas o caras en respuesta a cambios de dato.

Por ejemplo:

```html
<div id="watch-example">
  <p>
    Plantea una pregunta de sí/no:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</div>
```

```html
<!-- Dado que ya existe una ecosistema rica de librerías ajax, -->
<!-- y colecciones de métodos de utilidades de uso general, El núcleo de Vue -->
<!-- puede mantenerse pequeño mediante no reinventarlos. Esto también -->
<!-- le brinda la libertad de utilizar con lo que está familiarizado. -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script>
  const watchExampleVM = Vue.createApp({
    data() {
      return {
        question: '',
        answer: 'Preguntas usualmente contienen un signo de interrogación. ;-)'
      }
    },
    watch: {
      // Cada vez que la pregunta cambia, este función ejecutará
      question(newQuestion, oldQuestion) {
        if (newQuestion.indexOf('?') > -1) {
          this.getAnswer()
        }
      }
    },
    methods: {
      getAnswer() {
        this.answer = 'Piensando...'
        axios
          .get('https://yesno.wtf/api')
          .then(response => {
            this.answer = response.data.answer
          })
          .catch(error => {
            this.answer = '¡Error! No se puede alcanzar al API. ' + error
          })
      }
    }
  }).mount('#watch-example')
</script>
```

Result:

<common-codepen-snippet title="Ve el ejemplo básico" slug="GRJGqXp" tab="result" :preview="false" />

En este caso, utilizar la opción `watch` nos permite ejecutar una operación asincrónica (acceder un API) y establecer una condición para ejecutar esta operación. Nada de eso puede ser posible con una propiedad computada.

Además de la opción `watch`, puede también utilizar el API imperativo [vm.$watch](../api/instance-methods.html#watch).

### Computed vs Watched Property

Vue proporciona una manera más genérica para observar y reaccionar a cambios de dato de una instancia activa: **propiedades de observación**. Cuando tiene algo dato que necesita cambiar basada en algunos otros datos, es tentador utilizar excesivamente `watch` - especialmente si viene de un fondo de AngularJS. Sin embargo, a menudo es una mejor idea utilizar una propiedad computada en vez de una _callback_ imperativa de `watch`. Considere este ejemplo:

```html
<div id="demo">{{ fullName }}</div>
```

```js
const vm = Vue.createApp({
  data() {
    return {
      firstName: 'Foo',
      lastName: 'Bar',
      fullName: 'Foo Bar'
    }
  },
  watch: {
    firstName(val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName(val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}).mount('#demo')
```

El código arriba es imperativa y repetitiva. Compárelo con una versión de propiedad computada:

```js
const vm = Vue.createApp({
  data() {
    return {
      firstName: 'Foo',
      lastName: 'Bar'
    }
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}).mount('#demo')
```

Much mejor, ¿no? 
