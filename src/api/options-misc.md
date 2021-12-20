# Misceláneo

## name

- **Tipo:** `string`

- **Detalles:**

  Les permite a los componentes a invocar a sí mísmos recursivamente en sus plantillas. Note que cuando un componente es registrado globalmente con [`app.component`](/api/application-api.html#component), el ID global es establecido globalmente como su nombre.

  Otro beneficio de especificar una opción `name` es para depurar. Los componentes nombrados resultarán en mensajes de advertencias más útiles. También, al inspectar una aplicación en [vue-devtools](https://github.com/vuejs/vue-devtools), los componentes anónimos se mostrarán como `<AnonymousComponent>`, lo que no es muy útil. A través de proporcionar la opción `name`, podrá obtener un árbol de componentes con más detalles.

## inheritAttrs

- **Tipo:** `boolean`

- **Por Defecto:** `true`

- **Detalles:**

  Por defecto, las vinculaciones de atributos del alcance padre que no son reconocidos como _props_ podrán "caerse (fallthrough)". Este significa que cuando tenemos un componente de un solo raíz, estas vinculaciones serán aplicadas al elemento raíz del componente hijo como atributos HTML normales. Cuando se fabrica un componente que envolve un elemento objetivo u otro componente, este no siempre sería el comportamiento deseado. A través de establecer `inheritAttrs` como `false`, este comportamiento por defecto puede ser deshabilitado. Los atributos son disponibles mediante la propiedad de instancia `$attrs` y pueden ser vinculados explícitamente a un elemento que no es el raíz utilizando `v-bind`.

- **Uso:**

  ```js
  app.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input'],
    template: `
      <label>
        {{ label }}
        <input
          v-bind="$attrs"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
        >
      </label>
    `
  })
  ```

- **Vea también:** [Deshabilitar la herencia de atributos](../guide/component-attrs.html#disabling-attribute-inheritance)

## compilerOptions <Badge text="3.1+" />

- **Tipo:** `Object`

- **Detalles:**

  Esta es el equivalente de nivel componente de la [configuración de nivel aplicación `compilerOptions`](/api/application-config.html#compileroptions).

- **Uso:**

  ```js
  const Foo = {
    // ...
    compilerOptions: {
      delimiters: ['${', '}'],
      comments: true
    }
  }
  ```

  ::: tip Important
  Similar a la configuración de nivel aplicación `compilerOptions`, esta opción solo se respete cuando se utiliza la compilación completa con la compilación de plantillas en navegadores.
  :::

## delimiters <Badge text="deprecated" type="warning" />

Obsoleta en 3.1.0. Utilice `compilerOptions.delimiters` en su lugar.
