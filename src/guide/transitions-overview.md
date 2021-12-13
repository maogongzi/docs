# Visión General

Vue ofrece unas abstracciones que pueden ayudar el trabajo con transiciones y animaciones. Particularmente en respuesta a algo que se cambie. Algunas de estas abstractions incluyen:

- _Hooks_ para componentes que se entren en el DOM y se salgan del DOM, en tanto CSS como JS, utilizando el componente integrado `<transition>`.
- Modos de transición para que pueda orquestar el orden durante una transición.
- _Hooks_ para cuando múltiples elementos se estén actualizando en posición, con técnicas de FLIP aplicadas debajo del gancho para mejorar rendimiento, utilizando el componente `<transition-group>`.
- Transicionar estados diferentes en una aplicación, con `watchers`.

Cubriremos todos estos y más en las próximas tres secciones en el guía. Sin embargo, aparte de estas APIs útiles ofrecidas, también cabe mencionar que las declaraciones de clases y estios abarcamos antes pueden ser utilizadas para aplicar animaciones y transiciones igualmente, para casos de usuario más simples.

En la próxima sección, hablaremos de algunas animaciones y transiciones web básicas, y dejaremos algunas enlaces a los recursos para exploración adicional. Si está ya familiar con animación web y cómo los principios se funcionarían con algunas directivas Vue, siéntese libre de saltar la próxima sección. Para alguien más buscando aprender un poco más sobre animaciones web básicas antes de profundizarse, siga leyiendo.

## Animaciones y Transiciones Basadas en Clases

Aunque el componente `<transition>` pueda ser fantástico para componentes que entren y salgan, puede también activar una animación sin montar un componente, mediante agregar una clase condicional.

```html
<div id="demo">
  Pulsa este botón para hacer algo no deba hacer<br />

  <div :class="{ shake: noActivated }">
    <button @click="noActivated = true">Hazme clic</button>
    <span v-if="noActivated">¡Oh no!</span>
  </div>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

```js
const Demo = {
  data() {
    return {
      noActivated: false
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Crear animación con una clase" slug="ff45b91caf7a98c8c9077ad8ab539260" tab="css,result" :editable="false" :preview="false" />

## Transiciones con Vinculaciones de Estilos

Algunos efectos de transición pueden ser aplicados mediante interpolar valores, por ejemplo, a través de vincular un estilo a un elemento mientras una interacción ocurra. Toma este por ejemplo:

```html
<div id="demo">
  <div
    @mousemove="xCoordinate"
    :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
    class="movearea"
  >
    <h3>Mover su ratón a lo largo de la pantalla...</h3>
    <p>x: {{x}}</p>
  </div>
</div>
```

```css
.movearea {
  transition: 0.2s background-color ease;
}
```

```js
const Demo = {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    xCoordinate(e) {
      this.x = e.clientX
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="interpolación con vinculaciones de estilos" slug="JjGezQY" :editable="false" />

En este ejemplo, estamos creando animación a través del uso de interpolación, adjunto al movimiento del ratón. La transición CSS es aplicada al elemento también, para informar al elemento qué tipo de _easing_ para utilizar mientras se esté actualizando.

## Rendimiento

Podría notar que las animaciones demostrados arriba están utilizando algo como `transforms`, y aplicando propiedades raras como `perspective`, ¿porqué están construidas en esa manera en vez de solo utilizar `margin` y `top`, etc.?

Podemos crear animaciones extremadamente lisas en el web mediante tomar en cuenta de la rendimiento. Queremos acelerar elementos por _hardwares_ cuando podamos, y utilizar propiedades que no disparen _repintas (repaints)_. Repasemos algunos de cómo podamos hacerlo.

### _Transform_ y _Opacity_

Podemos revisar recursos como [CSS-Triggers](https://csstriggers.com/) para ver cuales propiedades dispararán _repintas_ si los animamos. Aquí, si está buscando bajo `transform`, podrá ver:

> Cambiar _transform_ no dispara cualquier cambio de geometría o pintura, lo que es muy bien. Este significa que la operación se puede llevar a cabo mediante el subproceso de compositor con el ayudo de GPU.

_Opacity_ se comporta de manera similar. Por tanto, son candidatos ideales para movimientos en el web.

### Aceleración de _Hardware_

Las propiedades como `perspective`, `backface-visibility`, y `transform: translateZ(x)` le permitirán al navegador saber que necesite la aceleración de _hardware_.

Si quiere acelear un elemento por _hardware_, puede aplicar cualquier de estas propiedades (no necesita aplicar todos, uno es suficiente):

```css
perspective: 1000px;
backface-visibility: hidden;
transform: translateZ(0);
```

Muchas librerías de JS como GreenSock asumirá que querra aceleración de _hardware_ y las aplicará por defecto, por eso, no necesita establecerlos manualmente.

## Temporización (Timing)

Para transiciones UI simples, significa que solo de un estado al otro sin estados intermediarios, es común utilizar temporizaciones entre 0.1s y 0.4s, y la mayoría de la gente encuentra que _0.25s_ tiende a ser un punto ideal. ¿Puede utilizar la misma temporización para todos? No, en realidad no. Si tiene algo que necesita moverse una distancia grande o tiene más pasos o cambios de estados, 0.25s no va a funcionar como piense y tiene que ser más específico, y la temporización necesitará ser más única. Sin embargo, eso no significa que no pueda tener valores ideales por defecto que pueda repetir dentro de su aplicación.

Puede también encontrar que las entradas se parecen mejor con un poco más tiempo que la salida. El usuario típicamente está guiado durante la entrada, pero poco paciente al salir porque quiere seguir sus vías.

## Easing

Easing is an important way to convey depth in an animation. One of the most common mistakes newcomers to animation make is to use `ease-in` for entrances, and `ease-out` for exits. You'll actually need the opposite.

If we were to apply these states to a transition, it would look something like this:

```css
.button {
  background: #1b8f5a;
  /* applied to the initial state, so this transition will be applied to the return state */
  transition: background 0.25s ease-in;
}

.button:hover {
  background: #3eaf7c;
  /* applied to the hover state, so this transition will be applied when a hover is triggered */
  transition: background 0.35s ease-out;
}
```

<common-codepen-snippet title="Transition Ease Example" slug="996a9665131e7902327d350ca8a655ac" tab="css,result" :editable="false" :preview="false" />

Easing can also convey the quality of material being animated. Take this pen for example, which ball do you think is hard and which is soft?

<common-codepen-snippet title="Bouncing Ball Demo" slug="wvgqyyW" :height="500" :editable="false" />

You can get a lot of unique effects and make your animation very stylish by adjusting your easing. CSS allows you to modify this by adjusting the cubic-bezier function's parameters, [this playground](https://cubic-bezier.com/#.17,.67,.83,.67) by Lea Verou is very helpful for exploring this.

Though you can achieve great effects for simple animation with the two handles the cubic-bezier ease offers, JavaScript allows multiple handles, and therefore, allows for much more variance.

![Ease Comparison](/images/css-vs-js-ease.svg)

Take a bounce, for instance. In CSS we have to declare each keyframe, up and down. In JavaScript, we can express all of that movement within the ease, by declaring `bounce` in the [GreenSock API (GSAP)](https://greensock.com/) (other JS libraries have other types of easing defaults).

Here is the code used for a bounce in CSS (example from animate.css):

```css
@keyframes bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0) scaleY(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0) scaleY(0.9);
  }

  75% {
    transform: translate3d(0, -10px, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, 5px, 0) scaleY(0.985);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.bounceInDown {
  animation-name: bounceInDown;
}
```

And here is the same bounce in JS using GreenSock:

```js
gsap.from(element, { duration: 1, ease: 'bounce.out', y: -500 })
```

We'll be using GreenSock in some of the examples in the sections following. They have a great [ease visualizer](https://greensock.com/ease-visualizer) that will help you build nicely crafted eases.

## Further Reading

- [Designing Interface Animation: Improving the User Experience Through Animation by Val Head](https://www.amazon.com/dp/B01J4NKSZA/)
- [Animation at Work by Rachel Nabors](https://abookapart.com/products/animation-at-work)
