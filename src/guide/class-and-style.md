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

Si su componente tiene más que uno elemento raiz, necesitaría definir cual componente recibirá esta clase. Puede hacerlo utilizando el propiedad `$attrs` del componente:

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

El sintaxis de objeto para `:style` es muy sencillo - it looks almost like CSS, except it's a JavaScript object. You can use either camelCase or kebab-case (use quotes with kebab-case) for the CSS property names:

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

It is often a good idea to bind to a style object directly so that the template is cleaner:

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

Again, the object syntax is often used in conjunction with computed properties that return objects.

### Array Syntax

The array syntax for `:style` allows you to apply multiple style objects to the same element:

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Auto-prefixing

When you use a CSS property that requires a [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) in `:style`, Vue will automatically add the appropriate prefix. Vue does this by checking at runtime to see which style properties are supported in the current browser. If the browser doesn't support a particular property then various prefixed variants will be tested to try to find one that is supported.

### Multiple Values

You can provide an array of multiple (prefixed) values to a style property, for example:

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

This will only render the last value in the array which the browser supports. In this example, it will render `display: flex` for browsers that support the unprefixed version of flexbox.
