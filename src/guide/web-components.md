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

## Building Custom Elements with Vue

The primary benefit of custom elements is that they can be used with any framework, or even without a framework. This makes them ideal for distributing components where the end consumer may not be using the same frontend stack, or when you want to insulate the end application from the implementation details of the components it uses.

### defineCustomElement

Vue supports creating custom elements using exactly the same Vue component APIs via the [`defineCustomElement`](/api/global-api.html#definecustomelement) method. The method accepts the same argument as [`defineComponent`](/api/global-api.html#definecomponent), but instead returns a custom element constructor that extends `HTMLElement`:

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-vue-element>` tags
// on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

#### Lifecycle

- A Vue custom element will mount an internal Vue component instance inside its shadow root when the element's [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) is called for the first time.

- When the element's `disconnectedCallback` is invoked, Vue will check whether the element is detached from the document after a microtask tick.

  - If the element is still in the document, it's a move and the component instance will be preserved;

  - If the element is detached from the document, it's a removal and the component instance will be unmounted.

#### Props

- All props declared using the `props` option will be defined on the custom element as properties. Vue will automatically handle the reflection between attributes / properties where appropriate.

  - Attributes are always reflected to corresponding properties.

  - Properties with primitive values (`string`, `boolean` or `number`) are reflected as attributes.

- Vue also automatically casts props declared with `Boolean` or `Number` types into the desired type when they are set as attributes (which are always strings). For example given the following props declaration:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  And the custom element usage:

  ```html
  <my-element selected index="1"></my-element>
  ```

  In the component, `selected` will be cast to `true` (boolean) and `index` will be cast to `1` (number).

#### Events

Events emitted via `this.$emit` or setup `emit` are dispatched as native [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) on the custom element. Additional event arguments (payload) will be exposed as an array on the CustomEvent object as its `details` property.

#### Slots

Inside the component, slots can be rendered using the `<slot/>` element as usual. However when consuming the resulting element, it only accepts [native slots syntax](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Scoped slots](/guide/component-slots.html#scoped-slots) are not supported.

- When passing named slots, use the `slot` attribute instead of the `v-slot` directive:

  ```html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject

The [Provide / Inject API](/guide/component-provide-inject.html#provide-inject) and its [Composition API equivalent](/api/composition-api.html#provide-inject) also work between Vue-defined custom elements. However, note that this works **only between custom elements**. i.e. a Vue-defined custom element won't be able to inject properties provided by a non-custom-element Vue component.

### SFC as Custom Element

`defineCustomElement` also works with Vue Single File Components (SFCs). However, with the default tooling setup, the `<style>` inside the SFCs will still be extracted and merged into a single CSS file during production build. When using an SFC as a custom element, it is often desirable to inject the `<style>` tags into the custom element's shadow root instead.

The official SFC toolings support importing SFCs in "custom element mode" (requires `@vitejs/plugin-vue@^1.4.0` or `vue-loader@^16.5.0`). An SFC loaded in custom element mode inlines its `<style>` tags as strings of CSS and exposes them under the component's `styles` option. This will be picked up by `defineCustomElement` and injected into the element's shadow root when instantiated.

To opt-in to this mode, simply end your component file name with `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inlined css */"]

// convert into custom element constructor
const ExampleElement = defineCustomElement(Example)

// register
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
