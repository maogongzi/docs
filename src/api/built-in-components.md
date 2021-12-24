# Componentes Integrados

Componentes integrados pueden ser utilizados directamente en plantillas sin necesidad de ser registrados.

Todos los componentes `<keep-alive>`, `<transition>`, `<transition-group>`, y `<teleport>` pueden ser quitados del árbol (tree-shaken) por los compiladores, así que son solo incluidos en la compilación si son utilizados. Pueden también ser importados explícitamente si necesita el acceso directo al componente mísmo:

```js
// compilación Vue de CDN
const { KeepAlive, Teleport, Transition, TransitionGroup } = Vue
```

```js
// compilación Vue de ESM
import { KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'
```

`<component>` y `<slot>` son características de sintaxis de plantilla similares a componentes. No son verdaderos componentes y no pueden ser importados como los componentes mostrados arriba.

## component

- **Props:**

  - `is` - `string | Component | VNode`

- **Uso:**

  Un "metacomponente" ("meta component") para renderizar componentes dinámicos. El componente actual que se renderizará está determinado por la propiedad `is`. Una _prop_ `is`, como una cadena de caracteres, podría ser tanto el nombre de una etiqueta HTML como el nombre de un componente.

  ```html
  <!-- un componente dinámico controlado por -->
  <!-- la propiedad `componentId` en el vm -->
  <component :is="componentId"></component>

  <!-- Además puede renderizar un componente registrado o un componente -->
  <!-- pasado como prop -->
  <component :is="$options.components.child"></component>

  <!-- puede referir a los componentes por cadena de caracteres -->
  <component :is="condition ? 'FooComponent' : 'BarComponent'"></component>

  <!-- puede ser utilizado para renderizar elementos HTML nativos -->
  <component :is="href ? 'a' : 'span'"></component>
  ```

- **Uso con componentes integrados:**

  Todos los componentes integrados `KeepAlive`, `Transition`, `TransitionGroup`, y `Teleport` pueden ser pasados a `is`, pero debe registrarlos si quiere pasarlos por nombre. Por ejemplo:

  ```js
  const { Transition, TransitionGroup } = Vue

  const Component = {
    components: {
      Transition,
      TransitionGroup
    },

    template: `
      <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
        ...
      </component>
    `
  }
  ```

  Registración no es requerida si pasa el componente mísmo a `is` en vez de su nombre.

- **Uso con VNodes:**

  En casos de usuario avanzados, a veces puede ser útil renderizar un VNode existente mediante una plantilla. Utilizar un `<component>` lo hace posible, pero debería verse como una escotilla de escape, utilizada para evitar reescribir la entera plantilla como una función `render`.

  ```html
  <component :is="vnode" :key="aSuitableKey" />
  ```

  Una advertencia de mezclar VNodes y plantillas de esta manera es que necesita proporcionar un atributo adecuado `key`. El VNode será considerado estático, así cualquieras actualizaciones serán ignorados a menos que el `key` cambie. El `key` puede en el VNode o la etiqueta `<component>`, pero de cualquier manera debe cambiarse cada vez quiera rerenderizar el VNode. Esta advertencia no aplica si los nodos tienen tipos diferentes, p. ej. cambiar una `span` a `div`.

- **Vea también:** [Componentes dinámicos](../guide/component-dynamic-async.html)

## transition

- **Props:**

  - `name` - `string` Se utiliza para generar nombres de clases de transición CSS. P. ej, `name: 'fade'` se expandirá automáticamente a `.fade-enter`, `.fade-enter-active`, etc.
  - `appear` - `boolean`, Establece si se aplicará la transición en la renderización inicial. El valor por defecto es `false`.
  - `persisted` - `boolean`. Si es `true`, indica que esta es una transición que actualmente no inserta/elimina el elemento, pero cambia el estado de mostrar/ocultar en su lugar. Los hooks de la transición son inyectados, pero serán salteados por el renderizador. En su lugar, una directiva personalizada puede controlar la transición mediante llamar los hooks inyectados (p. ej. `v-show`).
  - `css` - `boolean`. Establece si se aplicará clases de transición CSS. El valor por defecto es `true`. Si se establece como `false`, solo disparará hooks JavaScript registrados mediante eventos de componente.
  - `type` - `string`. Specifies the type of transition events to wait for to determine transition end timing. Available values are `"transition"` and `"animation"`. By default, it will automatically detect the type that has a longer duration.
  - `mode` - `string` Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `duration` - `number | { enter: number, leave: number }`. Specifies the duration of transition. By default, Vue waits for the first `transitionend` or `animationend` event on the root transition element.
  - `enter-from-class` - `string`
  - `leave-from-class` - `string`
  - `appear-class` - `string`
  - `enter-to-class` - `string`
  - `leave-to-class` - `string`
  - `appear-to-class` - `string`
  - `enter-active-class` - `string`
  - `leave-active-class` - `string`
  - `appear-active-class` - `string`

- **Eventos:**

  - `before-enter`
  - `before-leave`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (`v-show` only)
  - `appear-cancelled`

- **Uso:**

  `<transition>` serve as transition effects for **single** element/component. The `<transition>` only applies the transition behavior to the wrapped content inside; it doesn't render an extra DOM element, or show up in the inspected component hierarchy.

  ```html
  <!-- simple element -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- dynamic component -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- event hooking -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ```js
  const app = createApp({
    ...
    methods: {
      transitionComplete (el) {
        // for passed 'el' that DOM element as the argument, something ...
      }
    }
    ...
  })

  app.mount('#transition-demo')
  ```

- **Vea también:** [Enter & Leave Transitions](/guide/transitions-enterleave.html#transitioning-single-elements-components)

## transition-group

- **Props:**

  - `tag` - `string`, if not defined, renders without a root element.
  - `move-class` - overwrite CSS class applied during moving transition.
  - exposes the same props as `<transition>` except `mode`.

- **Eventos:**

  - exposes the same events as `<transition>`.

- **Uso:**

  `<transition-group>` provides transition effects for **multiple** elements/components. By default it doesn't render a wrapper DOM element, but one can be defined via the `tag` attribute.

  Note that every child in a `<transition-group>` must be [**uniquely keyed**](./special-attributes.html#key) for the animations to work properly.

  `<transition-group>` supports moving transitions via CSS transform. When a child's position on screen has changed after an update, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` attribute). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Vea también:** [List Transitions](/guide/transitions-list.html)

## keep-alive

- **Props:**

  - `include` - `string | RegExp | Array`. Only components with matching names will be cached.
  - `exclude` - `string | RegExp | Array`. Any component with a matching name will not be cached.
  - `max` - `number | string`. The maximum number of component instances to cache.

- **Uso:**

  When wrapped around a dynamic component, `<keep-alive>` caches the inactive component instances without destroying them. Similar to `<transition>`, `<keep-alive>` is an abstract component: it doesn't render a DOM element itself, and doesn't show up in the component parent chain.

  When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly, providing an alternative to `mounted` and `unmounted`, which are not called. (This applies to the direct child of `<keep-alive>` as well as to all of its descendants.)

  Primarily used to preserve component state or avoid re-rendering.

  ```html
  <!-- basic -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- multiple conditional children -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- used together with `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note, `<keep-alive>` is designed for the case where it has one direct child component that is being toggled. It does not work if you have `v-for` inside it. When there are multiple conditional children, as above, `<keep-alive>` requires that only one child is rendered at a time.

- **`include` and `exclude`**

  The `include` and `exclude` props allow components to be conditionally cached. Both props can be a comma-delimited string, a RegExp or an array:

  ```html
  <!-- comma-delimited string -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (use `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (use `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  The match is first checked on the component's own `name` option, then its local registration name (the key in the parent's `components` option) if the `name` option is not available. Anonymous components cannot be matched against.

- **`max`**

  The maximum number of component instances to cache. Once this number is reached, the cached component instance that was least recently accessed will be destroyed before creating a new instance.

  ```html
  <keep-alive :max="10">
    <component :is="view"></component>
  </keep-alive>
  ```

  ::: warning
  `<keep-alive>` does not work with functional components because they do not have instances to be cached.
  :::

- **Vea también:** [Dynamic Components - keep-alive](../guide/component-dynamic-async.html#dynamic-components-with-keep-alive)

## slot

- **Props:**

  - `name` - `string`, Used for named slot.

- **Uso:**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **Vea también:** [Content Distribution with Slots](../guide/component-basics.html#content-distribution-with-slots)

## teleport

- **Props:**

  - `to` - `string`. Required prop, has to be a valid query selector, or an HTMLElement (if used in a browser environment). Specifies a target element where `<teleport>` content will be moved

  ```html
  <!-- ok -->
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />

  <!-- Wrong -->
  <teleport to="h1" />
  <teleport to="some-string" />
  ```

  - `disabled` - `boolean`. This optional prop can be used to disable the `<teleport>`'s functionality, which means that its slot content will not be moved anywhere and instead be rendered where you specified the `<teleport>` in the surrounding parent component.

  ```html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

  Notice that this will move the actual DOM nodes instead of being destroyed and recreated, and it will keep any component instances alive as well. All stateful HTML elements (i.e. a playing video) will keep their state.

- **Vea también:** [Teleport component](../guide/teleport.html#teleport)
