# Bienes (Assets)

## directives

- **Tipo:** `Object`

- **Detalles:**

  Un _hash_ de directivas que se hacen disponibles en la instancia de componente.

- **Uso:**

  ```js
  const app = createApp({})

  app.component('focused-input', {
    directives: {
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    },
    template: `<input v-focus>`
  })
  ```

- **Vea también:** [Directivas Personalizadas](../guide/custom-directive.html)

## components

- **Tipo:** `Object`

- **Detalles:**

  Un _hash_ de componentes que se hacen disponibles en la instancia de componente.

- **Uso:**

  ```js
  const Foo = {
    template: `<div>Foo</div>`
  }

  const app = createApp({
    components: {
      Foo
    },
    template: `<Foo />`
  })
  ```

- **Vea también:** [Básicos de Componentes](../guide/component-basics.html)
