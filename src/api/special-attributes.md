# Atributos Especiales

## key

- **Espera:** `number | string | symbol`

  El atributo especial `key` es utilizado principalmente como una pista para el algoritmo del DOM virtual de Vue para identificar VNodes cuando se compara nuevas listas de nodos contra listas antiguas. Sin claves, Vue utiliza un algoritmo que minimiza el movimiento de elementos e intenta parchar/reutilizar elementos del mismo tipo in situ lo más posible. Con claves, este reordenará elementos basado en el orden de cambio de las claves, y los elementos con claves que ya no estén presentes, siempre serán removidos/destruidos.

  Hijos de un mismo padre en común siempre deben tener **claves únicas**. Claves duplicadas causarán errores de renderización.

  El caso de uso más común es combinado con `v-for`:

  ```html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  También puede ser utilizado para forzar el reemplazo de un elemento/componente en vez de reutilizar el mismo. Esto puede ser útil cuando usted desee:

  - Lanzar apropiadamente _hooks_ de ciclo de vida de un componente
  - Lanzar transiciones

  Por ejemplo:

  ```html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Cuando `text` cambie, el `<span>` siempre será reemplazado en vez de parchado, por lo cual, una transición será lanzada.

## ref

- **Espera:** `string | Function`

  `ref` es utilizado para registrar una referencia a un elemento o a un componente hijo. La referencia será registrada bajo el objeto `$refs` del componente padre. Si se utiliza en un elemento DOM plano, la referencia será a dicho elemento; si se utiliza en un componente hijo, la referencia será a la instancia de dicha componente:

  ```html
  <!-- vm.$refs.p será el nodo DOM -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child será la intancia del componente hijo -->
  <child-component ref="child"></child-component>

  <!-- Cuando se vincule dinámicamente, podemos definir ref como una función callback, pasando el elemento o la instancia de componente explícitamente -->
  <child-component :ref="(el) => child = el"></child-component>
  ```

  Una nota importante sobre el tiempo de registro de _ref_: dado que las _refs_ mismas son creadas como resultado de la función de renderización, usted no puede acceder a las mismas en la renderización inicial - estas no existen todavía! También, `refs` no es reactivo, por lo tanto, no intente utilizarlo en plantillas para vinculaciones de datos (_data-binding_).

- **Vea también:** [Referencias a Componentes Hijos](../guide/component-template-refs.html)

## is

- **Espera:** `string | Object (el objeto de opciones de un componente)`

  Utilizado para [componente dinámicos](../guide/component-dynamic-async.html).

  Por ejemplo:

  ```html
  <!-- el componente cambia cuando currentView cambie -->
  <component :is="currentView"></component>
  ```

- **Uso en elementos nativos** <Badge text="3.1+" />

  Cuando se utilice el atributo `is` en un elemento HTML nativo, será interpretado como un [elemento integrado personalizado](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), lo que es una característica nativa de la plataforma web.

  Hay, sin embargo, un caso de usuario dónde necesitaría que Vue reemplace un elemento nativo con un componente Vue, como se ha explicado en [advertencias de analísis de plantillas DOM](/guide/component-basics.html#dom-template-parsing-caveats). Puede prefijar el valor del atributo `is` con `vue:`, así que Vue renderizará el elemento como un componente Vue en su lugar:

  ```html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **Vea también:**
  - [Components Dinámicos](../guide/component-dynamic-async.html)
  - [RFC que explica los cambios desde Vue 2](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0027-custom-elements-interop.md#customized-built-in-elements)
