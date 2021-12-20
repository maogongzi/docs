# DOM

## template

- **Tipo:** `string`

- **Detalles:**

  Una plantilla de cadena de caracteres que puede ser utilizada como etiquetado para la instancia de componente. La plantilla **reemplzará** el `innerHTML` del elemento montado. Cualquier etiquetado existente dentro del elemento montado será ignorado, a menos que los _slots_ de distribución de contenido son presentes en la plantilla.

  Si la cadena de caracteres empieza con `#`, será utilizada como un `querySelector` y se utiliza el innerHTML del elemento eligido como la cadena de caracteres de plantilla. Este permite el uso del truco común `<script type="x-template">` para incluir plantillas.

  :::tip Note
  Desde una perspectiva de seguridad, debería solo utilizar plantillas de Vue en que confía. Nunca utilice contenido generado por el usuario como su plantilla.
  :::

  :::tip Note
  Si se encuentra función de _render_ en la opción Vue, la plantilla será ignorada.
  :::

- **Vea también:**
  - [Diagrama de Ciclo de Vida](../guide/instance.html#lifecycle-diagram)
  - [Distribución de contenido con Slots](../guide/component-basics.html#content-distribution-with-slots)

## render

- **Tipo:** `Function`

- **Detalles:**

  Una alternativa para plantillas de cadena de caracteres permitíendole apalancar el poder programático completo de JavaScript.

- **Uso:**

  ```html
  <div id="app" class="demo">
    <my-title blog-title="Un Vue Perfecto"></my-title>
  </div>
  ```

  ```js
  const { createApp, h } = Vue
  const app = createApp({})

  app.component('my-title', {
    render() {
      return h(
        'h1', // nombre de la etiqueta,
        this.blogTitle // contenido de la etiqueta
      )
    },
    props: {
      blogTitle: {
        type: String,
        required: true
      }
    }
  })

  app.mount('#app')
  ```

  :::tip Note
  La función `render` tiene prioridad sobre la función _render_ compilada desde la opción `template` o las plantillas HTML dentro del DOM del elemento montado.
  :::

- **Vea también:** [Funciones de Renderización](../guide/render-function.html)
