# API de Aplicación

En Vue 3, las APIs que mutan globalmente el comportamiento de Vue son ahora movidos a la instancia de aplicación creada por el nuevo método `createApp`. Además, sus efectos son ahora limitados a la instancia de esa aplicación específica.

```js
import { createApp } from 'vue'

const app = createApp({})
```

La invocación de `createApp` retorna una instancia de aplicación. Esta instancia proporciona un contexto de aplicación. El árbol completo de componentes montado por la instancia de aplicación comparte el mismo contexto, lo cual proporciona las configuraciones que antes fueron "global" en Vue 2.x.

Además, debido a que el método `createApp` retorna la instancia de aplicación misma, puede encadenar otros métodos después de el, los cuales se pueden encontrar en las secciones siguientes.

## component

- **Argumentos:**

  - `{string} name`
  - `{Function | Object} definition (opcional)`

- **Retorna:**

  - La instancia de la aplicación si un argumento `definition` fue pasado
  - La definición del componente si un argumento `definition` no fue pasado

- **Uso:**

  Registrar o recuperar un componente global. La registración también automáticamente establece la `name` del componente con el parámetro `name` dado.

- **Ejemplo:**

```js
import { createApp } from 'vue'

const app = createApp({})

// registrar un objeto de opciones
app.component('my-component', {
  /* ... */
})

// recuperar un componente registrado
const MyComponent = app.component('my-component')
```

- **Vea también:** [Básicos de Componentes](../guide/component-basics.html)

## config

- **Uso:**

Un objeto que contiene las configuraciones de la aplicación.

- **Ejemplo:**

```js
import { createApp } from 'vue'
const app = createApp({})

app.config = {...}
```

- **Vea también:** [Configuración de Aplicación](./application-config.html)

## directive

- **Argumentos:**

  - `{string} name`
  - `{Function | Object} definition (opcional)`

- **Retorna:**

  - La instancia de aplicación si un argumento `definition` fue pasado
  - La definición de la directiva si un argumento `definition` no fue pasado

- **Uso:**

  Registrar o recuperar una directiva global.

- **Ejemplo:**

```js
import { createApp } from 'vue'
const app = createApp({})

// registrar
app.directive('my-directive', {
  // Las directivas tienen un conjunto de hooks de ciclo de vida:
  // llamado antes de que se apliquen los atributos o escuchadores de evento del elemento vinculado
  created() {},
  // llamado antes de que se monte el componente padre del elemento vinculado
  beforeMount() {},
  // llamado cuando se monte el componente padre del elemento vinculado
  mounted() {},
  // llamado antes de que se actualice el VNode del componente que contenga el elemento
  beforeUpdate() {},
  // llamado después de que se hayan actualizado el VNode del componente que contenga el elemento y los VNodes de hijos de de dicho componente
  updated() {},
  // llamado antes de que se desmonte el componente padre del elemento vinculado
  beforeUnmount() {},
  // llamado cuando se desmonte el componente padre del elemento vinculado
  unmounted() {}
})

// registrar (directiva funcional)
app.directive('my-directive', () => {
  // este será llamado como `mounted` y `updated`
})

// captador, retorna la definición de la directiva si está registrada
const myDirective = app.directive('my-directive')
```

Se pasan estos argumentos a los _hooks_ de directiva:

#### el

El elemento al que está vinculada la directiva. Este puede ser utilizado para manipular el DOM directamente.

#### binding

On objeto que contiene las propiedades siguientes.

- `instance`: la instancia del componente dónde la directiva está utilizada.
- `value`: El valor pasado a la directiva. Por ejemplo en `v-my-directive="1 + 1"`, el valor sería `2`.
- `oldValue`: El valor anterior, solo disponible en `beforeUpdate` y `updated`. Es disponible sea o no que el valor haya cambiado.
- `arg`: El argumento pasado a la directiva, si hay. Por ejemplo en `v-my-directive:foo`, el argumento sería `"foo"`.
- `modifiers`: Un objeto que contiene modificadores, si hay. Por ejemplo en `v-my-directive.foo.bar`, el objeto de modificadores sería `{ foo: true, bar: true }`.
- `dir`: un objeto, pasado como un parámetro cuando la directiva esté registrada. Por ejemplo, en la directiva

```js
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

`dir` sería el objeto siguiente:

```js
{
  mounted(el) {
    el.focus()
  }
}
```

#### vnode

Un plan del elemento DOM real recibido como un argumento arriba.

#### prevNode

El nodo virtual anterior, solo disponible en los _hooks_ `beforeUpdate` y `updated`.

:::tip Note
Aparte de `el`, debería tratar estos argumentos como de solo lectura y nunca modificarlos. Si necesita compartir información a través de _hooks_, es recomendado hacerlo mediante [_dataset_](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) del elemento.
:::

- **Vea también:** [Directivas Personalizadas](../guide/custom-directive.html)

## mixin

- **Argumentos:**

  - `{Object} mixin`

- **Retorna:**

  - La instancia de aplicación

- **Uso:**

  Aplicar un _mixin_ en el alcance entero de la aplicación. Una vez registrado se pueden utilizar en la plantilla de cualquier componente dentro de la aplicación corriente. Este puede ser utilizado por los autores de _plugins_ para inyectar comportamientos personalizados en componentes. **No es recomendado en el código de aplicación**.

- **Vea también:** [Mixin Global](../guide/mixins.html#global-mixin)

## mount

- **Argumentos:**

  - `{Element | string} rootContainer`
  - `{boolean} isHydrate (opcional)`

- **Retorna:**

  - La instancia del componente raíz

- **Uso:**

  El `innerHTML` del elemento DOM proporcionado será reemplazado con la plantilla renderizada del componente raíz de la aplicación.

- **Ejemplo:**

```html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// Hacer algo de preparación necesario
app.mount('#my-app')
```

- **Vea también:**
  - [Lifecycle Diagram](../guide/instance.html#lifecycle-diagram)

## provide

- **Argumentos:**

  - `{string | Symbol} key`
  - `value`

- **Retorna:**

  - La instancia de la aplicación

- **Uso:**

  Establece un valor que pueda ser inyectado en todos componentes dentro de la aplicación. Los componentes deben utilizar `inject` para recibir los valores proporcionados.

  Desde una perspectiva de `provide`/`inject`, la aplicación puede ser tratado como el ancestro de nivel raíz, con el componente raíz como su único hijo.

  Este método no se debe confundir con la [opción de componente _provide_](options-composition.html#provide-inject) o la [función _provide_](composition-api.html#provide-inject) en la API de composición. Mientras estos son también un parte del mismo mecanismo de `provide`/`inject`, son utilizados para configurar valores proporcionados por un componente en vez de una aplicación.

  Proporcionar valores mediante la aplicación es específicamente útil cuando escribir _plugins_, como los _plugins_ típicamente no serían capaz de proporcionar valores utilizando componentes. Es una alternativa para utilizar [globalProperties](application-config.html#globalproperties).

  :::tip Note
  Las vinculaciones de `provide` y `inject` NO so reactivas. Este es a propósito. Sin embargo, si pasa un objeto observado abajo, las propiedades en ese objeto se mantienen reactivas.
  :::

- **Ejemplo:**

  Inyectar una propiedad en el componente raíz, con un valor proporcionado por la aplicación:

```js
import { createApp } from 'vue'

const app = createApp({
  inject: ['user'],
  template: `
    <div>
      {{ user }}
    </div>
  `
})

app.provide('user', 'administrator')
```

- **Vea también:**
  - [Provide / Inject](../guide/component-provide-inject.md)

## unmount

- **Uso:**

  Desmonta un componente raíz de la instancia de aplicación.

- **Ejemplo:**

```html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// Hacer algo de preparación necesario
app.mount('#my-app')

// La aplicación será desmontada 5 segundos después de montarse
setTimeout(() => app.unmount(), 5000)
```

## use

- **Argumentos:**

  - `{Object | Function} plugin`
  - `...options (opcional)`

- **Retorna:**

  - La instancia de aplicación

- **Uso:**

  Instalar un _plugin_ de Vue.js. Si el plugin es un objeto, debe exponer un método `install`, si es una función de sí mismo, será tratado como el método `install`.

  El método `install` será llamado con la aplicación como su primer argumento. Cualquier `options` pasado a `use` será pasado como argumentos posteriores a `install`.

  Cuando este método es llamado en el mismo _plugin_ múltiples veces, el _plugin_ solo se instala una vez.

- **Ejemplo:**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({})

  app.use(MyPlugin)
  app.mount('#app')
  ```

- **Vea también:** [Plugins](../guide/plugins.html)

## version

- **Uso:**

  Proporciona el vesión de Vue instalado como una cadena de caracteres. Este es específicamente útil para [plugins](/guide/plugins.html) de la comunidad, dónde utilizaría estrategias diferentes para versiones distintos.

- **Ejemplo:**

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])

      if (version < 3) {
        console.warn('Este plugin requiere Vue 3')
      }

      // ...
    }
  }
  ```

- **See also**: [Global API - version](/api/global-api.html#version)
