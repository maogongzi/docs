# Directivas

## v-text

- **Espera:** `string`

- **Detalles:**

  Actualiza el [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) del elemento. Si usted necesita actualizar parte del `textContent`, usted debe utilizar [interpolaciones Mustache](/guide/template-syntax.html#text) en su lugar

- **Ejemplo:**

  ```html
  <span v-text="msg"></span>
  <!-- es equivalente a -->
  <span>{{msg}}</span>
  ```

- **Vea también:** [Sintaxis de Vinculación de Dato - Interpolaciones](../guide/template-syntax.html#text)

## v-html

- **Espera:** `string`

- **Detalles:**

  Actualiza el [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) del elemento. **Note que los contenidos son insertados como HTML plano - no serán compilados como plantillas Vue**. Si usted se encuentra intentando componer plantillas utilizando `v-html`, intente pensar una solución utilizando componentes en su lugar.

  ::: warning
  Renderizar dinámicamente HTML arbitrario en su sitio web puede ser muy peligroso porque puede conducir fácilmente a [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Solo utilice `v-html` en contenido confiable y **nunca** en contenido provisto por el usuario.
  :::

  En [Componentes de un solo archivo](../guide/single-file-components.html), los estilos `scoped` no aplicarán al contenido dentro de `v-html`, porque el HTML no será procesado por el compilador de plantillas de Vue. Si usted quiere aplicar estilos _scoped_ al contenido `v-html`, puede utilizar [módulos CSS](https://vue-loader.vuejs.org/en/features/css-modules.html) o un elemento `<style>` global adicional, con una estrategia manual como BEM por ejemplo. 

- **Ejemplo:**

  ```html
  <div v-html="'<h1>Hola Mundo</h1>'"></div>
  ```

- **Vea también:** [Sintaxis de Vinculación de Dato - Interpolaciones](../guide/template-syntax.html#raw-html)

## v-show

- **Espera:** `any`

- **Uso:**

  Cambia la propiedad CSS `display` del elemento basado en la veracidad del valor de la expresión.

  La directiva dispara transiciones cuando su condición cambie.

- **Vea también:** [Renderización condicional - v-show](../guide/conditional.html#v-show)

## v-if

- **Espera:** `any`

- **Uso:**

  Renderiza condicionalmente el elemento basado en la veracidad del valor de la expresión. El elemento y sus directivas / componentes son destruidas y re-construidas al cambiar el valor de la expresión. Si el elemento es un `<template>`, su contenido será extraído como un bloque condicional.

  Esta directiva dispara transiciones cuando su condición cambie.

  `v-if` tiene una prioridad mayor que `v-for` cuando los dos se utilicen juntos. No recomendamos utilizarlas juntos en un elemento, vea el [guía de renderizado de listas](../guide/list.html#v-for-with-v-if) para más detalles.

- **Vea también:** [Renderización condicional - v-if](../guide/conditional.html#v-if)

## v-else

- **No espera una expresión**

- **Restricción:** el elemento hermano previo debe tener `v-if` o `v-else-if`.

- **Uso:**

  Denota el "bloque _else_" para `v-if` o una cadena `v-if`/`v-else-if`.

  ```html
  <div v-if="Math.random() > 0.5">
    Ahora me ve
  </div>
  <div v-else>
    Ahora no
  </div>
  ```

- **Vea también:** [Renderización condicional - v-else](../guide/conditional.html#v-else)

## v-else-if

- **Espera:** `any`

- **Restricción:** el elemento hermano previo debe tener `v-if` o `v-else-if`.

- **Uso:**

  Denota el "bloque _else if_" para `v-if` . Puede ser encadenado.

  ```html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Ninguno de ellos
  </div>
  ```

- **Vea también:** [Renderización condicional - v-else-if](../guide/conditional.html#v-else-if)

## v-for

- **Espera:** `Array | Object | number | string | Iterable`

- **Uso:**

  Renderiza el elemento o plantilla múltiples veces basado en la fuente de dato. El valor de la directiva debe utilizar la sintaxis especial `alias in expresión` para proveer un alias para el elemento actual en el cual se está iterando:

  ```html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternativamente, usted también puede especificar un alias para el índice (o la clave si es utilizado con un objeto):

  ```html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  El comportamiento por defecto de `v-for` intentará parchar los elementos en situ sin moverlos. Para forzar un reordenamiento de elementos, usted debe proveer una pista de ordenamiento con el atributo especial `key`:

  ```html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` también funciona con valores que implementan el [Protocolo Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), incluyendo el `Map` y `Set` nativo.

  El uso más detallado para `v-for` es explicado en la sección del guía referenciada abajo.

- **Vea también:**
  - [Renderización de lista](../guide/list.html)

## v-on

- **Abreviación:** `@`

- **Espera:** `Function | Inline Statement | Object`

- **Argumento:** `event`

- **Modificadores:**

  - `.stop` - invoca `event.stopPropagation()`.
  - `.prevent` - invoca `event.preventDefault()`.
  - `.capture` - agrega escuchador de evento en modo de captura.
  - `.self` - invoca el manejador solo si el evento fue disparado por el elemento mísmo.
  - `.{keyAlias}` - invoca el manejador solo con algunas teclas.
  - `.once` - invoca el manejador a lo sumo una vez.
  - `.left` - invoca el manejador solo para eventos del botón izquierdo del ratón.
  - `.right` - invoca el manejador solo para eventos del botón derecho del ratón.
  - `.middle` - invoca el manejador solo para eventos del botón central del ratón.
  - `.passive` - adjunta un evento DOM con `{ passive: true }`.

- **Uso:**

  Adjunta un escuchador de evento al elemento. El tipo del evento es denotado por el argumento. La expresión puede ser el nombre de un método, una declaración en línea u omitida cuando se encuentren modificadores.

  Cuando se utilice en un elemento normal, escucha solo a [**evento DOM nativos**](https://developer.mozilla.org/en-US/docs/Web/Events). Cuando se utilice en un componente de elemento personalizado, escucha a **eventos personalizados** emitidos por ese componente hijo.

  Cuando se escucha por eventos DOM nativos, el método recibe el evento nativo como único argumento. Si se utiliza una declaración en línea, la declaración tiene acceso a la propiedad especial `$event`: `v-on:click="handle('ok', $event)"`.

  `v-on` también soporta vinculación a un objeto de pares de _evento/escuchador_ sin argumentos. Note que cuando se utiliza la sintaxis de objeto, esta no soporta ningún modificador.

- **Ejemplo:**

  ```html
  <!-- método como manejador -->
  <button v-on:click="doThis"></button>

  <!-- evento dinámico -->
  <button v-on:[event]="doThis"></button>

  <!-- declaración en línea -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- abreviación -->
  <button @click="doThis"></button>

  <!-- abreviación para evento dinámico -->
  <button @[event]="doThis"></button>

  <!-- detener la propagación -->
  <button @click.stop="doThis"></button>

  <!-- prevenir el comportamiento por defecto -->
  <button @click.prevent="doThis"></button>

  <!-- prevenir el comportamiento por defecto sin expresión alguna -->
  <form @submit.prevent></form>

  <!-- modificadores en cadena -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modificador de tecla utilizando keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- el evento click será lanzado a lo sumo una vez -->
  <button v-on:click.once="doThis"></button>

  <!-- sintaxis de objeto -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Escucha a eventos personalizados en un componente hijo (el manejador es invocado cuando "my-event" es emitido en el hijo):

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- declaración en línea -->
  <my-component @my-event="handleThis(123, $event)"></my-component>
  ```

- **Vea también:**
  - [Manejo de eventos](../guide/events.html)
  - [Componentes - Eventos Personalizados](../guide/component-basics.html#listening-to-child-components-events)

## v-bind

- **Abreviación:** `:` o `.` (cuando se utilice el modificador `.prop`)

- **Espera:** `any (con argumento) | Object (sin argumento)`

- **Argumento:** `attrOrProp (opcional)`

- **Modificadores:**

  - `.camel` - transforma el nombre del atributo de _kebab-case_ a _camelCase_.
  - `.prop` - forzar una vinculación para establecerse como una propiedad DOM. <Badge text="3.2+"/>
  - `.attr` - forzar una vinculación para establecerse como un atributo DOM. <Badge text="3.2+"/>

- **Uso:**

  Vincula dinámicamente uno o más atributos, o una _prop_ de componente a una expresión.

  Cuando se utiliza para vincular el atributo `class` o `style`, soporta tipos adicionales de valor tales como _Array_ u _Object_. Vea la sección del guía referenciada abajo para más detalles.

  Cuando se utiliza para vincular una _prop_, la _prop_ debe ser declarada en el componente hijo de forma acorde.

  Cuando se utiliza sin argumento, puede ser utilizado para vincular un objeto que contenga pares nombre-valor de atributos. Note que en este modo los atributos `class` y `style` no soportan _Array_ u _Object_.

- **Ejemplo:**

  ```html
  <!-- vincular un atributo -->
  <img v-bind:src="imageSrc" />

  <!-- nombre de atributo dinámico -->
  <button v-bind:[key]="value"></button>

  <!-- abreviación -->
  <img :src="imageSrc" />

  <!-- abreviación de nombre de atributo dinámico -->
  <button :[key]="value"></button>

  <!-- con concatenación en línea de cadena de caracteres -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- vinculación del atributo class -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- vinculación del atributo style -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- vincular un objeto de atributos -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- vinculación de _prop_. "prop" debe ser declarada en my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- pasar las props del padre al componente hijo  -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  When setting a binding on an element, Vue by default checks whether the element has the key defined as a property using an `in` operator check. If the property is defined, Vue will set the value as a DOM property instead of an attribute. This should work in most cases, but you can override this behavior by explicitly using `.prop` or `.attr` modifiers. This is sometimes necessary, especially when [working with custom elements](/guide/web-components.html#passing-dom-properties).

  The `.prop` modifier also has a dedicated shorthand, `.`:

  ```html
  <div :someProperty.prop="someObject"></div>

  <!-- equivalent to -->
  <div .someProperty="someObject"></div>
  ```

  The `.camel` modifier allows camelizing a `v-bind` attribute name when using in-DOM templates, e.g. the SVG `viewBox` attribute:

  ```html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` is not needed if you are using string templates, or compiling with `vue-loader`/`vueify`.

- **Vea también:**
  - [Class and Style Bindings](../guide/class-and-style.html)
  - [Components - Props](../guide/component-basics.html#passing-data-to-child-components-with-props)

## v-model

- **Espera:** varies based on value of form inputs element or output of components

- **Limitado a:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modificadores:**

  - [`.lazy`](../guide/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](../guide/forms.html#number) - cast valid input string to numbers
  - [`.trim`](../guide/forms.html#trim) - trim input

- **Uso:**

  Create a two-way binding on a form input element or a component. For detailed usage and other notes, see the Guide section linked below.

- **Vea también:**
  - [Form Input Bindings](../guide/forms.html)
  - [Components - Form Input Components using Custom Events](../guide/component-custom-events.html#v-model-arguments)

## v-slot

- **Abreviación:** `#`

- **Espera:** JavaScript expression that is valid in a function argument position (supports destructuring in [supported environments](../guide/component-slots.html#destructuring-slot-props)). Optional - only needed if expecting props to be passed to the slot.

- **Argumento:** slot name (optional, defaults to `default`)

- **Limitado a:**

  - `<template>`
  - [components](../guide/component-slots.html#abbreviated-syntax-for-lone-default-slots) (for a lone default slot with props)

- **Uso:**

  Denote named slots or slots that expect to receive props.

- **Ejemplo:**

  ```html
  <!-- Named slots -->
  <base-layout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </base-layout>

  <!-- Named slot that receives props -->
  <infinite-scroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </infinite-scroll>

  <!-- Default slot that receive props, with destructuring -->
  <mouse-position v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </mouse-position>
  ```

  For more details, see the links below.

- **Vea también:**
  - [Components - Slots](../guide/component-slots.html)

## v-pre

- **Does not expect expression**

- **Uso:**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Ejemplo:**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-cloak

- **Does not expect expression**

- **Uso:**

  This directive will remain on the element until the associated component instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the component instance is ready.

- **Ejemplo:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

## v-once

- **Does not expect expression**

- **Detalles:**

  Render the element and component **once** only. On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Since 3.2, you can also memoize part of the template with invalidation conditions using [`v-memo`](#v-memo).

- **Vea también:**
  - [Data Binding Syntax - interpolations](../guide/template-syntax.html#text)
  - [v-memo](#v-memo)

## v-memo <Badge text="3.2+" />

- **Espera:** `Array`

- **Detalles:**

  Memoize a sub-tree of the template. Can be used on both elements and components. The directive expects a fixed-length array of dependency values to compare for the memoization. If every value in the array was the same as last render, then updates for the entire sub-tree will be skipped. For example:

  ```html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  When the component re-renders, if both `valueA` and `valueB` remain the same, all updates for this `<div>` and its children will be skipped. In fact, even the Virtual DOM VNode creation will also be skipped since the memoized copy of the sub-tree can be reused.

  It is important to specify the memoization array correctly, otherwise we may skip updates that should indeed be applied. `v-memo` with an empty dependency array (`v-memo="[]"`) would be functionally equivalent to `v-once`.

  **Usage with `v-for`**

  `v-memo` is provided solely for micro optimizations in performance-critical scenarios and should be rarely needed. The most common case where this may prove helpful is when rendering large `v-for` lists (where `length > 1000`):

  ```html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  When the component's `selected` state changes, a large amount of VNodes will be created even though most of the items remained exactly the same. The `v-memo` usage here is essentially saying "only update this item if it went from non-selected to selected, or the other way around". This allows every unaffected item to reuse its previous VNode and skip diffing entirely. Note we don't need to include `item.id` in the memo dependency array here since Vue automatically infers it from the item's `:key`.

  :::warning
  When using `v-memo` with `v-for`, make sure they are used on the same element. **`v-memo` does not work inside `v-for`.**
  :::

  `v-memo` can also be used on components to manually prevent unwanted updates in certain edge cases where the child component update check has been de-optimized. But again, it is the developer's responsibility to specify correct dependency arrays to avoid skipping necessary updates.

- **Vea también:**
  - [v-once](#v-once)

## v-is <Badge text="deprecated" type="warning" />

Deprecated in 3.1.0. Use [`is` attribute with `vue:` prefix](/api/special-attributes.html#is) instead.
