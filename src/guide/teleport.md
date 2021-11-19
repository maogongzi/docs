# Teleport

<VideoLesson href="https://vueschool.io/lessons/vue-3-teleport?friend=vuejs" title="Aprender como utilizar teleport con Vue School">Aprender como utilizar teleport con una lección gratis en Vue School</VideoLesson>

Vue nos recomienda construir nuestros interfaces de usuario mediante encapsular interfaz de usuario y comportamientos relativos en componentes. Podemos anidarlos uno dentro del otro para construir un árbol que forma el interfaz de usuario de aplicación.

Sin embargo, a veces una parte de la plantilla de un componente pertenece a este componente lógicamente, mientras desde un punto de vista técnico, sería preferible mover esta parte de la plantilla a un lugar diferente dentro del DOM, afuera de la aplicación Vue.

Un escenario común para esto es crear un componente que incluye un diálogo modal de pantalla completa. En la mayoría de los casos, quería que la lógica del modal vive dentro del componente, pero el posicionamiento del modal se vuelve rápidamente difícil para ser manejado por CSS, o requiere un cambio en la composición del componente.

Considere la siguiente estructura HTML.

```html
<body>
  <div style="position: relative;">
    <h3>Tooltips con Teleport de Vue 3</h3>
    <div>
      <modal-button></modal-button>
    </div>
  </div>
</body>
```

Veamos al `modal-button`.

Este componente tendrá un elemento `button` para disparar la apertura del modal, y un elemento `div` con una clase `.modal`, lo cual contendrá el contenido del modal y un botón para cerrar a sí mismo.

```js
const app = Vue.createApp({});

app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        ¡Abre el modal de pantalla completa!
    </button>

    <div v-if="modalOpen" class="modal">
      <div>
        ¡Yo soy un modal!
        <button @click="modalOpen = false">
          Cerrar
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      modalOpen: false
    }
  }
})
```

Cuando se utilice este componente dentro de la inicial estructura de HTML, podemos percibir una problema - el modal está renderizado dentro del elemento `div` anidado profundamente y el `position: absolute` del modal toma el padre `div` posicionado relativamente como referencia.

Teleport proporciona un método limpio que nos permita controlar el lugar debajo de cuál padre dentro del DOM quisiéramos que una pieza de HTML sea renderizado, sin necesidad de acudir a estado global o dividir esto en dos componentes.

Vamos a modificar nuestro `modal-button` para utilizar `<teleport>` y pedimos a Vue a "**teletransportar** este HTML **a** la etiqueta **body**".

```js
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        ¡Abre el modal de pantalla completa!(¡Con teleport!)
    </button>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          ¡Yo soy un modal teletransportado!
          (Mi papá es "body")
          <button @click="modalOpen = false">
            Cerrar
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return {
      modalOpen: false
    }
  }
})
```

Como un resultado, una vez que cliqueamos el botón para abrir el modal, Vue renderizará correctamente el contenido del modal como un hijo de la etiqueta `body`.

<common-codepen-snippet title="Teleport de Vue 3" slug="gOPNvjR" tab="js,result" />

## Utilizar con componentes Vue

Si `<teleport>` contiene un componente Vue, permanecerá como un hijo componente lógico del padre de `<teleport>`:

```js
const app = Vue.createApp({
  template: `
    <h1>Instancia raíz</h1>
    <parent-component />
  `
})

app.component('parent-component', {
  template: `
    <h2>Este es un padre componente</h2>
    <teleport to="#endofbody">
      <child-component name="John" />
    </teleport>
  `
})

app.component('child-component', {
  props: ['name'],
  template: `
    <div>Hola, {{ name }}</div>
  `
})
```

En este caso, aunque cuando `child-component` está renderizado en el lugar diferente, permanecerá como un hijo de `parent-component` y recibirá un prop `name` desde el.

Este tambien significa que inyecciones desde un padre componente funcionan como se esperaba, y que el hijo componente será anidado debajo del padre componente en el Devtools de Vue, en vez de ser colocado en el lugar donde el contenido actual está mudado.

## Utilizar múltiple teleports en el mismo objetivo

Un caso de uso común sería que un reutilizable componente `<Modal>` de lo que podría tener múltiples instancias activas en el mismo tiempo. Para este tipo de escenario, múltiples componentes de `<teleport>` pueden montar sus contenidos al mismo elemento objetivo. El orden depende de la acción de añadir - el posterior montado será colocado después de los anteriores dentro del elemento objetivo.

```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

Consulte las opciones del componente `<teleport>` en [Referencia de API](../api/built-in-components.html#teleport).
