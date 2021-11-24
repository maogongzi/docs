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

Vue utiliza un prefijo `$` cuando expone sus propios API integrados mediante la instancia de componente. También reserva el prefijo `_` para propiedades internas. debería evitar utilizar nombres que empecen con cualquier de las caracteres para las propiedades de nivel superior de `data`.

## Métodos

Para agregar métodos a una instancia de componente utilizamos la opción `methods`. Esta debería ser un objeto que incluye los métodos deseados:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  },
  methods: {
    increment() {
      // `this` apuntará a la instancia de componente
      this.count++
    }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4

vm.increment()

console.log(vm.count) // => 5
```

Vue automáticamente vincula el valor de `this` para `methods` para que el siempre refiere a la instancia de componente. Esto asegura que un método retiene el valor correcto de `this` si está utilizado como un escuchador de eventos o _callback_. Debería evitar utilizar funciones de flecha cuando define `methods`, porque eso previene que Vue vincule el valor apropiado de `this`.

Justo como todas otras propiedades de la instancia de componente, los funciones de `methods` son accesible desde dentro de la plantilla del componente. Dentro de una plantilla son utilizados con mayor frecuencia como escuchadores de evento:

```html
<button @click="increment">Votar</button>
```

En el ejemplo arriba, el método `increment` será llamado cuando se hace clic en el botón `<button>`.

Es también posible llamar a un método directamente desde una plantilla. Como pronto los veremos, es usualmente mejor utilizar una [propiedad computada](computed.html) en su lugar. Sin embargo, utilizar un método puede ser útil en escenarios donde las propiedades computadas no son opciones viables. Puede llamar a un método en cualquier lugar de una plantilla donde se admiten las expresiones JavaScript:

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

Si los métodos `toTitleDate` o `formatDate` acceden cualquier dato reactivo, entonces será rastreado como una dependencia de renderización, justo como si haya sido utilizado en la plantilla directamente.

Los métodos llamados desde una plantilla no deberían tener efectos secundarios, como mutar dato o activar procesos asíncronos. Si te encuentras con la tentación de hacerlos debería probablemente utilizar un [hook de ciclo de vida](instance.html#lifecycle-hooks) en su lugar.

### Debouncing y Throttling

Vue no incluye soporte integrado para _debouncing_ o _throttling_, pero se pueden implementar utilizando librerías como [Lodash](https://lodash.com/).

En casos donde un componente es utilizado de una sola vez, el _debouncing_  puede ser aplicado directamente dentro de `methods`:

```html
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      // Debouncing con Lodash
      click: _.debounce(function() {
        // ... responder a clics ...
      }, 500)
    }
  }).mount('#app')
</script>
```

Sin embargo, este enfoque es potencialmente problemático para comoponentes que son reutilizados porque comparten lo mismo función de _debouncing_. Para mantener la instancia del componente independiente de cada una, podemos añadir el función de _debouncing_ en el _hook_ de ciclo de vida de `created`:

```js
app.component('save-button', {
  created() {
    // Debouncing con Lodash
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // Cancelar el temporizador cuando el componente sea eliminado
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... responder a clics ...
    }
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `
})
```
