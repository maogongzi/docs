# Eventos Personalizados

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

## Nombre de eventos

Como los componentes y _props_, los nombres de eventos proporcionan una transformación automática de casos. Si emite un evento desde el componente secundario con un nombre de _camelCase_, será capaz de agregar escuchadores de _kebab-case_ en el componente padre.

```js
this.$emit('myEvent')
```

```html
<my-component @my-event="doSomething"></my-component>
```

Como con [Casos de _Props_](/guide/component-props.html#prop-casing-camelcase-vs-kebab-case), recomendamos utilizar escuchadores de eventos de _kebab-case_ cuando está utilizando plantillas en DOM. Si está utilizando plantillas de cadena de caracteres, esta limitación no se aplica.

## Definir eventos personalizados

<VideoLesson href="https://vueschool.io/lessons/defining-custom-events-emits?friend=vuejs" title="Aprender cómo definir los eventos que pueden ser emitidos por un componente en Vue School">Ver un video gratis sobre cómo definir eventos personalizados en Vue School</VideoLesson>

Los eventos emitidos pueden ser definido en el componente mediante la opción `emits`.

```js
app.component('custom-form', {
  emits: ['inFocus', 'submit']
})
```

Cuando un evento nativo (p. ej. `click`) está definido en la opción `emits`, el evento de componente será utilizado **en vez de** un escuchador de evento nativo.

::: tip
Es recomendado definir todos eventos emitidos para documentar mejor cómo un componente debería funcionar.
:::

### Validar eventos emitidos

Similar a las validaciones de _props_, un evento emitido puede ser validado si es definido con la sintaxis de objeto en vez de matriz.

Para agregar validación, una función está asignado al evento, la que recibe los argumentos pasados a la llamada de `$emit` y retorna un valor booleano para indicar si el evento es válido o no.

```js
app.component('custom-form', {
  emits: {
    // no validación
    click: null,

    // Validar el evento _submit_
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('¡La carga del evento submit es inválida!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
})
```

## Argumentos de `v-model`

Por defecto, `v-model` de un componente utiliza `modelValue` como la _prop_ y `update:modelValue` como el evento. Podemos modificar estes nombres pasando un argumento a `v-model`:

```html
<my-component v-model:title="bookTitle"></my-component>
```

En este caso, el componente secundario esperará una _prop_ `title` y emitirá evento `update:title` para sincronizar.

```js
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```


## Múltiples vinculaciones de `v-model`

Al aprovechar la capacidad para dirigir una _prop_ u evento particular como aprendemos antes con [argumentos de `v-model`](#v-model-arguments), podemos ahora crear múltiples vinculaciones de `v-model` en una sola instancia de componente.

Cada `v-model` será sincronizado con una _prop_ diferente, sin la necesidad de opciones adicionales en el componente:

```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
  template: `
    <input
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

<common-codepen-snippet title="Múltiples directivas de v-model" slug="GRoPPrM" tab="html,result" />

## Manejar modificadores de `v-model`

Cuando estabamos aprendiendo sobre las vinculaciones de entradas de formularios, vimos que `v-model` tiene [modificadores integrados](/guide/forms.html#modifiers) - `.trim`, `.number` y `.lazy`. En algunos casos, sin embargo, querría también agregar sus propios modificadores personalizados.

Creemos un ejemplo de modificador personalizado, `capitalize`, lo que pone en mayúscula la primera letra de la cadena de caracteres proporcionada por la vinculación de `v-model`.

Los modificadores agregados a `v-model` de un componente serán proporcionados al componente mediante la _prop_ `modelModifiers`. En el siguiente ejemplo, hemos creado un componente que contiene una _prop_ `modelModifiers` que utiliza un objeto vacío como su valor por defecto.

Note que cuando se activa el hook de ciclo de vida `created` del componente, la _prop_ `modelModifiers` contiene `capitalize` y su valor es `true` - debido a que está establecido en la vinculación de `v-model`, es decir, `v-model.capitalize="myText"`.

```html
<my-component v-model.capitalize="myText"></my-component>
```

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  template: `
    <input type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `,
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
})
```

Now that we have our prop set up, we can check the `modelModifiers` object keys and write a handler to change the emitted value. In the code below we will capitalize the string whenever the `<input />` element fires an `input` event.

```html
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  {{ myText }}
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

app.mount('#app')
```

For `v-model` bindings with arguments, the generated prop name will be `arg + "Modifiers"`:

```html
<my-component v-model:description.capitalize="myText"></my-component>
```

```js
app.component('my-component', {
  props: ['description', 'descriptionModifiers'],
  emits: ['update:description'],
  template: `
    <input type="text"
      :value="description"
      @input="$emit('update:description', $event.target.value)">
  `,
  created() {
    console.log(this.descriptionModifiers) // { capitalize: true }
  }
})
```
