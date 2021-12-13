# Atributos que no son _props_

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

Un atributo que no es _prop_ es un atributo u escuchador de eventos que se pasa a un componente, pero no tiene una propiedad correspondiente definida en [props](component-props.html) o [emits](component-custom-events.html#defining-custom-events). Los ejemplos comunes de esto incluyen los atributos `class`, `style` e `id`. Puede acceder estos atributos mediante la propiedad `$attrs`.

## Herencia de Atributos

Cuando un componente retorna un solo nodo raíz. los atributos que no son _props_ serán automáticamente agregado a los atributos del nodo raíz. Por ejemplo, en la instancia de un componente _date-picker_:

```js
app.component('date-picker', {
  template: `
    <div class="date-picker">
      <input type="datetime-local" />
    </div>
  `
})
```

En el caso necesitamos definir el estado del componente _date-picker_ mediante un atributo `data-status`, será aplicado al nodo raíz (es decir, `div.date-picker`).

```html
<!-- el componente date-picker con un atributo que no es _prop_ -->
<date-picker data-status="activated"></date-picker>

<!-- el componente date-picker renderizado -->
<div class="date-picker" data-status="activated">
  <input type="datetime-local" />
</div>
```

La misma regla se aplica a los escuchadores de eventos:

```html
<date-picker @change="submitChange"></date-picker>
```

```js
app.component('date-picker', {
  created() {
    console.log(this.$attrs) // { onChange: () => {}  }
  }
})
```

Este podría ser útil cuando tenemos un elemento HTML con un evento `change` como el elemento raíz del componente `date-picker`.

```js
app.component('date-picker', {
  template: `
    <select>
      <option value="1">Ayer</option>
      <option value="2">Hoy</option>
      <option value="3">Mañana</option>
    </select>
  `
})
```

En este caso, el escuchador del evento `change` se pasa desde el componente padre al componente secundario y será disparado cuando se dispare el evento nativo `change` del elemento `<select>`. No necesitarémos emitir un evento desde el componente `date-picker` explícamente:

```html
<div id="date-picker" class="demo">
  <date-picker @change="showChange"></date-picker>
</div>
```

```js
const app = Vue.createApp({
  methods: {
    showChange(event) {
      console.log(event.target.value) // registrará un valor de la opción seleccionada
    }
  }
})
```

## Deshabilitar la herencia de atributos

Si **no** quiere que el componente herede automáticamente los atributos, puede establecer `inheritAttrs: false` en las opciones del componente.

El escenario común para deshabilitar la herencia de un atributo es cuando los atributos necesitan aplicarse a los otros elementos al lado del nodo raíz.

A través de establecer la opción `inheritAttrs` a `false`, puede luego aplicar atributos al elemento eligido por usted mediante utilizar la propiedad `$attrs` del componente, la cual incluye todos los atributos que no sean incluidos por las propiedades `props` y `emits` del componente (p. ej. `class`, `style`, escuchadores de `v-on`, etc.).

Utilicemos nuestro componente _date-picker_ desde la [sección anterior](#attribute-inheritance), en el evento necesitamos aplicar todos los atributos que no son _props_ al elemento `input` en vez del elemento raíz `div`, esto puede ser logrado mediante utilizar la abreviatura `v-bind`.

```js{5}
app.component('date-picker', {
  inheritAttrs: false,
  template: `
    <div class="date-picker">
      <input type="datetime-local" v-bind="$attrs" />
    </div>
  `
})
```

Con esta nueva configuración, ¡nuestro atributo `data-status` será aplicado a nuestro elemento `input`!

```html
<!-- el componente date-picker con un atributo que no es _prop_ -->
<date-picker data-status="activated"></date-picker>

<!-- el componente date-picker renderizado -->
<div class="date-picker">
  <input type="datetime-local" data-status="activated" />
</div>
```

## Herencia de atributos en múltiples nodos raíces

A diferencia de los componentes de un solo nodo raíz, los componentes con múltiples nodo raíces no poseen un comportamiento automático de fracaso de atributos (attribute fallthrough). Si `$attrs` no es vinculado explícamente, una advertencia de tiempo de ejecución será emitido.

```html
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>
```

```js
// Este emitirá una advertencia
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  `
})

// No advertencias, los atributos de $attrs se pasan al elemento <main>
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main v-bind="$attrs">...</main>
    <footer>...</footer>
  `
})
```
