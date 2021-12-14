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

<common-codepen-snippet title="Transition-group example" slug="373b4429eb5769ae2e6d097fd954fd08" tab="js,result" :editable="false" :preview="false" />

::: tip
One important note is that these FLIP transitions do not work with elements set to `display: inline`. As an alternative, you can use `display: inline-block` or place elements in a flex context.
:::

These FLIP animations are also not limited to a single axis. Items in a multidimensional grid can be [transitioned too](https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-list-move-transitions):

TODO: example

## Staggering List Transitions

By communicating with JavaScript transitions through data attributes, it's also possible to stagger transitions in a list:

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

<common-codepen-snippet title="Staggered Lists" slug="c2fc5107bd3025ceadea049b3ee44ec0" tab="js,result" :editable="false" :preview="false" />

## Reusable Transitions

Transitions can be reused through Vue's component system. To create a reusable transition, all you have to do is place a `<transition>` or `<transition-group>` component at the root, then pass any children into the transition component.

TODO: refactor to Vue 3

Here's an example using a template component:

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

And [functional components](render-function.html#functional-components) are especially well-suited to this task:

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

## Dynamic Transitions

Yes, even transitions in Vue are data-driven! The most basic example of a dynamic transition binds the `name` attribute to a dynamic property.

```html
<transition :name="transitionName">
  <!-- ... -->
</transition>
```

This can be useful when you've defined CSS transitions/animations using Vue's transition class conventions and want to switch between them.

Really though, any transition attribute can be dynamically bound. And it's not only attributes. Since event hooks are methods, they have access to any data in the context. That means depending on the state of your component, your JavaScript transitions can behave differently.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fade In:
  <input type="range" v-model="fadeInDuration" min="0" :max="maxFadeDuration" />
  Fade Out:
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
    <p v-if="show">hello</p>
  </transition>
  <button v-if="stop" @click="stop = false; show = false">
    Start animating
  </button>
  <button v-else @click="stop = true">Stop it!</button>
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

TODO: example

Finally, the ultimate way of creating dynamic transitions is through components that accept props to change the nature of the transition(s) to be used. It may sound cheesy, but the only limit really is your imagination.
