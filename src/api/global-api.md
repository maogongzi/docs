---
sidebarDepth: 1
---

# API Global

Si está utilizando una compilación de CDN, luego las funciones de la API global son disponibles mediante el objeto global `Vue`. p. ej.:

```js
const { createApp, h, nextTick } = Vue
```

Si está utilizando módulos ES, luego pueden ser importados directamente:

```js
import { createApp, h, nextTick } from 'vue'
```

Las funciones globales que se encargan de la reactividad, como `reactive` y `ref`, son documentadas por separado. Vea [API de Reactividad](/api/reactivity-api.html) para estas funciones.

## createApp

Retorna una instancia de aplicación que proporciona un contexto de aplicación. El árbol completo de componentes montado por la instancia de aplicación comparte el mismo contexto.

```js
const app = createApp({})
```

Puede encadenar otros métodos después de `createApp`, los cuales se pueden encontrar en [API de Aplicación](./application-api.html)

### Argumentos

La función recibe un objeto de opciones de componente raíz como el primer parámetro:

```js
const app = createApp({
  data() {
    return {
      ...
    }
  },
  methods: {...},
  computed: {...}
  ...
})
```

Con el segundo parámetro, podemos pasar _props_ raíz a la aplicación:

```js
const app = createApp(
  {
    props: ['username']
  },
  { username: 'Evan' }
)
```

```html
<div id="app">
  <!-- se mostrará 'Evan' -->
  {{ username }}
</div>
```

Las _props_ raíz son _props_ crudas, muy similar a esos pasados a [`h`](#h) para crear un VNode. Además de _props_ de componente, pueden también incluir atributos y escuchadores de evento que se van a aplicar al componente raíz.

### Tipar

```ts
interface Data {
  [key: string]: unknown
}

export type CreateAppFunction<HostElement> = (
  rootComponent: PublicAPIComponent,
  rootProps?: Data | null
) => App<HostElement>
```

## h

Retorna un "nodo virtual", usualmente abreviado a **VNode**: un objeto plano que contiene información describiendo a Vue qué tipo de nodo se debe renderizar en la página, incluyendo descripciones de cualquier nodo hijo. Es destinado para [funciones de _render_](../guide/render-function.md) escritos manualmente:

```js
render() {
  return h('h1', {}, 'Algún título')
}
```

### Argumentos

Acepta tres argumentos: `type`, `props` y `children`

#### type

- **Tipo:** `String | Object | Function`

- **Detalles:**

  Un nombre de etiqueta HTML, un componente, un componente asíncrono, o un componente funcional. Se renderizaría un comentario al utilizar una función que retorne _null_. Este parámetro es requerido

#### props

- **Tipo:** `Object`

- **Detalles:**

  Un objeto correspondiente a los atributos, _props_ y eventos que podríamos utilizar en una plantilla. Opcional

#### children

- **Tipo:** `String | Array | Object`

- **Detalles:**

  VNodes hijos, construidos utilizando `h()`, o cadenas de caracteres para obtener "VNodes de texto" o un objeto con _slots_. Opcional

  ```js
  h('div', {}, [
    'Se va algún texto primero.',
    h('h1', 'Un titular'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ])
  ```

## defineComponent

Cuando se trate de la implementación, `defineComponent` no nace nada sino retorna el objeto pasado a el. Sin embargo, en términos de tipar, el valor retornado tiene un constructor de tipo sintético para función manual de _render_, TSX y soporte de herramienta de IDE.

### Argumentos

Un objeto con opciones de componente

```js
import { defineComponent } from 'vue'

const MyComponent = defineComponent({
  data() {
    return { count: 1 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

O una función `setup`, el nombre de la función será utilizado como nombre de componente

```js
import { defineComponent, ref } from 'vue'

const HelloWorld = defineComponent(function HelloWorld() {
  const count = ref(0)
  return { count }
})
```

## defineAsyncComponent

Crea un componente asíncrono que se va a cargar solo cuando sea necesario.

### Argumentos

Para uso básico, `defineAsyncComponent` puede aceptar una función de fábrica que retorne un `Promise`. El _callback_ `resolve` del Promise será llamado cuando haya recuperado su definición de componente desde el servidor. Puede también llamar `reject(reason)` para indicar que la carga haya fallado.

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

Cuando utiliza [registración local](../guide/component-registration.html#local-registration), puede también proporcionar directamente una función que retorne u `Promise`:

```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

Para uso avanzado, `defineAsyncComponent` puede aceptar un objeto:

El método `defineAsyncComponent` puede también retornar un objeto del formato siguiente:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // La función de fábrica
  loader: () => import('./Foo.vue'),
  // Un componente para utilizar mientras se carga el componente asíncrono
  loadingComponent: LoadingComponent,
  // Un componente para utilizar si la carga falla
  errorComponent: ErrorComponent,
  // La demora antes de mostrar el componente de cargamente. Por defecto: 200ms.
  delay: 200,
  // El componente de error será mostrado si un tiempo fuera sea
  // proporcionado y excedido. Por defector: Infinity.
  timeout: 3000,
  // Definir si el componente soporta suspenderse (suspensible). Por defecto: true.
  suspensible: false,
  /**
   *
   * @param {*} error Objeto de mensaje de error
   * @param {*} retry Una función que indica si el componente asíncrono deba reintentar cuando el _promise_ de cargador rechace
   * @param {*} fail  Terminar de fallo
   * @param {*} attempts El tiempo máximo permitido para reintentar
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // reintentar cuando se produce un fallo de recuperar, al máximo 3 intentos
      retry()
    } else {
      // Note que retry/fail se comportan como resolve/reject de un promise:
      // uno de ellos debe ser llamado para continuar la manipulación de errores
      fail()
    }
  },
})
```

**Vea también**: [Componentes Dinámicos & Asíncronos](../guide/component-dynamic-async.html)

## defineCustomElement <Badge text="3.2+" />

Este método acepta el mismo argumento como [`defineComponent`](#definecomponent), pero en cambio retorna un [Elemento Personalizado](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) nativo que pueda ser utilizado dentro de cualquier _framework_, o sin frameworks por completo.

Ejemplo de uso:

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // opciones normales de componente Vue aquí
  props: {},
  emits: {},
  template: `...`,

  // sólo para defineCustomElement: el CSS para ser inyectado en raíz de _shadow_
  styles: [`/* css alineado */`]
})

// Registrar el elemento personalizado.
// Después de la registración, todas etiquetas `<my-vue-element>` en la página serán actualizadas.
customElements.define('my-vue-element', MyVueElement)

// Puede también programáticamente instanciar el elemento:
// (solo puede hacerlo después de la registración)
document.body.appendChild(
  new MyVueElement({
    // props iniciales (opcional)
  })
)
```

Para más detalles sobre construir componentes web con Vue, especialmente con componentes de un solo archivo, vea [Vue y Componentes Web](/guide/web-components.html#building-custom-elements-with-vue).

## resolveComponent

:::warning
`resolveComponent` solo puede ser utilizado dentro de funciones `render` o `setup`.
:::

Permite resolver un componente por su nombre, si es disponible en la instancia actual de aplicación.

Retorna un componente o el argumento `name` si no se encuentra uno.

```js
const app = createApp({})
app.component('MyComponent', {
  /* ... */
})
```

```js
import { resolveComponent } from 'vue'
render() {
  const MyComponent = resolveComponent('MyComponent')
}
```

### Argumentos

Acepta un argumento: `name`

#### name

- **Tipo:** `String`

- **Detalles:**

  El nombre de un componente cargado.

## resolveDynamicComponent

:::warning
`resolveDynamicComponent` solo puede ser utilizado dentro de funciones `render` o `setup`.
:::

Permite resolver un componente por el mismo mecanismo utilizado por `<component :is="">`.

Retorna un componente resuelto o un `VNode` recién creado con el nombre del componente como la etiqueta del nodo. Lanzará una advertencia si no se encuentra el componente.

```js
import { resolveDynamicComponent } from 'vue'
render () {
  const MyComponent = resolveDynamicComponent('MyComponent')
}
```

### Argumentos

Acepta un argumento: `component`

#### component

- **Tipo:** `String | Object (el objeto de opciones del componente)`

- **Detalles:**

  Para más detalles, refiérase a la documentación sobre [Componentes Dinámicos & Asíncronos](../guide/component-dynamic-async.html).

## resolveDirective

:::warning
`resolveDirective` solo puede ser utilizado dentro de funciones `render` o `setup`.
:::

Permite resolver una directiva por su nombre, si es disponible en la instancia actual de aplicación.

Retorna una directiva o `undefined` cuando no se encuentra una.

```js
const app = createApp({})
app.directive('highlight', {})
```

```js
import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
```

### Argumentos

Acepta un argumento: `name`

#### name

- **Tipo:** `String`

- **Detalles:**

  El nombre de la directiva cargada.

## withDirectives

:::warning
`withDirectives` solo puede ser utilizado dentro de funciones `render` o `setup`.
:::

Permite aplicar directivas a un **VNode**. Retorna un VNode con las directivas aplicadas.

```js
import { withDirectives, resolveDirective } from 'vue'
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h('div'), [
  [foo, this.x],
  [bar, this.y]
])
```

### Argumentos

Acepta dos argumentos: `vnode` y `directives`.

#### vnode

- **Tipo:** `vnode`

- **Detalles:**

  Un nodo virtual, usualmente creado por `h()`.

#### directives

- **Tipo:** `Array`

- **Detalles:**

  Una matriz de directivas.

  Cada directiva es en sí mismo una matriz, lo cual permite un máximo de 4 índices definidos como se ve en el ejemplo siguiente.

  - `[directive]` - La directiva por sí mismo. Requerida.

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective]])
  ```

  - `[directive, value]` - como se describe arriba, más un valor de tipo `any` para ser asignado a la directiva

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective, 100]])
  ```

  - `[directive, value, arg]` - como se describe arriba, más un argumento `String`, p. ej. `click` en `v-on:click`

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click']
  ])
  ```

  - `[directive, value, arg, modifiers]` - como se describe arriba, más un `Object` con pares `key: value` para definir cualquieres modificadores.

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click', { prevent: true }]
  ])
  ```

## createRenderer

La función `createRenderer` acepta dos argumentos genéricos:
`HostNode` y `HostElement`, correspondiente a tipos Node y Element en el entorno de acogida.

Por ejemplo, para _runtime-dom_, HostNode sería la interfaz `Node` de DOM y HostElement sería la interfaz `Element` de DOM.

Se puede pasar tipos específicos de la plataforma a renderizadores personalizados como esto:

```ts
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})
```

### Argumentos

Acepta dos argumentos: `HostNode` y `HostElement`

#### HostNode

- **Tipo:** `Node`

- **Detalles:**

  El nodo en el entorno de acogida.

#### HostElement

- **Tipo:** `Element`

- **Detalles:**

  El elemento en el entorno de acogida.

## nextTick

Diferir la ejecución del _callback_ hasta después el proximo ciclo de actualización de DOM. Utilícelo inmediatamente después de que haya cambiado algún dato para esperar a la actualización de DOM.

```js
import { createApp, nextTick } from 'vue'

const app = createApp({
  setup() {
    const message = ref('Hello!')
    const changeMessage = async newMessage => {
      message.value = newMessage
      await nextTick()
      console.log('Now DOM is updated')
    }
  }
})
```

**Vea también**: [el método de instancia `$nextTick`](instance-methods.html#nexttick)

## mergeProps

Toma múltiples objetos que contienen _props_ de VNode y fundirlos en un solo objeto. Retorna un objeto recién creado, los objetos pasados como argumentos no se modifican.

Cualquier número de objetos pueden ser pasados, con las propiedades que previenen de argumentos posteriores toman precedencia. Los escuchadores de evento son manejados especialmente, así como `class` y `style`, siendo los valores de estas propiedades fundidos en vez de sobreescritos.

```js
import { h, mergeProps } from 'vue'

export default {
  inheritAttrs: false,

  render() {
    const props = mergeProps(
      {
        // La clase será fundida con cualquier clase proviene de $attrs
        class: 'active'
      },
      this.$attrs
    )

    return h('div', props)
  }
}
```

## useCssModule

:::warning
`useCssModule` solo puede ser utilizado dentro de funciones `render` o `setup`.
:::

Permite que los módulos CSS puedan ser accesados dentro de la función [`setup`](/api/composition-api.html#setup) de un [componente de un solo archivo](/guide/single-file-component.html):

```vue
<script>
import { h, useCssModule } from 'vue'

export default {
  setup() {
    const style = useCssModule()

    return () =>
      h(
        'div',
        {
          class: style.success
        },
        'Task complete!'
      )
  }
}
</script>

<style module>
.success {
  color: #090;
}
</style>
```

Para más información sobre utilizar módulos CSS, vea [Característica de Estilos de SFC: `<style module>`](/api/sfc-style.html#style-module).

### Argumentos

Acepta un argumento: `name`

#### name

- **Tipo:** `String`

- **Detalles:**

  El nombre del módulo CSS, por defecto `'$style'`.

## version

Proporciona el vesión de Vue instalado como una cadena de caracteres.

```js
const version = Number(Vue.version.split('.')[0])

if (version === 3) {
  // Vue 3
} else if (version === 2) {
  // Vue 2
} else {
  // versiones de Vue no soportados
}
```

**Vea también**: [API de Aplicación - versión](/api/application-api.html#version)
