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
  - `type` - `string`. Especifica los tipos de eventos de transición a esperar para determinar el tiempo de finalización de la transición. Los valores disponibles son `"transition"` y `"animation"`. Por defecto, detectará automáticamente el tipo que tiene una mayor duración.
  - `mode` - `string` Controla la secuencia de tiempo de las transiciones de entrada/salida. Los modos disponibles son `"out-in"` e `"in-out"`. Por defecto es en simultáneo.
  - `duration` - `number | { enter: number, leave: number }`. Especifica la duración de la transición. Por defecto, Vue espera el primer evento de `transitionend` o `animationend` en el elemento de transición raíz.
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
  - `leave-cancelled` (`v-show` solamente)
  - `appear-cancelled`

- **Uso:**

  `<transition>` sirven como efectos de transición para ***un solo*** elemento/componente. La `<transition>` solo aplica el comportamiento de transición al contenido envuelto en el interior; no renderiza un elemento DOM adicional ni aparece en la jerarquía de componentes inspeccionados.

  ```html
  <!-- elemento simple -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- componente dinámico -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- aplicar hooks de eventos -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">contenido alternado</div>
    </transition>
  </div>
  ```

  ```js
  const app = createApp({
    ...
    methods: {
      transitionComplete (el) {
        // para el elemento 'el' del DOM pasado como argumento, haga algo...
      }
    }
    ...
  })

  app.mount('#transition-demo')
  ```

- **Vea también:** [Transiciones de Entrada/Salida](/guide/transitions-enterleave.html#transitioning-single-elements-components)

## transition-group

- **Props:**

  - `tag` - `string`, si no está definido, se renderiza sin un elemento raíz.
  - `move-class` - sobrescribir la clase CSS aplicada durante la transición de movimiento.
  - expone las mismas props de `<transition>`, salvo `mode`.

- **Eventos:**

  - exposes the same events as `<transition>`.

- **Uso:**

  `<transition-group>` provee efectos de transición para **múltiples** elementos/componentes. Por defecto no renderiza un elemento DOM de envoltorio, pero se puede configurar uno a través del atributo `tag`.

  Tenga en cuenta que cada hijo en un `<transition-group>` debe tener [**una clave única**](./special-attributes.html#key) para que las animaciones funcionen correctamente.

  `<transition-group>` admite transiciones en movimiento a través de la transformación CSS. Cuando la posición de un hijo en la pantalla ha cambiado después de una actualización, se aplicará una clase CSS en movimiento (generada automáticamente desde el atributo `name` o configurada con el atributo `move-class`). Si la propiedad CSS `transform` es "capaz de transición" cuando se aplica la clase en movimiento, el elemento se animará suavemente a su destino utilizando la [técnica FLIP](https://aerotwist.com/blog/flip-your-animations/).


  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Vea también:** [Transiciones de Listas](/guide/transitions-list.html)

## keep-alive

- **Props:**

  - `include` - `string | RegExp | Array`. Solo los componentes con nombres coincidentes se almacenarán en caché.
  - `exclude` - `string | RegExp | Array`. Cualquier componente con un nombre coincidente no se almacenará en caché.
  - `max` - `number | string`. El número máximo de instancias de componentes para almacenar en caché.

- **Uso:**

  Cuando se envuelve alrededor de un componente dinámico, `<keep-alive>` almacena en caché las instancias de componentes inactivos sin destruirlas. Similar a `<transition>`, `<keep-alive>` es un componente abstracto: no representa un elemento DOM en sí mismo, y no aparece en la cadena padre del componente.

  Cuando un componente se alterna dentro de `<keep-alive>`, los _hooks_ del ciclo de vida `activated` y `deactivated` se invocarán en consecuencia, proveyendo una alternativa a `mounted` y `unmounted`, los que no son invovados. (Este se aplica al hijo directo de `<keep-alive>` así como todos sus descendientes.)

  Se utiliza principalmente para preservar el estado de los componentes o evitar la re-renderización.

  ```html
  <!-- básico -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- varios hijos condicionales -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- utilizado junto con `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note que, `<keep-alive>` está diseñado para el caso en que tiene un componente secundario directo que se está alternando. No funciona si usted tiene un `v-for` dentro de este. Cuando hay varios hijos condicionales, como arriba, `<keep-alive>` requiere que solo se renderice un hijo a la vez.

- **`include` y `exclude`**

  Las props `include` y `exclude` permiten que los componentes se almacenen en caché condicionalmente. Ambas propiedades pueden ser una cadena de caracteres delimitada por comas, una RegExp o un Array:

  ```html
  <!-- cadena delimitada por comas -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (utiliza `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (utiliza `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  La coincidencia se verifica primero en la propia opción `name` del componente, luego su nombre de registro local (la clave en la opción `components` del padre) si la opción `name` no está disponible. Los componentes anónimos no se pueden comparar.

- **`max`**

  El número máximo de instancias de componentes para almacenar en caché. Una vez que se alcanza este número, la instancia del componente en caché a la que se accedió menos recientemente se destruirá antes de crear una nueva instancia.

  ```html
  <keep-alive :max="10">
    <component :is="view"></component>
  </keep-alive>
  ```

  ::: warning
  `<keep-alive>` no funciona con componentes funcionales porque no tienen instancias para almacenar en caché.
  :::

- **Vea también:** [Componentes Dinámicos - keep-alive](../guide/component-dynamic-async.html#dynamic-components-with-keep-alive)

## slot

- **Props:**

  - `name` - `string`, utilizado para _slots_ nombrados.

- **Uso:**

  `<slot>` sirve los puntos de distribución de contenido en plantillas de componentes. `<slot>` en sí será reemplazado.

  Para un uso detallado, consulte la sección de la guía vinculada a continuación.

- **Vea también:** [Distribución de contenido con Slots](../guide/component-basics.html#content-distribution-with-slots)

## teleport

- **Props:**

  - `to` - `string`. prop requerida, tiene que ser un _query selector_ válido, u un HTMLElement (si se utiliza dentro de un entorno de navegador). Especifica un elemento de destino adónde el contenido de `<teleport>` se moverá

  ```html
  <!-- bien -->
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />

  <!-- mal -->
  <teleport to="h1" />
  <teleport to="some-string" />
  ```

  - `disabled` - `boolean`. Esta prop opcional puede ser utilizada para deshabilitar las funcionalidades de `<teleport>`, lo que significa que el contenido de su slot no se moverá a cualquier lugar y en su lugar será renderizado dónde especificaste el `<teleport>` en el componente padre circundante.

  ```html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

  Note que este moverá los nodos DOM actuales en vez de destruirlo y recrearlos, y también va a mantener vivientes a cualquieras instancias de componente. Todos elementos HTML con estados (p. ej. un video que se está reproduciendo) mantendrá sus estados.

- **Vea también:** [El componente Teleport](../guide/teleport.html#teleport)
