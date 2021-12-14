# Transiciones de Entrada y Salida

Vue ofrece una variedad de maneras para aplicar efectos de transición cuando los elementos son insertados, actualizados o eliminados del DOM. Esto incluye herramientas para:

- aplicar clases para transiciones y animaciones CSS automáticamente
- integrar librerías de tercera de animación CSS, por ejemplo [Animate.css](https://animate.style/)
- utilizar JavaScript para manipular directamente el DOM durante _hooks_ de transición
- integrar librerías de tercera de animación de JavaScript

En esta página, únicamente vamos a cubrir las transiciones de entrada, salida, pero puede ver la siguiente sección para [transiciones de listas](transitions-list.html) y [transiciones de estado](transitions-state.html).

## Transiciones para Elementos/Componentes Únicos

Vue ofrece un componente de envoltura `transition`, que le permite agregar transiciones de entrada/salida para cualquier elemento o componente en los siguientes contextos:

- Renderización condicional (utilizando `v-if`)
- Visualización condicional (utilizando `v-show`)
- Componentes dinámicos
- Nodos raíz de componentes

Así es como se ve un ejemplo en acción:

```html
<div id="demo">
  <button @click="show = !show">
    Mostrar/Ocultar
  </button>

  <transition name="fade">
    <p v-if="show">hola</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

<common-codepen-snippet title="Componente Simple de Transición" slug="3466d06fb252a53c5bc0a0edb0f1588a" tab="html,result" :editable="false" />

Cuando un elemento envuelto en un componente `transition` es insertado o eliminado, ésto es lo que sucede:

1. Vue determinará automáticamente si el elemento objetivo tiene transiciones o animaciones CSS aplicadas. Si las tiene, las clases de transición CSS serán agregadas/removidas en los momentos apropiados.

2. Si el componente de transición ha ofrecido [_hooks_ de JavaScript](#javascript-hooks), éstos serán invocados en los momentos apropiados.

3. Si no son detectadas animaciones/transiciones CSS y no se han dado _hooks_ de Javascript, las operaciones DOM para insertar y/o eliminar serán ejecutadas inmediatamente en el siguiente _frame_ (Tenga en cuenta: hablamos de un _frame_ de animación de navegador, es diferente al concepto de `nextTick` de Vue).

### Clases de Transición

Existen seis clases aplicadas para transiciones de entrada/salida.

1. `v-enter-from`: Estado inicial para entrada. Aplicada antes que el elemento sea insertado, se elimina después de un _frame_ después de que el elemento sea insertado.

2. `v-enter-active`: Estado activo para entrada. Aplicada durante la fase entera de entrada. Aplicada antes que el elemento sea insertado, se elimina cuando la transición/animación finaliza. Esta clase puede ser utilizada para definir la duración, demora y curva de suavizado para la transición de entrada.

3. `v-enter-to`: Estado final para entrada. Aplicada un _frame_ después de que el elemento sea insertado (al mismo tiempo cuando se elimine `v-enter-from`), se elimina cuando la transición/animación finaliza.

4. `v-leave-from`: Estado inicial para salida. Aplicada inmediatamente cuando la transición de salida es activada, se elimina después de un _frame_.

5. `v-leave-active`: Estado activo para salida. Aplicada durante la fase entera de salida. Agregada inmediatamente cuando la transición de salida es activada, se elimina cuando la animación/transición finaliza. Esta clase puede ser utilizada para definir la duración, demora y curva de suavizado para la transición de salida.

6. `v-leave-to`: Estado final para salida. Agregado un _frame_ después de que se active (al mismo tiempo cuando se elimine `v-leave-from`), se elimina cuando la transición/animación finaliza.

![Diagrama de Transición](/images/transitions.svg)

Cada una de estas clases utilizará un prefijo con el nombre de la transición. Aquí, el prefijo `v-` representa el prefijo por defecto cuando utiliza un elemento `<transition>` sin nombre. Si utiliza `<transition name="my-transition">` por ejemplo, entonces la clase `v-enter-from` debe llamarse `my-transition-enter-from`.

`v-enter-active` y `v-leave-active` le da a usted la capacidad de especificar diferentes curvas de suavizado para transiciones de entrada/salida, lo cual podrá verlo en un ejemplo de la siguiente sección.

### Transiciones CSS

Uno de los tipos de transición más comunes utiliza transiciones CSS. Aquí hay un ejemplo:

```html
<div id="demo">
  <button @click="show = !show">
    Intercambiar la renderización
  </button>

  <transition name="slide-fade">
    <p v-if="show">hola</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
/* Las animaciones de entrada y salida pueden utilizar */
/* duraciones y funciones de espera diferentes.      */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<common-codepen-snippet title="Transiciones Diferentes de Entrada y Salida" slug="0dfa7869450ef43d6f7bd99022bc53e2" tab="css,result" :editable="false" />

### Animaciones CSS

Las animaciones CSS son aplicadas de la misma forma que las transiciones CSS, la diferencia es que `v-enter-from` no es eliminado inmediatamente después que el elemento sea insertado, sino que se elimina en el evento `animationend`.

Aquí hay un ejemplo, omitiendo las reglas con prefijo de CSS para mayor brevedad.

```html
<div id="demo">
  <button @click="show = !show">Mostrar/Ocultar</button>
  <transition name="bounce">
    <p v-if="show">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis
      enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi
      tristique senectus et netus.
    </p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<common-codepen-snippet title="Ejemplo de Animación CSS" slug="8627c50c5514752acd73d19f5e33a781" tab="html,result" :editable="false" />

### Clases de Transición Personalizadas

Usted también puede especificar clases de transición personalizadas cuando utiliza los siguientes atributos:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Estas van a sobreescribir los nombres convencionales de las clases. Esto es especialmente útil cuando desea combinar el sistema de transición de Vue con una librería de animaciones CSS existente, como [Animate.css](https://daneden.github.io/animate.css/).

Aquí es un ejemplo:

```html
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.0/animate.min.css"
  rel="stylesheet"
  type="text/css"
/>

<div id="demo">
  <button @click="show = !show">
    Mostrar/Ocultar
  </button>

  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__tada"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <p v-if="show">hola</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

### Utilizar Animaciones y Trancisiones Juntas

Vue necesita agregar escuchadores de eventos para poder saber cuándo una transición ha finalizado. Puede ser mediante `transitionend` o `animationend`, dependiendo del tipo de reglas CSS aplicadas. Si únicamente está utilizando la una o la otra, Vue detecta automáticamente el tipo correcto.

Sin embargo, en algunos casos usted desea tener ambos tipos en el mismo elemento, por ejemplo tener una animación CSS activada por Vue, junto a un efecto de transición en el _hover_. En estos casos, debe declarar explícitamente el tipo que quiera que Vue utilice, usando el atributo `type`, con un valor ya sea de `animation` o `transition`.

### Duraciones Explícitas de Transiciones

<!-- TODO: validar y proporcionar un ejemplo -->

En la mayoría de casos, Vue puede automáticamente saber cuándo la transición ha finalizado. Por defecto, Vue espera al primero evento `transitionend` o `animationend` en el elemento raíz de transición. Sin embargo, este no podría ser siempre deseado, por ejemplo, podríamos tener una secuencia de transición coreografiada dónde algunos elementos internales anidados tienen una transición demorada o una transición con más larga duración que el elemento raíz de transición.

En tales casos puede especificar una duración explícita de transición (en milisegundos) utilizando la _prop_ `duration` en el componente `<transition>`:

```html
<transition :duration="1000">...</transition>
```

Puede también especificar valores separados para duraciones de entrada y salida:

```html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### _Hooks_ de JavaScript

Usted también puede definir _hooks_ de JavaScript en los atributos:

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
  :css="false"
>
  <!-- ... -->
</transition>
```

```js
// ...
methods: {
  // --------
  // ENTRADA
  // --------

  beforeEnter(el) {
    // ...
  },
  // el callback done es opcional cuando
  // es usado junto a CSS
  enter(el, done) {
    // ...
    done()
  },
  afterEnter(el) {
    // ...
  },
  enterCancelled(el) {
    // ...
  },

  // --------
  // SALIDA
  // --------

  beforeLeave(el) {
    // ...
  },
  // el callback done es opcional cuando
  // es usado junto a CSS
  leave(el, done) {
    // ...
    done()
  },
  afterLeave(el) {
    // ...
  },
  // leaveCancelled es disponible sólo con v-show
  leaveCancelled(el) {
    // ...
  }
}
```

Estos _hooks_ pueden ser utilizados junto a transiciones/animaciones CSS o por cuenta propia.

Cuando utilice transiciones de solo JavaScript, **los _callbacks_ `done` son requeridos para los _hooks_ `enter` y `leave`**. De otra forma, serán llamados síncronamente y la transición finalizará imediatamente. Agregar `:css="false"` también le informa a Vue a saltar la detección de CSS. Aparte de ser un poco más eficiente, este también previene reglas CSS de interferir con la transición por accidente.

Ahora dejemos profundizarnos en un ejemplo. Aquí es una transición JavaScript utilizando [GreenSock](https://greensock.com/):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js"></script>

<div id="demo">
  <button @click="show = !show">
    Mostrar/Ocultar
  </button>

  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false"
  >
    <p v-if="show">
      Demostración
    </p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: false
    }
  },
  methods: {
    beforeEnter(el) {
      gsap.set(el, {
        scaleX: 0.8,
        scaleY: 1.2
      })
    },
    enter(el, done) {
      gsap.to(el, {
        duration: 1,
        scaleX: 1.5,
        scaleY: 0.7,
        opacity: 1,
        x: 150,
        ease: 'elastic.inOut(2.5, 1)',
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        duration: 0.7,
        scaleX: 1,
        scaleY: 1,
        x: 300,
        ease: 'elastic.inOut(2.5, 1)'
      })
      gsap.to(el, {
        duration: 0.2,
        delay: 0.5,
        opacity: 0,
        onComplete: done
      })
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Transición de Hooks de JavaScript" slug="68ce1b8c41d0a6e71ff58df80fd85ae5" tab="js,result" :editable="false" />

## Transiciones en la Renderización Inicial

Si usted quisiera también aplicar una transición en la renderización inicial de un nodo, puede agregar el atributo `appear`:

```html
<transition appear>
  <!-- ... -->
</transition>
```

## Transiciones Entre Elementos

Discutiremos las [transiciones entre componentes](#transitioning-between-components) más adelante, pero también puede aplicar transiciones entre elementos crudos utilizando `v-if`/`v-else`. Una de las transiciones entre dos elementos más comunes es la que se usa entre un contenedor de lista, y un mensaje describiendo una lista vacía:

```html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Lo siento, no se han encontrado elementos.</p>
</transition>
```

Es posible realizar una transición entre cualquier número de elementos, ya sea utilizando `v-if`/`v-else-if`/`v-else`, o vinculando un elemento a una propiedad dinámica. Por ejemplo:

<!-- TODO: reescribir ejemplo y poner aquí un ejemplo de codepen -->

```html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Editar
  </button>
  <button v-else-if="docState === 'edited'" key="edited">
    Guardar
  </button>
  <button v-else-if="docState === 'editing'" key="editing">
    Cancelar
  </button>
</transition>
```

Que también puede ser escrito de la siguiente forma:

```html
<transition>
  <button :key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

```js
// ...
computed: {
  buttonMessage() {
    switch (this.docState) {
      case 'saved': return 'Editar'
      case 'edited': return 'Guardar'
      case 'editing': return 'Cancelar'
    }
  }
}
```

### Modos de Transición

Aún se presenta un problema. Intente hacer clic sobre el botón abajo:

<common-codepen-snippet title="Problema de Botón de Modos de Transición" slug="Rwrqzpr" :editable="false" />

Mientras se hace la transición entre el botón "on" y el botón "off", ambos botones son renderizados, uno realiza la transición de salida mientras el otro realiza la de entrada. Este comportamiento ocurre por defecto en `<transition>`, es decir, las entradas y salidas suceden simultáneamente.

Algunas veces funciona genial, por ejemplo cuando estamos realizando transiciones entre elementos ubicados absolutamente unos encima de otros:

<common-codepen-snippet title="Problema de Botón de Modos de Transición- posicionamiento" slug="abdQgLr" :editable="false" />

Sin embargo, algunas veces este no es una opción, o estamos lidiando con movimientos más complejos dónde los estados de entrada y salida necesitan ser coordinados, así que Vue ofrece una utilidad extremadamente útil llamada **modos de transición**:

- `in-out`: El nuevo elemento realiza la transición de entrada, cuando haya terminado, el elemento actual realiza su transición de salida.

- `out-in`: El elemento actual realiza su transición de salida, cuando haya terminado, el nuevo elemento realiza su transición de entrada.

::: tip
Puede darse cuenta muy rápidamente de que `out-in` es el estado que quiera la mayoría de las veces :)
:::

Ahora actualicemos las transiciones para nuestros botones on/off con `out-in`:

```html
<transition name="fade" mode="out-in">
  <!-- ... los botones ... -->
</transition>
```

<common-codepen-snippet title="Problema de Botón de Modos de Transición- resuelto" slug="ZEQmdvq" :editable="false" />

Con sólo agregar un atributo, hemos arreglado la transición original sin tener que agregar estilos especiales.

Podemos utilizarlo para coordinar movimientos más expresivos, como una tarjeta que está doblando, como demostrado abajo. En realidad son dos elementos que aplican transiciones entre cada uno, debido a que los estados iniciales y finales se escalan al mismo nivel: horizontalmente a 0, se ve como un movimiento fluido. Este tipo de juego de manos puede ser muy útil para microinteracciones realistas de Interfaz de Usuario:

<common-codepen-snippet title="Modos de Transición de Tarjetas de doble cara (Flip Cards)" slug="76e344bf057bd58b5936bba260b787a8" :editable="false" />

## Transiciones entre Componentes

Aplicar transición entre componentes es aún más fácil, no necesitamos el atributo `key`, en su lugar, envolvemos un [componente dinámico](component-basics.html#dynamic-components):

```html
<div id="demo">
  <input v-model="view" type="radio" value="v-a" id="a"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component :is="view"></component>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      view: 'v-a'
    }
  },
  components: {
    'v-a': {
      template: '<div>Componente A</div>'
    },
    'v-b': {
      template: '<div>Componente B</div>'
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
```

<common-codepen-snippet title="Transiciones entre Componentes" slug="WNwVxZw" tab="html,result" theme="39028" />
