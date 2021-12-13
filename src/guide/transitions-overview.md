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

## _Easing_

_Easing_ es una manera importante para expresar profundidad en una animación. Uno de los errores más comunes que los principiantes de animación cometen es elegir `ease-in` para entradas, y `ease-out` para salidas. De hecho necesitará lo contrario.

Si fuéramos a aplicar estos estados a una transición, se vería algo como esto:

```css
.button {
  background: #1b8f5a;
  /* aplicado al estado inicial, así que esta transición será aplicada al estado de retornar */
  transition: background 0.25s ease-in;
}

.button:hover {
  background: #3eaf7c;
  /* aplicado al estado de _hover_, así que esta transición será aplicada cuando un _hover_ sea disparado */
  transition: background 0.35s ease-out;
}
```

<common-codepen-snippet title="Ejemplo de Transición de Ease" slug="996a9665131e7902327d350ca8a655ac" tab="css,result" :editable="false" :preview="false" />

_Easing_ puede también expresar la cualidad del material que se anime. Toma este _pen_ por ejemplo, ¿cuál bola piensa que es dura y cuál es blanda? 

<common-codepen-snippet title="Demostración de bola que está rebotando" slug="wvgqyyW" :height="500" :editable="false" />

Puede obtener un montón de efectos únicos y elabora su animación muy de moda mediante ajustar su _easing_. CSS le permite modificar este mediante ajustar los parámetros de la función _cubic-bezier_, [este _playground_](https://cubic-bezier.com/#.17,.67,.83,.67) por Lea Verou es múy útil para explorar esto.
 
Aunque puede realizar efectos grandes para animación simple con los dos manejadores ofrecidos por el _ease_ de _cubic-bezier_, JavaScript permite múltiples manejadores, y por lo tanto, permite mucho más variaciones.

![Comparación de Ease](/images/css-vs-js-ease.svg)

Toma un efecto de rebote, por ejemplo. En CSS tenemos que declarar cada _keyframe_, arriba y abajo. En JavaScript, podemos expresar todo de ese movimiento dentro del _ease_, a través de declarar `bounce` en el [GreenSock API (GSAP)](https://greensock.com/) (otras librerías de JS tienen otras tipos de _easing_ por defecto).

Aquí es el código utilizado para un rebote en CSS (ejemplo proviene de animate.css):

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

Y aquí es el mismo rebote en JS utilizando GreenSock:

```js
gsap.from(element, { duration: 1, ease: 'bounce.out', y: -500 })
```

Vamos a utilizar GreenSock en algunos de los ejemplos en las secciones siguientes. Tienen un excelente [visualizador de _ease_](https://greensock.com/ease-visualizer) que le ayudará hacer _eases_ bien hechos a mano.

## Lectura Adicional
 
- [Diseñar Animación de Interfaz: Mejorar la Experiencia de Usuario Mediante Animación por Val Head](https://www.amazon.com/dp/B01J4NKSZA/)
- [Animación en el trabajo por Rachel Nabors](https://abookapart.com/products/animation-at-work)
