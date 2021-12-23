# Advertencias de la Detección de Cambios en Vue 2

> Esta página aplica solo a Vue 2.x y bajo, y asume que ya ha leído la [sección de reactividad](reactivity.md). Por favor léalo primero.

Debido a las limitaciones de JavaScript, hay unos tipos de cambios que Vue **no puede detectar**. Sin embargo, hay maneras para superarlas para preservar la reactividad.

### Para Objetos

Vue no puede detectar la adición u eliminación de propiedades. Debido a que Vue realiza el proceso de conversión de captador/establecedor durante la inicialización de instancias, una propiedad debe estar presente en el objeto `data` a fin de que Vue la convierte y la haga reactiva.
 
```js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` ahora es reactiva

vm.b = 2
// `vm.b` NO es reactiva
```

Vue no permite agregar dinámicamente nuevas propiedades reactivas de nivel raíz a una instancia ya creada. Sin embargo, es posible agregar propiedades reactivas a un objeto anidado utilizando el método `Vue.set(object, propertyName, value)`:

```js
Vue.set(vm.someObject, 'b', 2)
```

Puede también utilizar el método `vm.$set` de las instancias, lo que es una alias al método global `Vue.set`:

```js
this.$set(this.someObject, 'b', 2)
```

Algunas veces querría asignar unas propiedades a un objeto existente, por ejemplo utilizando `Object.assign()` o `_.extend()`. Sin embargo, nuevas propiedades agregados al objeto no dispararán cambios. En tales casos, crear un objeto fresco con propiedades de tanto el objeto original como el objeto _mixin_:

```js
// en vez de `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

### Para Matrices

Vue no puede detectar los siguientes cambios a un matriz:

1. cuando directamente establece un elemento con el índice, por ejemplo, `vm.items[indexOfItem] = newValue`
2. cuando modifica la `length` de una matriz, por ejemplo, `vm.items.length = newLength`

Por ejemplo:

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // NO es reactiva
vm.items.length = 2 // NO es reactiva
```

Para superar la primera advertencia, ambos de los siguientes lograrán lo mismo como `vm.items[indexOfItem] = newValue`, pero también disparará actualizaciones de estados en el sistema de reactividad:

```js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```

```js
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

Puede también utilizar el método de instancias [`vm.$set`](https://vuejs.org/v2/api/#vm-set), lo que es una alias al método global `Vue.set`:

```js
vm.$set(vm.items, indexOfItem, newValue)
```

Para abordar la segunda advertencia, puede utilizar `splice`:

```js
vm.items.splice(newLength)
```

## Declarar Propiedades Reactivas

Debido a que Vue no permite agregar dinámicamente propiedades reactivas de nivel raíz, tiene que inicializar instancias de componentes mediante declarar todas las propiedades de dato de nivel raíz por adelantado, incluso con un valor vacio:

```js
var vm = new Vue({
  data: {
    // declarar _message_ con un valor vacio
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// asignar `message` más adelante
vm.message = 'Hello!'
```

Si no declara `message` en la opción `data`, Vue le avisará que la función _render_ está tratando de acceder una propiedad ya no existe.

Hay razones técnicas detrás de esta restricción, elimina un tipo de casos extremos in el sistema de seguimiento de dependencias. pero hay también una consideración in términos de la mantenibilidad de código: el objeto `data` es como una esquema del estado de su componente. Declarar todas propiedades reactivas por adelantado hace que el código del componente más fácil para comprender cuando esté revisado más adelante o leído por un otro desarrollador.

## Fila de Actualización Asíncrona

En caso de que no haya notado, Vue realizar las actualizaciones DOM **asíncronamente**. Siempre y cuando un cambio de dato está observado, abrirá una fila y amortiguar (bufer) todos los cambios de datos que ocurren en el mismo bucle de eventos. Si el mismo observador está disparado múltiples veces, solo será empujado a la fila una vez. Esta deduplicación es importante para evitar calculaciones innecesarias y manipulaciones de DOM. Entonces, en el proximo bucle de evento "tic", Vue tira de la cadena de la fila y realiza el trabajo real (ya deduplicado). Internalmente Vue proba las APIs nativas `Promise.then`, `MutationObserver`, y `setImmediate` para hacer filas asícronamente y retrocede a `setTimeout(fn, 0)`.

Por ejemplo, cuando asigna `vm.someData = 'new value'`, el componente no se rerenderizará inmediatamente. Se actualizará en el proximo "tic", cuando se ha tirado de la cadena la fila. La mayoría del tiempo no necesitamos procurar de esto, pero puede ser tramposo cuando quiere hacer algo que depende del estado de DOM después de la actualización. Aunque Vue.js generalmente alenta los desarrolladores para pensar en una moda de "impulsadas por datos (data-driven)" y evitar tocar el DOM directamente, algunas veces sería necesario ensuciarle las manos. A fin de esperar hasta que Vue.js haya terminado la actualización de DOM después del cambio de dato, puede utilizar `Vue.nextTick(callback)` inmediatamente después de que se cambie el dato. El _callback_ será llamado después de que el DOM se haya actualizado. Por ejemplo:

```html
<div id="example">{{ message }}</div>
```

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // cambiar dato
vm.$el.textContent === 'new message' // false
Vue.nextTick(function() {
  vm.$el.textContent === 'new message' // true
})
```

Hay también el método de instancias `vm.$nextTick()`, lo que es especialmente útil dentro de los componentes, debido a que no requiere el `Vue` global y el contexto `this` de su _callback_ será automáticamente vinculado a la instancia actual de componente:

```js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function() {
    return {
      message: 'no está actualizado'
    }
  },
  methods: {
    updateMessage: function() {
      this.message = 'está actualizado'
      console.log(this.$el.textContent) // => 'no está actualizado'
      this.$nextTick(function() {
        console.log(this.$el.textContent) // => 'está actualizado'
      })
    }
  }
})
```

Debido a que `$nextTick()` retorna un Promise, puede realizar el mismo mostrado arriba utilizando el nuevo sintaxis [ES2017 async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function):

```js
  methods: {
    updateMessage: async function () {
      this.message = 'está actualizado'
      console.log(this.$el.textContent) // => 'no está actualizado'
      await this.$nextTick()
      console.log(this.$el.textContent) // => 'está actualizado'
    }
  }
```
