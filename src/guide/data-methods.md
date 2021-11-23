# Propiedades y Métodos de Dato

<VideoLesson href="https://vueschool.io/lessons/methods-in-vue-3?friend=vuejs" title="Aprender cómo utilizar métodos en Vue School">Aprender cómo trabajar con dato y métodos con una lección gratis en Vue School</VideoLesson>

## Propiedades de Dato

La opción `data` para un componente es un función. Vue lo llama como una parte del proceso de la creación de una nueva instancia de componente. Debería retornar un objeto, lo cual Vue va a envolver en su sistema reactiva y almancenarlo en la instancia componente como `$data`. Por conveniencia, cualquiera propiedad de nivel superior de ese objeto son también expuesto directamente mediante la instancia componente:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// Asignar un valor a vm.count también actualizará $data.count
vm.count = 5
console.log(vm.$data.count) // => 5

// ... y viceversa
vm.$data.count = 6
console.log(vm.count) // => 6
```

Estas propiedades de instancia son solo agregado cuando la instancia es creada inicialmente, así que necesita asegurar que ellas están presentes en el objeto retornado por la función `data`. Si es necesario, utiliza `null`, `undefined` o algunos otros valores de marcadores de posición dónde el valor deseado no haya sido disponible ya.

Es posible agregar una nueva propiedad directamente a la instancia componente sin incluirlo en `data`. Sin embargo, debido a que esta propiedad no está respaldado por el objeto reactivo `$data`, no será rastreado automáticamente por la [Sistema reactiva de Vue](reactivity.html).

Vue uses a `$` prefix when exposing its own built-in APIs via the component instance. It also reserves the prefix `_` for internal properties. You should avoid using names for top-level `data` properties that start with either of these characters.

## Methods

To add methods to a component instance we use the `methods` option. This should be an object containing the desired methods:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  },
  methods: {
    increment() {
      // `this` will refer to the component instance
      this.count++
    }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4

vm.increment()

console.log(vm.count) // => 5
```

Vue automatically binds the `this` value for `methods` so that it always refers to the component instance. This ensures that a method retains the correct `this` value if it's used as an event listener or callback. You should avoid using arrow functions when defining `methods`, as that prevents Vue from binding the appropriate `this` value.

Just like all other properties of the component instance, the `methods` are accessible from within the component's template. Inside a template they are most commonly used as event listeners:

```html
<button @click="increment">Up vote</button>
```

In the example above, the method `increment` will be called when the `<button>` is clicked.

It is also possible to call a method directly from a template. As we'll see shortly, it's usually better to use a [computed property](computed.html) instead. However, using a method can be useful in scenarios where computed properties aren't a viable option. You can call a method anywhere that a template supports JavaScript expressions:

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

If the methods `toTitleDate` or `formatDate` access any reactive data then it will be tracked as a rendering dependency, just as if it had been used in the template directly.

Methods called from a template should not have any side effects, such as changing data or triggering asynchronous processes. If you find yourself tempted to do that you should probably use a [lifecycle hook](instance.html#lifecycle-hooks) instead.

### Debouncing and Throttling

Vue doesn't include built-in support for debouncing or throttling but it can be implemented using libraries such as [Lodash](https://lodash.com/).

In cases where a component is only used once, the debouncing can be applied directly within `methods`:

```html
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      // Debouncing with Lodash
      click: _.debounce(function() {
        // ... respond to click ...
      }, 500)
    }
  }).mount('#app')
</script>
```

However, this approach is potentially problematic for components that are reused because they'll all share the same debounced function. To keep the component instances independent from each other, we can add the debounced function in the `created` lifecycle hook:

```js
app.component('save-button', {
  created() {
    // Debouncing with Lodash
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // Cancel the timer when the component is removed
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... respond to click ...
    }
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `
})
```
