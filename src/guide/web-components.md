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

Si quiere personalizar los archivos importados en el modo de elemento personalizado (por ejemplo, trata _todos_ SFCs como elementos personalizados), puede pasar la opción `customElement` a los plugins respectivos de compilación:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Consejos para una librería de elementos personalizados de Vue

Cuando se crea elementos personalizados con Vue, los elementos dependerán del _runtime_ de Vue. Hay una costa de tamaño básico de ~16kb, dependiente de cuántos características son utilizadas. Este significa que no es ideal utilizar Vue si está ofreciendo un solo elemento personalizado, es posible que desee utilizar JavaScript puro (vanilla), [petite-vue](https://github.com/vuejs/petite-vue), o frameworks que se caracteriza en pequeño tamaño de _runtime_. Sin embargo, el tamaño básico es más que justifiable si está ofreciendo un conjunto de elementos personalizados con lógica compleja, debido a que Vue le permitirá a cada componente que sea fabricado con mucho menos código. Mientras más elementos está ofreciendo juntos, mejor será el equilibrio.


Si los elementos personalizados serán utilizados en una aplicación que también utiliza Vue, podría exteriorizar Vue de la compilación para que los elementos utilicen el mismo fuente de Vue de la aplicación de origen (host application).

Es recomendado exportar los constructors individuales de elementos para darles a sus usuarios la flexibilidad para importarlos a petición y registrarlos con nombres deseados de etiquetas. Puede también exportar una función de conveniencia para automáticamente registrar todos los elementos. Aquí es un ejemplo de punto de entrada de una librería de elementos personalizados de Vue.

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// exportar elementos individuales
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Si tiene muchos componentes, puede también acudir a las características de herramientas de compilación como el [importar globalmente](https://vitejs.dev/guide/features.html#glob-import) de Vite o el [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) de webpack para cargar todos componentes de una carpeta.

## Componentes Web versus Componentes Vue

Algunos desarrolladores piensan que los modelos de componentes vinculados a cada framework deben ser evitados, y que utilizar exclusivamente elementos personalizados hace que una aplicación sea adaptable para el futuro ("future-proof"). Aquí trataremos de explicar porque creemos que este es demasiado simplista sobre el problema.

Hay de verdad un nivel cierto de superposición entre elementos personalizados y componentes Vue: ambos nos permiten definir componentes reutilizables con el paso de dato, la emisión de eventos, y el manejamiento de ciclo de vida. Sin embargo, las APIs de Componentes Web son relativamente de nivel bajo y muy limitado. Para construir una aplicación real, necesitamos un buen número de capacidades adicionales de los que la plataforma no abarca:

- Un sistema declarativa y eficiente de plantillas;

- Un sistema reactivo de manejamiento de estados que facilitar la extracción de lógica y reutilización entre componentes;

- Una eficiente manera para renderizar los componentes en el servidor y hidratarlos en el cliente (SSR), lo cual es imporante para SEO y [métrica vitales web como LCP](https://web.dev/vitals/). El SSR nativo de elementos personalizados típicamente involucra simular el DOM en Node.js y luego serializar el DOM mutado, mientras el SSR Vue compila a concatenación de cadena de caracteres siempre que sea posible, lo que es mucho más eficiente.

El modelo de componentes de Vue es diseñado con estos necesidades en consideración como un sistema coherente.

Con un equipo de ingeniería competente, podría probablemente construir el equivalente sobre los elementos personalizados nativos, pero esto también significa que está asumiendo la carga de mantenimiento de largo plazo de un framework de uso interno, mientras perdiendo los beneficios de la ecosistema y comunidad de un framework maturo como Vue.

Hay también frameworks construidos utilizando elementos personalizados como los básicos de su modelo de componente, pero todos de ellos deben inevitablemente introducir sus propios soluciones para los problemas enumerados arriba. Utilizar estos frameworks implica seguir sus decisiones técnicas sobre cómo resolver estos problemas, lo cual, pese a las publicidades, no va a aislarse automáticamente de las agitaciones potenciales del futuro.

Hay también algunos campos dónode nos encontramos que los elementos personalizados son limitados:

- La evaluación impaciente impide la composición de componentes. Los [_scoped slots_](/guide/component-slots.html#scoped-slots) de Vue son poderosos mecanismos para la composición de componentes, lo que no se puede soportar mediante elementos personalizados debido a la naturaleza impaciente de los slots nativos. Slots impacientes también significa que el componente que reciba el contenido del slot no pueda controlar el tiempo y lugar para renderizar una pieza del contenido recibido.

- Actualmente, ofrecer elementos personalizados con CSS dentro del alcance de DOM de _shadow_ (shadow DOM scoped CSS) requiere incrustar el CSS dentro de JavaScript de modo que pueda ser inyectado en las raíces de _shadow_ en el tiempo de ejecución. También resulta en estilos duplicados en el etiquetado en escenarios de SSR. Hay [características de plataformas](https://github.com/whatwg/html/pull/4898/) en progreso sobre este campo, pero para ahora no son soportados universalmente, y todavía hay preocupaciones sobre rendimiento de producción y SSR para abordarse. Mientras en tanto, los SFCs Vue proporciona [mecanismos de alcance de CSS (CSS scoping mechanisms)](/api/sfc-style.html) que soporte extraer los estilos en archivos CSS planos.

Vue siempre va a mantenerse al día con las últimas normas en la plataforma web, y aplancaremos con alegría cualquiera cosa que proporcione la plataforma si vaya a hacer nuestro trabajo más fácil. Sin embargo, nuestro gol es proporcionar soluciones que funcionen bien y ahora en este momento. Eso significa que tenemos que incorporar nuevas características de las plataformas con una mentalidad crítica, y eso involucra colmar las lagunas dónde las normas quedan cortos mientras que todavía necesitemos.
