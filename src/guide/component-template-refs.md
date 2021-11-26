# _refs_ de Plantillas

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

Pese a la existencia de _props_ y eventos, a veces es posible que necesita
acceder directamente a un componente secundario en JavaScript. Para lograrlo puede asignar una ID de referencia al componente secundario o elemento HTML utilizando el atributo `ref`. Por ejemplo:

```html
<input ref="input" />
```

Este puede ser útil cuando quiere, por ejemplo, programáticamente enfocar a esta entrada cuando se monte el componente:

```js
const app = Vue.createApp({})

app.component('base-input', {
  template: `
    <input ref="input" />
  `,
  methods: {
    focusInput() {
      this.$refs.input.focus()
    }
  },
  mounted() {
    this.focusInput()
  }
})
```

También, puede agregar otra `ref` al componente mismo y utilizarlo para disparar evento `focusInput` desde el componente padre:

```html
<base-input ref="usernameInput"></base-input>
```

```js
this.$refs.usernameInput.focusInput()
```

::: warning
Las `$refs` son sólo disponibles después de cuando el componente haya sido renderizado. Sólo sirve como una salida de emergencia para las manipulaciones directas de los componentes secundarios - debería evitar acceder `$refs` desde dentro de plantillas o propiedades computadas.
:::

**Vea también**: [Utilizar _refs_ de plantillas en API de composición](/guide/composition-api-template-refs.html#template-refs)
