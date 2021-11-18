# Vinculaciones de Clases y Estilos

Una común necesidad para la vinculación de data es manipular la list de _class_ de un elemento y sus _style_ en línea. Como ambos son atributos, podemos utilizar `v-bind` para manipular ellos: solo necesitamos calcular una cadena de caracteres final con nuestras expresiones. Sin embargo, entrometerse con la concatenación de cadena de caracteres es molesto y susceptible a errores. Por esta razón, Vue proporciona mejoramientos especiales cuando `v-bind` está utilizado juntos con `class` y `style`. Además de cadenas de caracteres, las expresiones pueden también evaularse a objetos o matrices.

## Vinculación de Clases de HTML
<VideoLesson href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3?friend=vuejs" title="Free Vue.js Dynamic Classes Lesson">Watch a free video lesson on Vue School</VideoLesson>

### Sintaxis de Objeto

Podemos pasar un objeto a `:class` (abreviado para `v-bind:class`) para
alternar clases dinámicamente:

```html
<div :class="{ active: isActive }"></div>
```

El sintaxis arriba significa la existencia de la clase `active` será determinado por la [veracidad](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) de la propiedad de dato `isActive`.

Puede tener multiple clases alternados por haber más campos en el objeto. Además, la directiva `:class` puede también coexistir con el atributo plano `class`. Por eso dado la siguiente plantilla:

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

y el dato siguiente:

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

se renderizará:

```html
<div class="static active"></div>
```

Cuando `isActive` o `hasError` se cambia, la lista de clases será actualizado en consecuencia. Por ejemplo, si `hasError` se cambia a `true`, la lista de clases será convertido en `"static active text-danger"`.

El objeto vinculado no necesita ser en línea:

```html
<div :class="classObject"></div>
```

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

Esto va renderizar el mismo resuelto. Podemos también vincular a una [propiedad computada](computed.md) que retorna un objeto. Eso es un patrón común y poderoso:

```html
<div :class="classObject"></div>
```

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Sintaxis de Matriz

Podemos pasar una matriz a `:class` para aplicar una lista de clases:

```html
<div :class="[activeClass, errorClass]"></div>
```

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

Lo que renderizará:

```html
<div class="active text-danger"></div>
```

Si le gusta también alternar una clase en la lista condicionalmente, puede hacerlo con una expresión ternaria:

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Esto aplicará de siempre `errorClass`, pero `activeClass` será aplicado solo cuando `isActive` es _truthy_ (que se evalua a true).

Sin embargo, esto puede ser un poquito verboso si tiene muchas clases condicionales. Es porque es también posible utilizar la sintaxis de objeto dentro de la sintaxis de matriz.

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### Con Componentes

> Este sección asume el conocimiento de [Componentes de Vue](component-basics.md). Siéntase libre de saltarlo y volver más tarde.

Cuando utiliza el atributo `class` en un componente personalizado con on sólo elemento raiz, estas clases serán añadido al elemento. Las clases existentes en el elemento no serán sobrescrito.

Por ejemplo, si declara este componente::

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `<p class="foo bar">Hi!</p>`
})
```

Luego añade unase clases cuando lo utilice:

```html
<div id="app">
  <my-component class="baz boo"></my-component>
</div>
```

El HTML renderizado será:

```html
<p class="foo bar baz boo">Hi</p>
```

Lo mismo funciona con vinculaciones de clases:

```html
<my-component :class="{ active: isActive }"></my-component>
```

Cuando `isActive` es _truthy_, el HTML renderizado será:

```html
<p class="foo bar active">Hi</p>
```

Si su componente tiene más que uno elemento raíz, necesitaría definir cual componente recibirá esta clase. Puede hacerlo utilizando el propiedad `$attrs` del componente:

```html
<div id="app">
  <my-component class="baz"></my-component>
</div>
```

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `
    <p :class="$attrs.class">Hi!</p>
    <span>This is a child component</span>
  `
})
```

Puede aprender más sobre la herencia de atributos de componentes en la sección [Non-Prop Atributos](component-attrs.html).

## Vincular estilos en línea

### Syntaxis de Objeto

El sintaxis de objeto para `:style` es muy sencillo - se ve casi igual a CSS, excepto que es un objeto JavaScript. Puede utilizar tanto _camelCase_ como _kebab-case_ (utilice comillas con _kebab-case_) para los nombres de propiedades de CSS:

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

Es una buena idea vincular a un objecto de estilo directamente para que la plantilla sea más limpia:

```html
<div :style="styleObject"></div>
```

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

De nuevo, el sintaxis de objeto es utilizado frecuentemente junto con propiedades computadas que retornan objetos.

### Sintaxis de Matriz

La sintaxis de matriz para `:style` permite que aplique múltiples objetos de estilo al mismo elemento:

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Prefijarse Automáticamente

Cuando utiliza una propiedad de CSS que requiere un [prefijo específico del vendor](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) en `:style`, Vue va automáticamente añadir el prefijo apropiado. Lo hace Vue mediante comprobar en el tiempo de ejecución para ver cuales propiedades de estilo son suportado en el navegador corriente. Si el navegador no suporta una propiedad particular, varios variantes prefijados serán comprodados para tratar de encontrar uno que sea soportado.

### Múltiples Valores

Puede proveer un matriz de múltiples valores (prefijados) a una propiedad de estilo, por ejemplo:

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Esto solo renderizará el último valor del matriz que soporta el navegador. en este ejemplo, renderizará `display: flex` para navegadores que soportan el versión de _flexbox_ sin prefijo.
