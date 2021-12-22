# Propiedades de Instancias

## $data

- **Tipo:** `Object`

- **Detalles:**

  El objeto de dato a que la instancia de componente está observando. La instancia de componente delega acceso a las propiedades en su objeto de dato.

- **Vea también:** [Opciones / Dato - _data_](./options-data.html#data-2)

## $props

- **Tipo:** `Object`

- **Detalles:**

  Un objeto representa las _props_ corrientes que un componente ha recibido. La instancia de componente delega acceso a las propiedades en su objeto de _props_.

## $el

- **Tipo:** `any`

- **Solo de lectura**

- **Detalles:**

  El elemento DOM raíz que la instancia de componente está gestionando.

  Para componentes que utilizan [fragments](../guide/migration/fragments), `$el` será el nodo DOM de marcador de posición que Vue utilice para mantener un seguimiento del posición del componente dentro del DOM. Es recomendado utilizar [_refs_ de plantillas](../guide/component-template-refs.html) para accesar directamente a los elementos DOM en vez de dependerse de `$el`.

## $options

- **Tipo:** `Object`

- **Solo de lectura**

- **Detalles:**

  Las opciones de instanciación utilizadas para la instancia corriente de componente. Esta es útil cuando quiere incluir propiedades personalizadas en las opciones:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

## $parent

- **Tipo:** `Component instance`

- **Solo de lectura**

- **Detalles:**

  La instancia padre, si la instancia corriente tienen una.

## $root

- **Tipo:** `Component instance`

- **Solo de lectura**

- **Detalles:**

  La instancia raíz de componente del árbol corriente de componente. Si la instancia corriente no tiene padres este valor va a ser sí mísmo.

## $slots

- **Tipo:** `{ [name: string]: (...args: any[]) => Array<VNode> | undefined }`

- **Solo de lectura**

- **Detalles:**

  Utilizada para programáticamente acceder contenidos [distribuidos por _slots_](../guide/component-basics.html#content-distribution-with-slots). Cada [_slot_ nombrado](../guide/component-slots.html#named-slots) tiene su propiedad correspondiente (p. ej. los contenidos de `v-slot:foo` se encontrarán en `this.$slots.foo()`). La propiedad `default` contiene nodos no incluidos en un slot nombrado o contenidos de `v-slot:default`.

  Acceder `this.$slots` es más útil cuando escribir un componente con una [función _render_](../guide/render-function.html).

- **Ejemplo:**

  ```html
  <blog-post>
    <template v-slot:header>
      <h1>Sobre Mí</h1>
    </template>

    <template v-slot:default>
      <p>
        Aquí se encontra cierto contenido de la página, lo que será incluido en $slots.default.
      </p>
    </template>

    <template v-slot:footer>
      <p>Copyright 2020 Evan You</p>
    </template>
  </blog-post>
  ```

  ```js
  const { createApp, h } = Vue
  const app = createApp({})

  app.component('blog-post', {
    render() {
      return h('div', [
        h('header', this.$slots.header()),
        h('main', this.$slots.default()),
        h('footer', this.$slots.footer())
      ])
    }
  })
  ```

- **Vea también:**
  - [El componente `<slot>`](built-in-components.html#slot)
  - [Distribución de Contenido con _Slots_](../guide/component-basics.html#content-distribution-with-slots)
  - [Funciones de _Render_ - _Slots_](../guide/render-function.html#slots)

## $refs

- **Tipo:** `Object`

- **Solo de lectura**

- **Detalles:**

Un objeto de elementos DOM y instancias de componente, registrado con [atributos `ref`](../guide/component-template-refs.html).

- **Vea también:**
  - [_refs_ de plantillas](../guide/component-template-refs.html)
  - [Atributos Especiales - _ref_](./special-attributes.md#ref)

## $attrs

- **Tipo:** `Object`

- **Solo de lectura**

- **Detalles:**

Contiene vinculaciones de atributos del alcance padre y eventos qe no son reconocidos (y extraídos) como [_props_](./options-data.html#props) de componente o [eventos personalizados](./options-data.html#emits). Cuando un componente no tiene ningunas _props_ declaradas u eventos personalizados, este escencialmente contiene todas las vinculaciones del alcance padre, y puede pasarse a un comonente interior mediante `v-bind="$attrs"`, es útil cuando se creen componentes de orden superior (higher-order components).

- **Vea también:**
  - [Atributos que no son _props_](../guide/component-attrs.html)
  - [Opciones / Misceláneo - inheritAttrs](./options-misc.html#inheritattrs)
