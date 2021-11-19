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

In comparison, a method invocation will **always** run the function whenever a re-render happens.

Why do we need caching? Imagine we have an expensive computed property `list`, which requires looping through a huge array and doing a lot of computations. Then we may have other computed properties that in turn depend on `list`. Without caching, we would be executing `list`’s getter many more times than necessary! In cases where you do not want caching, use a `method` instead.

### Computed Setter

Computed properties are by default getter-only, but you can also provide a setter when you need it:

```js
// ...
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Now when you run `vm.fullName = 'John Doe'`, the setter will be invoked and `vm.firstName` and `vm.lastName` will be updated accordingly.

## Observadores

While computed properties are more appropriate in most cases, there are times when a custom watcher is necessary. That's why Vue provides a more generic way to react to data changes through the `watch` option. This is most useful when you want to perform asynchronous or expensive operations in response to changing data.

For example:

```html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</div>
```

```html
<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to use what you're familiar with.      -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script>
  const watchExampleVM = Vue.createApp({
    data() {
      return {
        question: '',
        answer: 'Questions usually contain a question mark. ;-)'
      }
    },
    watch: {
      // whenever question changes, this function will run
      question(newQuestion, oldQuestion) {
        if (newQuestion.indexOf('?') > -1) {
          this.getAnswer()
        }
      }
    },
    methods: {
      getAnswer() {
        this.answer = 'Thinking...'
        axios
          .get('https://yesno.wtf/api')
          .then(response => {
            this.answer = response.data.answer
          })
          .catch(error => {
            this.answer = 'Error! Could not reach the API. ' + error
          })
      }
    }
  }).mount('#watch-example')
</script>
```

Result:

<common-codepen-snippet title="Watch basic example" slug="GRJGqXp" tab="result" :preview="false" />

In this case, using the `watch` option allows us to perform an asynchronous operation (accessing an API) and sets a condition for performing this operation. None of that would be possible with a computed property.

In addition to the `watch` option, you can also use the imperative [vm.$watch API](../api/instance-methods.html#watch).

### Computed vs Watched Property

Vue does provide a more generic way to observe and react to data changes on a current active instance: **watch properties**. When you have some data that needs to change based on some other data, it is tempting to overuse `watch` - especially if you are coming from an AngularJS background. However, it is often a better idea to use a computed property rather than an imperative `watch` callback. Consider this example:

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

The above code is imperative and repetitive. Compare it with a computed property version:

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

Much better, isn't it?
