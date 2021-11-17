# Vinculaciones de Clases y Estilos

Una común necesidad para la vinculación de data es manipular la list de _class_ de un elemento y sus _style_ en línea. Como ambos son atributos, podemos utilizar `v-bind` para manipular ellos: solo necesitamos calcular una cadena de caracteres final con nuestras expresiones. Sin embargo, entrometerse con la concatenación de cadena de caracteres es molesto y susceptible a errores. Por esta razón, Vue proporciona mejoramientos especiales cuando `v-bind` está utilizado juntos con `class` y `style`. Además de cadenas de caracteres, las expresiones pueden también evaularse a objetos o arrays.

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

When `isActive` or `hasError` changes, the class list will be updated accordingly. For example, if `hasError` becomes `true`, the class list will become `"static active text-danger"`.

The bound object doesn't have to be inline:

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

This will render the same result. We can also bind to a [computed property](computed.md) that returns an object. This is a common and powerful pattern:

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

### Array Syntax

We can pass an array to `:class` to apply a list of classes:

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

Which will render:

```html
<div class="active text-danger"></div>
```

If you would like to also toggle a class in the list conditionally, you can do it with a ternary expression:

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

This will always apply `errorClass`, but `activeClass` will only be applied when `isActive` is truthy.

However, this can be a bit verbose if you have multiple conditional classes. That's why it's also possible to use the object syntax inside array syntax:

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### With Components

> This section assumes knowledge of [Vue Components](component-basics.md). Feel free to skip it and come back later.

When you use the `class` attribute on a custom component with a single root element, those classes will be added to this element. Existing classes on this element will not be overwritten.

For example, if you declare this component:

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `<p class="foo bar">Hi!</p>`
})
```

Then add some classes when using it:

```html
<div id="app">
  <my-component class="baz boo"></my-component>
</div>
```

The rendered HTML will be:

```html
<p class="foo bar baz boo">Hi</p>
```

The same is true for class bindings:

```html
<my-component :class="{ active: isActive }"></my-component>
```

When `isActive` is truthy, the rendered HTML will be:

```html
<p class="foo bar active">Hi</p>
```

If your component has multiple root elements, you would need to define which component will receive this class. You can do this using `$attrs` component property:

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

You can learn more about component attribute inheritance in [Non-Prop Attributes](component-attrs.html) section.

## Binding Inline Styles

### Object Syntax

The object syntax for `:style` is pretty straightforward - it looks almost like CSS, except it's a JavaScript object. You can use either camelCase or kebab-case (use quotes with kebab-case) for the CSS property names:

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
