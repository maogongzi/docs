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

  Cuando se establece una vinculación en un elemento, Vue por defecto comproba si el elemento tenga el clave definido como propiedad utilizando un operador `in`. Si la propiedad es definida, Vue establecerá el valor como propiedad DOM en vez de un atributo. Este funcionaría en la mayoría de casos, pero puede sobreescribir este comportamiento mediante explícitamente utilizar los modificadores `.prop` o `.attr`. Este es a veces necesario, especialmente cuando [se trabaje con elementos personalizados](/guide/web-components.html#passing-dom-properties).


  El modificador `.prop` también tiene una abreviación dedicada, `.`:

  ```html
  <div :someProperty.prop="someObject"></div>

  <!-- es equivalente a -->
  <div .someProperty="someObject"></div>
  ```

  El modificador `.camel` permite transformar el nombre de un atributo de `v-bind` a _camelCase_ cuando se utilice plantillas en DOM, p. ej. el atributo SVG `viewBox`:

  ```html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` no es necesario si usted utiliza plantillas de cadena de caracteres, o compila utilizando `vue-loader`/`vuetify`.

- **Vea también:**
  - [Vinculaciones de Clases y Estilos](../guide/class-and-style.html)
  - [Componentes - Props](../guide/component-basics.html#passing-data-to-child-components-with-props)

## v-model

- **Espera:** varía basado en valores de entradas de formularios o salidas de componentes

- **Limitado a:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - componentes

- **Modificadores:**

  - [`.lazy`](../guide/forms.html#lazy) - escucha un evento `change` en vez de `input`
  - [`.number`](../guide/forms.html#number) - castea valor de entrada válida de cadena de caracteres a número
  - [`.trim`](../guide/forms.html#trim) - recorte el valor de entrada

- **Uso:**

  Crea una vinculación bidireccional (_two way binding_) en un elemento de entrada de formulario o componente. Por más detalles de su uso y otras notas, vea la sección de guía referenciada abajo.

- **Vea también:**
  - [Vinculación de Entradas de Formularios](../guide/forms.html)
  - [Componentes - Componentes de Entrada de Formulario Utilizando Eventos Personalizados](../guide/component-custom-events.html#v-model-arguments)

## v-slot

- **Abreviación:** `#`

- **Espera:** expresión JavaScript que es válida en un posición de argumento de función (soporta desestructuración en [entornos soportados](../guide/component-slots.html#destructuring-slot-props)). Opcional - solo requerido si se espere pasar props al _slot_.

- **Argumento:** nombre del _slot_ (opcional, por defecto `default`)

- **Limitado a:**

  - `<template>`
  - [components](../guide/component-slots.html#abbreviated-syntax-for-lone-default-slots) (para un solo slot por defecto con props)

- **Uso:**

  Denota slots nombrados o slots que esperan recibir props.

- **Ejemplo:**

  ```html
  <!-- slots nombrados -->
  <base-layout>
    <template v-slot:header>
      Contenido del encabezado
    </template>

    <template v-slot:default>
      Contenido del slot por defecto
    </template>

    <template v-slot:footer>
      Contenido del pie de página
    </template>
  </base-layout>

  <!-- slot nombrado que recibe props -->
  <infinite-scroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </infinite-scroll>

  <!-- slot por defecto que recibe props, con desestructuración -->
  <mouse-position v-slot="{ x, y }">
    La posición del ratón: {{ x }}, {{ y }}
  </mouse-position>
  ```

  Para más detalles, vea las enlaces abajo.

- **Vea también:**
  - [Componentes - Slots](../guide/component-slots.html)

## v-pre

- **No espera una expresión**

- **Uso:**

  Saltea la compilación para este elemento y todos sus hijos. Usted puede utilizar esto para mostrar etiquetas _mustache_ crudas. Saltear una gran cantidad de nodos sin directivas en ellos también puede acelerar el tiempo de compilación.

- **Ejemplo:**

  ```html
  <span v-pre>{{ esto no será compilado }}</span>
  ```

## v-cloak

- **No espera una expresión**

- **Uso:**

  Esta directiva permanecerá en el elemento hasta que la instancia Vue asociada termine su compilación. Combinada con reglas de CSS tal como `[v-cloak] { display: none }`, esta directiva puede ser utilizada para esconder vinculaciones _mustache_ no compiladas hasta que la instancia de Vue este lista.

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

  El `<div>` no será visible hasta que la compilación haya terminado.

## v-once

- **No espera una expresión**

- **Detalles:**

  Renderiza el elemento/componente solo **una** vez. En renderizaciones posteriores, el elemento/componente y todos sus hijos serán tratados como contenido estático, y por lo tanto, salteados. Esto puede ser utilizado para optimizar el rendimiento de actualización.

  ```html
  <!-- un solo elemento -->
  <span v-once>Esto nunca cambiará: {{msg}}</span>
  <!-- n elemento con hijos -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- componente -->
  <my-component v-once :comment="msg"></my-component>
  <!-- directiva `v-for` -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Desde la versión 3.2, puede también memorizar parte de la plantilla con condiciones de invalidación utilizando [`v-memo`](#v-memo).

- **Vea también:**
  - [Sintaxis de Vinculación de Dato - Interpolaciones](../guide/template-syntax.html#text)
  - [v-memo](#v-memo)

## v-memo <Badge text="3.2+" />

- **Espera:** `Array`

- **Detalles:**

  Memorizar un subárbol de la plantilla. Puede ser utilizada tanto en elementos como en componentes. La directiva espera una matriz de tamaño fijo de valores de dependencia para comparar para la memorización. Si cada valor de la matriz fue el mismo como el anterior renderizado, las actualizaciones para el subárbol entero será salteado. Por ejemplo:

  ```html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  Cuando el componente se rerenderice, si `valueA` y `valueB` siguen siendo los mismos, todas actualizaciones para este `<div>` y sus hijos serán salteados. De hecho, incluso la creación del VNode DOM virtual será también salteada debido a que la copia memorizada del subárbol pueda ser reutilizada.

  Es importante especificar la matriz de memorización correctmente, de lo contrario podemos saltear actualizaciones que deberían ser aplicadas. `v-memo` con una matriz vacía de dependencia (`v-memo="[]"`) sería en la práctica equivalente a `v-once`.

  **Uso con `v-for`**

  `v-memo` es proporcionada solamente para optimizaciones micros en escenarios que sea crítico el rendimiento y rara vez sería necesaria. El caso má común dónde este puede ser útil es cuando se renderice listas grandes de `v-for` (dónde `length > 1000`):

  ```html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - seleccionados: {{ item.id === selected }}</p>
    <p>...más nodos hijos</p>
  </div>
  ```

  Cuando el estado `selected` del componente se cambie, un gran cantidad de VNodes serán creados aunque la mayoría de los elementos siguen siendo exactamente los mismos. El uso de `v-memo` aquí es escencialmente decir que "solo actualiza este elemento si se haya cambiado desde el estado no seleccionado al estado seleccionado, y viceversa". Este permite que cada elemento no afecto reutilice su previo VNode y saltee el proceso "diffing" (comparar) completamente. Note que no necesitamos incluir `item.id` en la matriz de dependencia de _memo_ aquí debido a que Vue le infiere automáticamente del atributo `:key` del elemento.

  :::warning
  Cuando se utilice `v-memo` con `v-for`, asegure que sean utilizadas en el mismo elemento. **`v-memo` no funciona dentro de `v-for`.**
  :::

  `v-memo` puede también ser utilizada en componentes para manualmente detener actualizaciones no deseadas en ciertos casos extremos dónde la comprobación de actualización del componente hijo haya sido salteada. Pero, de nuevo, es la responsabilidad del desarrollador para especificar matrices correctas de dependencias para evitar saltear actualizaciones necesarias. 

- **Vea también:**
  - [v-once](#v-once)

## v-is <Badge text="deprecated" type="warning" />

Obsoleta en 3.1.0. Utilice [atributo `is` con el prefijo `vue:`](/api/special-attributes.html#is) en su lugar.
