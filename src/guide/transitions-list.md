# Transiciones de Listas

Hasta ahora, hemos manejado transiciones para:

- Nodos individuales
- Múltiples nodos dónde solo uno de ellos está renderizado cada vez.

¿Qué pasa con la situación cuando tenemos una lista entera de elementos que queramos renderizar simultáneamente, por ejemplo con `v-for`? En este caso, utilizaremos el componente `<transition-group>`. Antes de que nos profundicemos en un ejemplo, hay unas cosas que son importantes para saber de este componente:

- Por defecto, no renderiza un elemento de envoltorio, pero puede especificar un elemento para ser renderizado con el atributo `tag`.
- Los [modos de transición](/guide/transitions-enterleave.html#transition-modes) no son disponibles, porque ya no estamos alternando entre elementos exclusivos mutualmente.
- Los elementos dentro son **siempre requeridos** para tener un atributo `key` único.
- Las clases de transición de CSS serán aplicadas a los elementos internos y no al grupo/contenedor mismo.

## Transiciones de Entrar/Salir de Lista

Ahora dejemos profundizarnos en un ejemplo, aplicar transición de entrada y salida utilizando las mismas clases CSS que hemos utilizado anteriormente:

```html
<div id="list-demo">
  <button @click="add">Agregar</button>
  <button @click="remove">Eliminar</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random() * this.items.length)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    }
  }
}

Vue.createApp(Demo).mount('#list-demo')
```

```css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
```

<common-codepen-snippet title="Aplicar transición a la lista" slug="e1cea580e91d6952eb0ae17bfb7c379d" tab="js,result" :editable="false" :preview="false" />

Hay un problema sobre este ejemplo. Cuando agrega o elimina un elemento, los otros alrededor de el se encajan instantáneamente en sus nuevos lugares en ves de una transición suave. Vamos a arreglarlo más adelante.

## Transiciones de Movimiento de Lista

El componente `<transition-group>` tiene otra trampa bajo la manga. No solo puede animar la entrada y salida, sino también cambios de posición. El único nuevo concepto que tiene que saber para utilizar esta característica es la adición de **la `v-move` clase**, lo que es agregado cuando los elementos son cambiando sus posiciones. Al igual que otras clases, su prefijo coincidirá el valor de un atributo `name` proporcionado y puede también manualmente especificar una clase con el atributo `move-class`.

Esta clase es principalmente útil para especificar la temporización de transición y la curva de _easing_, como lo que puede ver a continuación:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"></script>

<div id="flip-list-demo">
  <button @click="shuffle">Barajar</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  methods: {
    shuffle() {
      this.items = _.shuffle(this.items)
    }
  }
}

Vue.createApp(Demo).mount('#flip-list-demo')
```

```css
.flip-list-move {
  transition: transform 0.8s ease;
}
```

<common-codepen-snippet title="Ejemplo de transition-group" slug="049211673d3c185fde6b6eceb8baebec" tab="html,result" :editable="false" :preview="false" />

Este se parecería mágico, pero bajo el capó, Vue está utilizando una técnica de animación llamada [FLIP](https://aerotwist.com/blog/flip-your-animations/) para aplicar transiciones a elementos suavemente desde sus posiciones viejos a sus posiciones nuevos utilizando _transforms_.

¡Podemos combinar esta técnica con nuestra implementación previa para animar cada cambio posible a nuestra lista!

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button @click="shuffle">Barajar</button>
  <button @click="add">Agregar</button>
  <button @click="remove">Eliminar</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random() * this.items.length)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle() {
      this.items = _.shuffle(this.items)
    }
  }
}

Vue.createApp(Demo).mount('#list-complete-demo')
```

```css
.list-complete-item {
  transition: all 0.8s ease;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}
```

<common-codepen-snippet title="Ejemplo de transition-group" slug="373b4429eb5769ae2e6d097fd954fd08" tab="js,result" :editable="false" :preview="false" />

::: tip
Una nota importante es que estas transiciones de FLIP no funcionan con elementos establecidos como `display: inline`. Como alternativa puede utilizar `display: inline-block` o poner elementos dentro de un contexto _flex_.
:::

Estas animaciones de FLIP no son limitadas a un solo eje. Se pueden aplicar [transiciones también](https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-list-move-transitions) a los elementos en una rejilla multidimensional:

TODO: ejemplo

## Escalonar Transiciones de Lista

A través de comunicar con las transiciones de JavaScript mediante atributos de dato, también es posible escalonar transiciones en una list:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js"></script>

<div id="demo">
  <input v-model="query" />
  <transition-group
    name="staggered-fade"
    tag="ul"
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      :key="item.msg"
      :data-index="index"
    >
      {{ item.msg }}
    </li>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      query: '',
      list: [
        { msg: 'Bruce Lee' },
        { msg: 'Jackie Chan' },
        { msg: 'Chuck Norris' },
        { msg: 'Jet Li' },
        { msg: 'Kung Fury' }
      ]
    }
  },
  computed: {
    computedList() {
      var vm = this
      return this.list.filter(item => {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: '1.6em',
        delay: el.dataset.index * 0.15,
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index * 0.15,
        onComplete: done
      })
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Listas escalonadas" slug="c2fc5107bd3025ceadea049b3ee44ec0" tab="js,result" :editable="false" :preview="false" />

## Transiciones Reutilizables

Las transiciones pueden ser reutilizadas a lo largo del sistema de componentes de Vue. Para crear una transición reutilizable, lo único que tiene que hacer es poner un componente `<transition>` o `<transition-group>` al raíz, luego pasar cualquier hijo al componente de transición.

TODO: refactorizar a Vue 3

Aquí es un ejemplo utilizando un componente de plantilla:

```js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      @before-enter="beforeEnter"\
      @after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter(el) {
      // ...
    },
    afterEnter(el) {
      // ...
    }
  }
})
```

Y [componentes funcionales](render-function.html#functional-components) son especialmente bien adaptados a esta tarea:

```js
Vue.component('my-special-transition', {
  functional: true,
  render: function(createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter(el) {
          // ...
        },
        afterEnter(el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## Transiciones Dinámicas

Sí, ¡incluso las transiciones en Vue son impulsadas por dato! El más básico ejemplo de una transición dinámica vincula el atributo `name` a una propiedad dinámica.

```html
<transition :name="transitionName">
  <!-- ... -->
</transition>
```

Este puede ser útil cuando ha definido transiciones/animaciones CSS utilizando las convenciones de clase de transición de Vue y quiere intercambiar entre ellos.

Realmente sin embargo, cualquier atributo de transición puede ser vinculado dinámicamente. Y no sólo limitado a los atributos. Debido a que los _hooks_ de eventos son métodos, tienen acceso a cualquier dato en el contexto. Eso significa que depende del estado de su componente, sus transiciones de JavaScript pueden comportarse diferentemente.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fundido de entrada:
  <input type="range" v-model="fadeInDuration" min="0" :max="maxFadeDuration" />
  Fundido de salida:
  <input
    type="range"
    v-model="fadeOutDuration"
    min="0"
    :max="maxFadeDuration"
  />
  <transition
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <p v-if="show">hola</p>
  </transition>
  <button v-if="stop" @click="stop = false; show = false">
    Empezar la animación
  </button>
  <button v-else @click="stop = true">¡deténgalo!</button>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      show: true,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
      maxFadeDuration: 1500,
      stop: true
    }
  },
  mounted() {
    this.show = false
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
    },
    enter(el, done) {
      var vm = this
      Velocity(
        el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function() {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave(el, done) {
      var vm = this
      Velocity(
        el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function() {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})

app.mount('#dynamic-fade-demo')
```

TODO: ejemplo

Por fin, la manera última de crear transiciones dinámicas es mediante componentes que acepten _props_ para cambiar la natura de las transiciones listas para utilizar. Por cursi que suene, pero la sola limitación de hecho es su imaginación.
