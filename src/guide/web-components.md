# Vue y Componentes Web

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) es un término general para un conjunto de APIs web nativos que les permite a los desarrolladores crear elementos personalizados reutilizables.

Consideramos que Vue y Componentes Web son fundamentalmente tecnologías complementarias. Vue posee soporte excelente tanto para consumir como para crear elementos personalizados. Si está integrando elementos personalizados en una aplicación Vue existente o utilizando Vue para construir y distribuir elementos personalizados, está en buena compañía.

## Utilizar elementos personalizados en Vue

Vue [obtuvo la máxima puntuación (100%) en las pruebas de Elementos Personalizados por Todas Partes(Custom Elements Everywhere)](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Consumir elementos personalizados dentro de una aplicación Vue en general funciona de la misma manera como utilizar elementos HTML nativos, con un par de cosas que deba tener en cuenta:

### Saltar la resolución de Componente

Por defecto, Vue tratará de resolver una etiqueta HTML que no es nativa como un componente Vue registrado antes de retroceder a renderizarla como un elemento personalizado. Este hará que Vue emitir una advertencia "failed to resolve component" durante el proceso de desarrollo. Para permitir a Vue a saber que ciertos elementos deberían tratarse como elementos personalizados y saltar la resolución de componente, podemos especificar la [opción `compilerOptions.isCustomElement`](/api/application-config.html#compileroptions).

Si está utilizando Vue con un paso de compilación, la opción debería ser pasado a través de las configuraciones de compilación debido a que es una opción del tiempo de compilación (compile-time).

#### Ejemplo de Configuración dentro del Navegador

```js
// Solo funciona si se utiliza compilación dentro del navegador
// si se utiliza herramientas de compilación, vea los ejemplos de configuración abajo.
app.config.compilerOptions.isCustomElement = tag => tag.includes('-')
```

#### Ejemplo de Configuración de Vite

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Considera todas etiquetas con un guión como elementos personalizados
          isCustomElement: tag => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Ejemplo de Configuración de Vue CLI

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // Considera cualquiera etiqueta que empeza con ion- como elementos personalizados
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Pasar Propiedades DOM

Ya que atributos DOM solo pueden ser cadenas de caracteres, necesitamos pasar dato complejo a elementos personalizados como propiedades DOM. Al establecer _props_ en un elemento personalizado, Vue 3 automáticamente verifica la existencia de la propiedad DOM utilizando el operador `in` y prefeirá establecer el valor como propiedad DOM si la clave está presente. Este significa que, en la mayoría de casos, no necesitará pensar de esto si el elemento personalizado siga las [mejores prácticas recomendadas](https://developers.google.com/web/fundamentals/web-components/best-practices#aim-to-keep-primitive-data-attributes-and-properties-in-sync,-reflecting-from-property-to-attribute,-and-vice-versa.).

Sin embargo, podría haber casos raros dónde el dato debe pasarse como una propiedad DOM, pero el elemento personalizado no define/refleja la propiedad adecuadamente (hace que la verificación `in` falle). En este caso, puede forzar que una vinculación `v-bind` sea establecida como una propiedad DOM utilizando el modificador `.prop`:

```html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- equivalente abreviado -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Crear Elementos Personalizados con Vue

El primario beneficio de elementos personalizados es que pueden ser utilizado junto con cualquier framework, incluso sin un framework. Este hace que sean ideales para distribuir componentes dónde el consumidor final no estaría utilizando el mismo _frontend stack_, o cuando quiere aislar la aplicación final de las detalles de implementación de los componentes que utilice.

### defineCustomElement

Vue soporta crear elementos personalizados utilizando exactamente las misma APIs de componentes Vue mediante el método [`defineCustomElement`](/api/global-api.html#definecustomelement). El método acepta los mismos argumentos como [`defineComponent`](/api/global-api.html#definecomponent), pero en su lugar retorna un constructor de elemento personalizado que extienda `HTMLElement`:

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

  // sólo para defineCustomElement: CSS será inyectado en la raíz de _shadow_
  styles: [`/* inlined css */`]
})

// Registrar el elemento personalizado.
// Después de la registración, todas etiquetas de `<my-vue-element>`
// en la página serán actualizadas.
customElements.define('my-vue-element', MyVueElement)

// Puede también programáticamente instanciar el elemento:
// (sólo puede hacerse después de la registración)
document.body.appendChild(
  new MyVueElement({
    // _props_ iniciales (opcional)
  })
)
```

#### Ciclo de Vida

- Un elemento personalizado Vue montará una instancia Vue internal dentro de su raíz de _shadow_ cuando la [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) del elemento sea llamada por la primera vez.
- Cuando la `disconnectedCallback` del elemento sea invocada, Vue verificará si el elemento sea desprendido del documento después de un tic de microtarea (microtask tick).
  - Si el elemento esté todavía en el documento, sea un movimiento y la instancia del componente se preservará;

  - Si el elemento esté desprendido del documento, sea una eliminación y la instancia del componente será desmontada.

#### _Props_

- Todas _props_ declaradas utilizando la opción `props` serán definidas en el elemento personalizado como propiedades, Vue manejará automáticamente la reflexión entre atributos / propiedades cuando proceda.

  - Atributos siempre son reflejados a propiedades correspondientes.

  - Propiedades con valores primitivos (`string`, `boolean` o `number`) son reflejadas como atributos.

- Vue también automáticamente convertirá _props_ declaradas con tipos `Boolean` o `Number` en los tipos deseados cuando son establecidas como atributos (los cuales son siempre cadenas de caracteres). Por ejemplo dado la siguiente declaración de _props_:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  Y el uso de elemento personalizado:

  ```html
  <my-element selected index="1"></my-element>
  ```

  En el componente, `selected` será convertido a `true` (boolean) y `index` será convertido a `1` (number).

#### Eventos

Los eventos emitidos mediante `this.$emit` o `emit` dentro de _setup_ son despachados como [Eventos Personalizados](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) nativos en el elemento personalizado. Adicionales argumentos del evento (payload) serán expuestos como una matriz en el objeto CustomEvent como su propiedad `details`.

#### _Slots_

Dentro del componente, _slots_ pueden renderizarse utilizando el elemento `<slot/>` como siempre. Sin embargo, cuando se consume el elemento resultante, sólo acepta [la sintaxis de slots nativos](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Scoped slots](/guide/component-slots.html#scoped-slots) no se soportan.

- Cuando se pasa _slots_ nombrados, utilice el atributo `slot` en vez de la directiva `v-slot`:

  ```html
  <my-element>
    <div slot="named">Hola</div>
  </my-element>
  ```

#### Provide / Inject

La [API de Provide / Inject](/guide/component-provide-inject.html#provide-inject) y sus [equivalentes de la API de Composición](/api/composition-api.html#provide-inject) también funcionan entre elementos personalizados definidos por Vue. Sin embargo, note que este funciona **sólo entre elementos personalizados**. es decir, un elemento personalizado definido por Vue no será capaz de inyectar propiedades proporcionadas por un componente Vue que no sea un elemento personalizado.

### SFC como Elemento Personalizado

`defineCustomElement` también funciona con Componentes de un Solo Archivo de Vue (SFCs). Sin embargo, con las herramientas establecidas por defecto, el `<style>` dentro de los SFCs todavía será extraído y fundido en un solo archivo CSS durante la compilación de producción. Cuando se utiliza un SFC como un elemento personalizado, siempre es recomendable inyectar las etiquetas `<style>` en la raíz de _shadow_ del elemento personalizado en su lugar.

Las herramientas oficiales de SFC soportan importar SFCs mediante el "modo de elemento personalizado" (requiere `@vitejs/plugin-vue@^1.4.0` o `vue-loader@^16.5.0`). Un SFC cargado mediante el modo de elemento personalizado alinea sus etiquetas de `<style>` como cadenas de caracteres de CSS y las expone bajo la opción `styles` del componente. Este será recogido por `defineCustomElement` y inyectado en la raíz de _shadow_ del elemento cuando sea instanciado.

Para escoger este modo, simplemente termina el nombre de su archivo de componente con `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* css alineado */"]

// convertirlo en un elemento personalizado
const ExampleElement = defineCustomElement(Example)

// registrar
customElements.define('my-example', ExampleElement)
```

If you wish to customize what files should be imported in custom element mode (for example treating _all_ SFCs as custom elements), you can pass the `customElement` option to the respective build plugins:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Tips for a Vue Custom Elements Library

When building custom elements with Vue, the elements will rely on Vue's runtime. There is a ~16kb baseline size cost depending on how many features are being used. This means it is not ideal to use Vue if you are shipping a single custom element - you may want to use vanilla JavaScript, [petite-vue](https://github.com/vuejs/petite-vue), or frameworks that specialize in small runtime size. However, the base size is more than justifiable if you are shipping a collection of custom elements with complex logic, as Vue will allow each component to be authored with much less code. The more elements you are shipping together, the better the trade-off.

If the custom elements will be used in an application that is also using Vue, you can choose to externalize Vue from the built bundle so that the elements will be using the same copy of Vue from the host application.

It is recommended to export the individual element constructors to give your users the flexibility to import them on-demand and register them with desired tag names. You can also export a convenience function to automatically register all elements. Here's an example entry point of a Vue custom element library:

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// export individual elements
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

If you have many components, you can also leverage build tool features such as Vite's [glob import](https://vitejs.dev/guide/features.html#glob-import) or webpack's [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) to load all components from a directory.

## Web Components vs. Vue Components

Some developers believe that framework-proprietary component models should be avoided, and that exclusively using Custom Elements makes an application "future-proof". Here we will try to explain why we believe that this is an overly simplistic take on the problem.

There is indeed a certain level of feature overlap between Custom Elements and Vue Components: they both allow us to define reusable components with data passing, event emitting, and lifecycle management. However, Web Components APIs are relatively low-level and bare-bones. To build an actual application, we need quite a few additional capabilities which the platform does not cover:

- A declarative and efficient templating system;

- A reactive state management system that facilitates cross-component logic extraction and reuse;

- A performant way to render the components on the server and hydrate them on the client (SSR), which is important for SEO and [Web Vitals metrics such as LCP](https://web.dev/vitals/). Native custom elements SSR typically involves simulating the DOM in Node.js and then serializing the mutated DOM, while Vue SSR compiles into string concatenation whenever possible, which is much more efficient.

Vue's component model is designed with these needs in mind as a coherent system.

With a competent engineering team, you could probably build the equivalent on top of native Custom Elements - but this also means you are taking on the long-term maintenance burden of an in-house framework, while losing out on the ecosystem and community benefits of a mature framework like Vue.

There are also frameworks built using Custom Elements as the basis of their component model, but they all inevitably have to introduce their proprietary solutions to the problems listed above. Using these frameworks entails buying into their technical decisions on how to solve these problems - which, despite what may be advertised, doesn't automatically insulate you from potential future churns.

There are also some areas where we find custom elements to be limiting:

- Eager slot evaluation hinders component composition. Vue's [scoped slots](/guide/component-slots.html#scoped-slots) are a powerful mechanism for component composition, which can't be supported by custom elements due to native slots' eager nature. Eager slots also mean the receiving component cannot control when or whether to render a piece of slot content.

- Shipping custom elements with shadow DOM scoped CSS today requires embedding the CSS inside JavaScript so that they can be injected into shadow roots at runtime. They also result in duplicated styles in markup in SSR scenarios. There are [platform features](https://github.com/whatwg/html/pull/4898/) being worked on in this area - but as of now they are not yet universally supported, and there are still production performance / SSR concerns to be addressed. In the meanwhile, Vue SFCs provide [CSS scoping mechanisms](/api/sfc-style.html) that support extracting the styles into plain CSS files.

Vue will always be staying up to date with the latest standards in the web platform, and we will happily leverage whatever the platform provides if it makes our job easier. However, our goal is to provide solutions that work well and work today. That means we have to incorporate new platform features with a critical mindset - and that involves filling the gaps where the standards fall short while that is still the case.
