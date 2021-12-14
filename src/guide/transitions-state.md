# Transiciones de Estado

El sistema de transición de Vue ofrece muchas maneras simples para animar la entrada, salida y las listas, pero ¿qué hay de animar su dato mismo? Por ejemplo:

- números y calculaciones
- colores mostrados
- las posiciones de nodos SVG
- los tamaños y otras propiedades de un elemento

Todos de estos son almacenados como números crudos o bien pueden ser convertidos en números. Una vez que hacemos eso, podemos animar estos cambios de estados utilizando librerías de tercera para animar estados con suavidad (to tween state), en combinación con el sistema de reactividad y componente de Vue.

## Animar Estado con Observadores

Observadores nos permiten animar cambios de cualquier propiedad numérica en otra propiedad. Eso puede parecer complicado en abstracto, por lo tanto dejemos profundizarnos en un ejemplo utilizando [GreenSock](https://greensock.com/):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<div id="animated-number-demo">
  <input v-model.number="number" type="number" step="20" />
  <p>{{ animatedNumber }}</p>
</div>
```

```js
const Demo = {
  data() {
    return {
      number: 0,
      tweenedNumber: 0
    }
  },
  computed: {
    animatedNumber() {
      return this.tweenedNumber.toFixed(0)
    }
  },
  watch: {
    number(newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue })
    }
  }
}

Vue.createApp(Demo).mount('#animated-number-demo')
```

<common-codepen-snippet title="Aplicar transición al estado, ejemplo 1" slug="22903bc3b53eb5b7817378ecb985ce96" tab="js,result" :editable="false" :preview="false" />

Cuando actualiza el número, el cambio es animado debajo de la entrada.

## Transiciones de Estado Dinámico

Como con los componentes de transición de Vue, las transiciones de estados respaldadas por dato pueden ser actualizadas en tiempo real, ¡lo que es específicamente útil para el prototipaje! Incluo cuando se utiliza un polígono SVG simple, puede realizar muchos efectos que pueden ser difíciles de concebir hasta que haya jugado con las variables un poco.

<common-codepen-snippet title="Actualizar SVG" slug="a8e00648d4df6baa1b19fb6c31c8d17e" :height="500" tab="js,result" :editable="false" />

## Organizar Transiciones en Componentes

Manejar muchos transiciones de estado puede incrementar rápidamente la complexidad de una instancia de componente. Afortunadamente, muchas animaciones pueden ser extraidas y convertidas en componentes secundarios dedicados. Hágamoslo con el número entero de nuestro ejemplo anterior:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<div id="app">
  <input v-model.number="firstNumber" type="number" step="20" /> +
  <input v-model.number="secondNumber" type="number" step="20" /> = {{ result }}
  <p>
    <animated-integer :value="firstNumber"></animated-integer> +
    <animated-integer :value="secondNumber"></animated-integer> =
    <animated-integer :value="result"></animated-integer>
  </p>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      firstNumber: 20,
      secondNumber: 40
    }
  },
  computed: {
    result() {
      return this.firstNumber + this.secondNumber
    }
  }
})

app.component('animated-integer', {
  template: '<span>{{ fullValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tweeningValue: 0
    }
  },
  computed: {
    fullValue() {
      return Math.floor(this.tweeningValue)
    }
  },
  methods: {
    tween(newValue, oldValue) {
      gsap.to(this.$data, {
        duration: 0.5,
        tweeningValue: newValue,
        ease: 'sine'
      })
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.tween(newValue, oldValue)
    }
  },
  mounted() {
    this.tween(this.value, 0)
  }
})

app.mount('#app')
```

<common-codepen-snippet title="Componentes de Transición de Estado" slug="e9ef8ac7e32e0d0337e03d20949b4d17" tab="js,result" :editable="false" />

Ahora podemos componer múltiples estados con estos componentes secundarios. Es fascinante que podamos utilizar cualquier combinación de estrategias de transición que son cubiertas en esta página, a lo largo de estos ofrecidos por [el sistema integrado de transición](transitions-enterleave.html) de Vue. Juntos, hay muy pocas limitaciones al que pueda ser realizado.

Puede ver cómo podríamos  utilizar esto para la visualización de dato, para efectos físicos, para animaciones de caracteres y interacciones, el cielo es el límite.

## Hacer vivir los Diseños

Para animar, según una definición, significa hacer vivir. Desafortunadamente, cuando los diseñadores crean íconos, logos y mascotas, son a menudo entregados como imagenes o SVGs estáticos. Así que aunque el _octocat_ de GitHub, el pájaro de Twitter, y muchos otros logos asemejan a criaturas vivientes, en realidad no se parecen vigente.

Vue pued ayudar. Debido a que SVGs son justo datos, necesitamos sólo ejemplos de qué se parecen las criaturas cuando estén emocionados, pensando o alarmados. Entonces Vue puede ayudar las transiciones entre estos estados, hace que su página de bienvenida, indicadores de carga, y notificaciones sean más atrativos emocionalmente.

Sarah Drasner demuestra este en la demostración abajo utilizando una combinación de cambios de estado impulsado por el tiempo y la interactividad:

<common-codepen-snippet title="Wall-E controlado por Vue" slug="YZBGNp" :height="400" :team="false" user="sdras" name="Sarah Drasner" :editable="false" :preview="false" version="2" theme="light" />
