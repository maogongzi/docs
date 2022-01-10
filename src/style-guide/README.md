---
sidebar: auto
---

# Guía de Estilo

Esta es la guía de estilo oficial para el código específico de Vue. Si utiliza Vue en un proyecto, es una excelente referencia para evitar errores, “bikeshedding” y antipatrones. Sin embargo, no creemos que ninguna guía de estilo sea ideal para todos los equipos o proyectos, por lo que las desviaciones conscientes se fomentan en función de la experiencia pasada, la tecnología acumulada y los valores personales.

También evitamos las sugerencias sobre JavaScript o HTML en general. No nos importa si utiliza punto y coma o comas finales. No nos importa si su HTML utiliza comillas simples o comillas dobles para los valores de los atributos. Sin embargo, algunas excepciones existirán cuando descubramos que un patrón particular es útil en el contexto de Vue.

Finalmente, hemos dividido las reglas en cuatro categorías:

## Categorías de Reglas

### Prioridad A: Esencial

Estas reglas ayudan a prevenir errores, así que apréndalas y cumpla con ellas a toda costa. Pueden existir excepciones, pero deben ser muy raras y sólo las deben realizar aquellas personas con conocimientos de JavaScript y Vue.

### Prioridad B: Muy recomendable

Se ha descubierto que estas reglas mejoran la legibilidad y/o la experiencia del desarrollador en la mayoría de los proyectos. Su código aún se ejecutará si no las respeta, pero estas excepciones deben ser raras y estar bien justificadas.

### Prioridad C: Recomendado

Donde existen opciones múltiples e igualmente buenas, se puede hacer una elección arbitraria para garantizar la coherencia. En estas reglas, describimos cada opción aceptable y sugerimos una opción predeterminada. Eso significa que puede sentirse libre de hacer una elección diferente en su propia base de código, siempre que sea coherente y tenga una buena razón para ello. Por favor, justifique su elección! Al adaptarse al estándar de la comunidad, usted:

1. Entrena su cerebro para analizar más fácilmente la mayoría del código de comunidad que encuentre
2. Será capaz de copiar y pegar la mayoría de los ejemplos de código de comunidad sin modificación
3. A menudo descubrirá que los nuevos empleados ya están amoldadas a su estilo de codificación preferido, al menos en lo que respecta a Vue

### Prioridad D: Utilizar con precaución

Algunas características de Vue existen para adaptarse a casos excepcionales o migraciones menos “agresivas” desde una base de código heredada. Sin embargo, cuando se usan en exceso, pueden hacer que su código sea más difícil de mantener o incluso convertirse en una fuente de errores. Estas reglas arrojan luz sobre las características potencialmente riesgosas, y describen cuándo y por qué deberían evitarse.

## Reglas de prioridad A: Esencial <span class="hide-from-sidebar">(prevención de errores)</span>

### Nombres de componentes de varias palabras <sup data-p="a">esencial</sup>

**Los nombres de los componentes siempre deben ser de varias palabras, a excepción de los componentes raíz de la `App` y los componentes integrados proporcionados por Vue, tales como `<transition>` or `<component>`.**

Esto [evita conflictos](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) con elementos HTML existentes y futuros, ya que todos los elementos HTML son una sola palabra.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
app.component('todo', {
  // ...
})
```

```js
export default {
  name: 'Todo',
  // ...
}
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
app.component('todo-item', {
  // ...
})
```

```js
export default {
  name: 'TodoItem',
  // ...
}
```
</div>

### Definiciones de Props <sup data-p="a">esencial</sup>

**Las definiciones de Props deben ser lo mas detalladas posible.**

En el código “commiteado”, las definiciones de props siempre deben ser lo más detalladas posible, especificando al menos su(s) tipo(s).

::: details Explicación Detallada
Las [definiciones detalladas de props](/guide/component-props.html#prop-validation) tienen dos ventajas:

- Documentan la API del componente, de modo que es fácil ver cómo se debe utilizar el componente.
- En desarrollo, Vue le advertirá si algún componente se proporciona con props formateados incorrectamente, ayudándole a detectar posibles fuentes de error.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
// Esto esta BIEN solo cuando se prototipa
props: ['status']
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
props: {
  status: String
}
```

```js
// ¡aún mejor!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```
</div>

### Key + `v-for` <sup data-p="a">esencial</sup>

**Siempre utiliza `key` con `v-for`.**

`key` con `v-for` es _siempre_ requerido en componentes, para mantener el estado del componente interno en el subárbol. Sin embargo, incluso para los elementos, es una buena práctica mantener un comportamiento predecible, como [constancia del objeto](https://bost.ocks.org/mike/constancy/) en las animaciones.

::: details Explicación Detallada
Digamos que tiene una lista de "ToDos":

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Aprender a utilizar v-for'
      },
      {
        id: 2,
        text: 'Aprender a utilizar key'
      }
    ]
  }
}
```

Luego los ordena alfabéticamente. Al actualizar el DOM, Vue optimizará la renderización para realizar las mutaciones de DOM más efectivas en lo posible. Eso podría significar eliminar el primer elemento del "ToDo" y luego agregarlo nuevamente al final de la lista.

El problema es que hay casos en los que es importante no eliminar elementos que permanecerán en el DOM. Por ejemplo, puede utilizar `<transition-group>` para animar el orden de las listas, o mantener el foco si el elemento renderizado es `<input>`. En estos casos, agregar una clave única para cada elemento (por ejemplo, `:key="todo.id"`) le indicará a Vue cómo comportarse de manera más predecible.

En nuestra experiencia, es mejor agregar _siempre_ una clave única, para que usted y su equipo simplemente nunca tengan que preocuparse por estos casos extremos. Luego, en los raros escenarios de rendimiento crítico donde la constancia del objeto no es necesaria, puede hacer una excepción consciente.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
</div>

### Evitar `v-if` con `v-for` <sup data-p="a">esencial</sup>

**Nunca utilice `v-if` en el mismo elemento que `v-for`.**

Hay dos casos comunes en los que esto puede ser tentador:

- Para filtrar elementos en una lista (por ejemplo, `v-for="user in users" v-if="user.isActive"`). En estos casos, reemplace `users` con una nueva propiedad calculada que devuelva su lista filtrada (por ejemplo `activeUsers`).

- Para evitar renderizar una lista si debe estar oculta (por ejemplo, `v-for="user in users" v-if="shouldShowUsers"`). En estos casos, mueva el `v-if` a un elemento contenedor (por ejemplo,`ul`, `ol`).

::: details Explicación Detallada
Cuando Vue procesa directivas, `v-if` tiene mayor prioridad que `v-for`, entonces esta plantilla:

```html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Arrojará un error, porque la directiva `v-if` se evaluará primero y el variable de iteración `user` no existe en este momento.

Este puede ser corregido mediante iterar sobre una propiedad computada en su lugar, como esto: 

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

```html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Alternativamente, podemos utilizar una etiqueta `<template>` con `v-for` para envolver el elemento `<li>`:

```html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```
</div>

### Alcance de Estilos de Componentes <sup data-p="a">esencial</sup>

**Para las aplicaciones, los estilos, en un componente `App` de nivel superior y en los componentes de "layout" pueden ser globales, pero todos los demás componentes siempre deben poseer sus propios alcances (be scoped).**

Esto es relevante sólo a [componentes de un solo archivo](../guide/single-file-components.html). *No* requiere que se utilice el [atributo `scoped`](https://vue-loader.vuejs.org/en/features/scoped-css.html). El "alcance" podría implementarse a través de [módulos CSS](https://vue-loader.vuejs.org/en/features/css-modules.html), una estrategia basada en clases como [BEM](http://getbem.com/), ú otra biblioteca/convención.

**Para las bibliotecas de componentes, sin embargo, se debería implementar una estrategia basada en clases en vez de usar el atributo `scoped`.**

Esto hace que sea más fácil sobreescribir los estilos internos, con nombres de clase legibles que no tienen una especificidad demasiado alta, y menos probable que generen conflictos.

::: details Explicación Detallada
Si está desarrollando un proyecto grande, trabajando con otros desarrolladores o, a veces, incluye HTML / CSS de terceros (por ejemplo, de Auth0), el alcance consistente (consistent scoping) garantizará que sus estilos solo se apliquen a los componentes para los que están diseñados.

Más allá del atributo `scoped`, el uso de nombres de clase únicos puede ayudar a garantizar que el CSS de terceros no se aplique a su propio HTML. Por ejemplo, muchos proyectos usan los nombres de las clases `button`,` btn` o `icon`, por lo que incluso si no usan una estrategia como BEM, agregan un prefijo específico de la aplicación y / o componente específico (por ejemplo,`ButtonClose-icon`) puede proporcionar cierta protección.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Utilizando el atributo `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Utilizando módulos CSS -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Utilizando la convención BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
</div>

### Nombres de propiedades privadas <sup data-p="a">esencial</sup>

**Utiliza alcance de módulo para mantener funciones privadas inaccesibles desde fuera. Si eso no es posible, siempre utilice el prefijo `$_` para propiedades privadas personalizadas en un plugin, mixin, etc. que no debería considerarse como API pública. Luego para evitar conflictos con código por otros autores, también incluya un alcance nombrado (p. ej. `$_yourPluginName_`).**

::: details Explicación Detallada
Vue utiliza el prefijo `_` para definir sus propias propiedades privadas, entonces, utilizar el mismo prefijo (ej. `_update`) puede causar que una propiedad privada sea sobreescrita. Incluso si usted verifica y Vue no esta haciendo uso de dicho nombre, no hay garantía de que este conflicto no surja en una versión futura.

En cuanto al prefijo `$`, su propósito en el ecosistema de Vue es identificar las propiedades especiales de instancia que están expuestas al usuario, por lo tanto, utilizarlo para propiedades _privadas_ no sería apropiado.

En su lugar, recomendamos combinar ambos prefijos en `$_`, como una convención para propiedades privadas definidas por el usuario para que no haya conflicto con Vue.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
const myGreatMixin = {
  // ...
  methods: {
    update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    _update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    $update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    $_update() {
      // ...
    }
  }
}
```

</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
const myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update() {
      // ...
    }
  }
}
```

```js
// ¡aún mejor!
const myGreatMixin = {
  // ...
  methods: {
    publicMethod() {
      // ...
      myPrivateFunction()
    }
  }
}

function myPrivateFunction() {
  // ...
}

export default myGreatMixin
```
</div>

## Reglas de prioridad B: Altamente Recomendadas <span class="hide-from-sidebar">(Mejorar la legibilidad)</span>

### Archivos de componentes <sup data-p="b">altamente recomendada</sup>

**Siempre que un sistema de compilación pueda concatenar archivos, cada componente debería estar en su propio archivo.**

Esto lo ayudará a usted a encontrar de una manera más rápida un componente cuando precise editarlo o verificar como se utiliza.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
</div>

### Notación de nombres de componentes de un solo archivo <sup data-p="b">altamente recomendado</sup>

**Los nombres de los [componentes de un solo archivo](../guide/single-file-component.html) deben ser siempre PascalCase o siempre kebab-case.**

El autocompletado de los editores de código funciona mejor cuando se utiliza PascalCase, ya que esta es consistente con la forma en que referenciamos componentes en JS(X) y plantillas, dónde sea posible. Sin embargo, nombres de archivos mixtos pueden crear problemas en sistemas de archivos insensibles a las mayúsculas y minúsculas, es por esto que utilizar kebab-case es perfectamente aceptable.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
</div>

### Nombre de componentes base <sup data-p="b">altamente recomendado</sup>

**Los componentes base (también conocidos como componentes de presentación, "tontos", o puros) que aplican estilos y convenciones específicas de la aplicación, deben comenzar con un prefijo específico, tal como `Base`, `App` o `V`.**

::: details Explicación Detallada
Estos componentes son la base para la definición de estilos y comportamientos consistentes en la aplicación. Estos **solamente** deben contener:

- elementos HTML,
- otros componentes base, y
- componentes de interfaz de usuario de terceros.

Pero, **nunca** deben contener estado global (p. ej. proviene de una _store_ Vuex).

Sus nombres generalmente incluyen el nombre del elemento que envuelven (por ejemplo `BaseButton`, `BaseTable`), a menos que no exista un elemento para su propósito específico (por ejemplo `BaseIcon`). Si usted construye componentes similares para un contexto más específico, casi siempre consumirán estos componentes (por ejemplo `BaseButton` podría ser consumido en `ButtonSubmit`).

Algunas ventajas de esta convención:

- Cuando están organizados alfabéticamente en los editores, los componentes base de su aplicación serán listados todos juntos, volviéndose más fácil de identificar.

- Dado que los nombres de los componentes siempre deben ser multi-palabras, esta convención impide tener que elegir un prefijo arbitrario para envoltorios de componente simples (por ejemplo `MyButton`, `VueButton`).

- Dado que estos componentes se utilizan con frecuencia, es posible que simplemente desee hacerlos globales en vez de importarlos en todos lados. Un prefijo hace esto posible con Webpack:

  ```js
  const requireComponent = require.context("./src", true, /Base[A-Z]\w+\.(vue|js)$/)
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    const baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    app.component(baseComponentName, baseComponentConfig)
  })
  ```
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
</div>

### Nombres de componentes de instancia única <sup data-p="b">altamente recomendado</sup>

**Componentes que deben tener solamente una única instancia activa deben comenzar con el prefijo `The`, para denotar que solo puede haber una.**

Esto no quiere decir que el componente solamente se utiliza en una única página, sino que solamente será utilizado una vez _por página_. Este tipo de componente nunca aceptan _props_, dado que son específicas para la aplicación, no del contexto de la misma. Si usted encuentra la necesidad de añadir _props_, puede ser un buen indicio de que de hecho se trata de un componente reusable que solamente se utiliza una vez por página, _por ahora_.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```
components/
|- Heading.vue
|- MySidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
</div>

### Nombres de componentes fuertemente acoplados <sup data-p="b">altamente recomendado</sup>

**Los componentes hijo que están fuertemente acoplados a su padre deben incluir el nombre del componente padre como prefijo.**

Si un componente solo tiene sentido en el contetxo de un componente padre, dicha relación debe ser evidente en su nombre. Dado que usualmente los editores organizan los archivos alfabéticamente, esto también deja ambos archivos cerca visualmente.

::: details Explicación Detallada
Usted puede verse tentado a resolver este problema colocando los componentes hijo en directorios nombrados como su componente padre. Por ejemplo:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

o:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Esto no es recomendado, ya que resulta en:

- Muchos archivos con nombres similares, haciendo difícil cambiar entre archivos en un editor de código.
- Muchos subdirectorios anidados, lo cual incrementa el tiempo que toma para navegar componentes en la barra lateral de un editor.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
</div>

### Orden de las palabras en el nombre de los componentes <sup data-p="b">altamente recomendado</sup>

**Los nombres de los componentes deben comenzar con la palabra de más alto nivel (muchas veces la más general) y terminar con palabras descriptivas.**

::: details Explicación Detallada
Usted se debe estar preguntando:

> "¿Por qué forzar un lenguaje menos natural al nombrar componentes?"

En inglés natural, adjetivos y otros descriptores aparecen típicamente antes de los sustantivos, mientras que excepciones requieren conectores. Por ejemplo:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Usted puede definitivamente incluir estos conectores en el nombre de los componentes si así lo desea, pero el orden de las palabras sigue siendo importante.

También observe que **lo que es considerado "de más alto nivel" será contextual a su aplicación**. Por ejemplo, imagine una aplicación con un formulario de búsqueda. Este puede incluir componentes como esto:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Como puede ver, es muy difícil ver que componentes son específicas para el formulario de búsqueda. Ahora, renombremos los componentes de acuerdo a la regla:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Ya que típicamente los editores organizan los archivos alfabéticamente, todos los componentes que se relacionan quedan evidentes por el propio nombre.

Usted puede verse tentado a resolver este problema de una forma diferente, anidando todos los componentes del formulario de búsqueda bajo un directorio llamado "search", y todos los componentes de configuración bajo otro directorio llamado "settings". Solo recomendamos este enfoque en aplicaciones de gran porte (por ejemplo, con más de 100 componentes), por las siguientes razones:

- Generalmente lleva más tiempo navegador a través de subdirectorios anidados que recorrer un simple directorio `components`.
- Conflictos de nombres (por ejemplo, múltiples componentes `ButtonDelete.vue`) dificultan la navegación rápida a un componente específico en un editor de código.
- La refactorización se vuelve más difícil, ya que buscar-y-sustituir no siempre será suficiente para actualizar las referencias relativas al componente movido.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
</div>

### Componentes con cierre automático <sup data-p="b">altamente recomendado</sup>

**Componentes sin contenido deben cerrarse automáticamenete en [componentes de un solo archivo](../guide/single-file-components.html), plantillas de cadena de caracteres, y [JSX](../guide/render-function.html#JSX) - pero nunca en plantillas del DOM.**

Los componentes que se cierran automáticamente no solo comunican que no tienen contenido, sino que **garantizan** que no deben tener contenido. Es la diferencia entre una página en blanco en un libro y una con el texto "Está página fue intencionalmente dejada en blanco". También, su código es más limpio sin la etiqueta de cerrado innecesaria.

Desafortunadamente, HTML no permite que los elementos personalizados se cierren automáticamente - sólo los [elementos sin contenidos (void) oficiales](https://www.w3.org/TR/html/syntax.html#void-elements). Es por eso que esta estrategia solo es posible cuando el compilador de plantillas de Vue pueda acceder la plantilla antes del DOM, luego sirva HTML compatible con la especifiación de DOM.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<!-- En componentes de un solo archivo, plantillas basadas en cadena de caracteres, y JSX -->
<MyComponent></MyComponent>
```

```html
<!-- en plantillas del DOM -->
<my-component/>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<!-- En componentes de un solo archivo, plantillas basadas en cadena de caracteres, y JSX -->
<MyComponent/>
```

```html
<!-- en plantillas del DOM -->
<my-component></my-component>
```
</div>

### Notación de nombres de componentes en plantillas <sup data-p="b">altamente recomendado</sup>

**En la mayoría de los proyectos, los nombres de los componentes deben ser siempre PascalCase en [componentes de un solo archivo](../guide/single-file-components.html) y plantillas basadas en cadena de caracteres - pero kebab-case en plantillas del DOM.**

PascalCase tiene algunas ventajas sobre kebab-case:

- Editores pueden autocompletar nombres de componentes en plantillas, ya que en JavaScript también se utiliza PascalCase.
- `<MyComponent>` es más distintivo visualmente que un elemento HTML de un solo palabra que `<my-component>`, porque hay dos caracteres distintos (las dos mayúsculas), en lugar de solo uno (el guión).
- Si usted utiliza elementos personalizados que no son de Vue en sus plantillas, como un componente web, PascalCase asegura que sus componentes Vue se mantendrán distinguibles visualmente.

Desafortunadamente, como HTML es insensible a las mayúsculas y minúsculas, plantillas del DOM deben utilizar kebab-case.

También tenga en cuenta que si usted ya ha invertido fuertemente en kebab-case, la consistencia con las convenciones de HTML y la posibilidad de utilizar ese mismo enfoque en todos sus proyectos puede ser más importante que las ventajas mencionadas anteriormente. En dichos casos, **utilizar kebab-case en todos lados también es aceptable.**

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<!-- En componentes de un solo archivo, plantillas basadas en cadena de caracteres -->
<mycomponent/>
```

```html
<!-- En componentes de un solo archivo, plantillas basadas en cadena de caracteres -->
<myComponent/>
```

```html
<!-- En plantillas del DOM -->
<MyComponent></MyComponent>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<!-- En componentes de un solo archivo, plantillas basadas en cadena de caracteres -->
<MyComponent/>
```

```html
<!-- En plantillas del DOM -->
<my-component></my-component>
```

OR

```html
<!-- En todos lados -->
<my-component></my-component>
```
</div>

### Notación de nombres de componentes en JS/JSX <sup data-p="b">altamente recomendado</sup>

**Los nombres de los componentes en JS/[JSX](../guide/render-function.html#jsx) siempre deben ser PascalCase, aunque pueden ser kebab-case dentro de cadenas de caracteres para aplicaciones más simples, que solo utilizan registro global de componentes a través de `app.component`.**

::: details Explicación Detallada
En JavaScript, PascalCase es la convención para clases y constructores de prototipo - esencialmente, cualquier cosa que pueda tener instancias diferentes. Los componentes de Vue también tienen instancias, así que tiene sentido utilizar PascalCase. Como un beneficio agregado, utilizar PascalCase en JSX (y plantillas) les permite a los lectores del código distinguen de una manera más fácil entre componentes y elementos HTML.

Sin embargo, para aplicaciones que **solo** utilizen definiciones globales de componentes a través de `app.component`, recomendamos utilizar kebab-case en su lugar. Las razones son las siguientes:

- Es raro que los componentes globales sean referenciados en JavaScript, entonces adoptar una convención para Javascript no tiene sentido.
- Estas aplicaciones siempre incluyen muchas plantillas del DOM donde [kebab-case **debe** ser utilizada](#component-name-casing-in-templates-strongly-recommended).
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent',
  // ...
}
```

```js
export default {
  name: 'my-component',
  // ...
}
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent',
  // ...
}
```
</div>

### Componentes con nombres completos <sup data-p="b">altamente recomendado</sup>

**Nombres de componentes deben tener palabras completas, en vez de abreviaciones.**

El autocompletado automático en los editores hace que el costo de escribir nombres largos muy bajo, mientras que la claridad que estos proveen es invaluable. En particular, las abreviaciones poco comunes debe ser evitadas.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
</div>

### Notación de nombres de props <sup data-p="b">altamente recomendado</sup>

**Los nombres de props siempre deben utilizar camelCase al declararse, pero kebab-case en plantillas y [JSX](../guide/render-function.html#jsx).**

Simplemente estamos siguiendo las convenciones de cada lenguaje. En Javascript, camelCase es más natural, mientras que HTML, kebab-case lo es.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
props: {
  'greeting-text': String
}
```

```html
<WelcomeMessage greetingText="hi"/>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
props: {
  greetingText: String
}
```

```html
<WelcomeMessage greeting-text="hi"/>
```
</div>

### Elementos con múltiples atributos <sup data-p="b">altamente recomendado</sup>

**Elementos con múltiples atributos deben ocupar múltiples líneas, con un atributo por línea.**

En Javascript, dividir objetos que poseen múltiples propiedades en varias líneas es considerado una buena práctica, porque es mucho más fácil de leer. Nuestras plantillas y [JSX](../guide/render-function.html#jsx) merecen la misma consideración.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```html
<MyComponent foo="a" bar="b" baz="c"/>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
</div>

### Expresiones simples en plantillas <sup data-p="b">altamente recomendado</sup>

**Plantillas de componentes deben incluir expresiones simples, con expresiones más complejas refactorizadas en propiedades computadas o métodos.**

Las expresiones complejas en sus plantillas los tornan menos declarativos. Debemos enfocarnos en escribir _qué_ debe aparecer, no en _cómo_ estamos computando dicho valor. También, las propiedades computadas y métodos permite que el código sea reutilizado.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<!-- En una plantilla -->
{{ normalizedFullName }}
```

```js
// La expresión compleja ha sido movida a una propiedad computada
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```
</div>

### Propiedades computadas simples <sup data-p="b">altamente recomendado</sup>

**Propiedades computadas complejas deben ser separadadas en propiedades más simples, siempre que sea posible.**

::: details Explicación Detallada
Propiedades computadas simples y bien nombradas son:

- __Fácil de probar__

  Cuando cada propiedad computada contiene solo una expresión simple, con pocas dependencias, es más fácil escribir _tests_ confirmando que esta funciona correctamente.

- __Fácil de leer__

  Simplificar las propiedades computadas le obliga a darle un nombre descriptivo a cada valor, incluso si no es reutilizado. Esto facilita a otros desarrolladores (y en el futuro, a usted) enfocarse en el código que les importa y descubrir lo que este hace.

- __Más adaptable al cambio en requirimientos__

  Cualquier valor que pueda ser nombrado puede ser útil para la vista. Por ejemplo, podemos decidir mostrar un mensaje al usuario diciendo cuanto dinero ahorró. Podemos también decidir calcular los impuestos sobre las ventas, pero quizás mostrar estos valores separados y no como parte del precio final.

  Las propiedades computadas pequeñas y enfocadas hacen menos suposiciones sobre como se utilizará la información, por lo que requieren una menor refactorización a medida que cambian los requerimientos.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```
</div>

### Comillas en los valores de los atributos <sup data-p="b">altamente recomendado</sup>

**Los valores de atributos HTML no vacíos siempre deben estar dentro de comillas (simples o dobles, la que no sea utilizada en JS).**

Si bien los valores de atributos sin espacios no requiren comillas en HTML, esta práctica usualmente conduce a _evitar_ espacios, lo que causa que los valores de los atributos sean menos legibles.

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<input type=text>
```

```html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<input type="text">
```

```html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
</div>

### Abreviación de directivas <sup data-p="b">altamente recomendado</sup>

**Las abreviación de directivas (`:` para `v-bind:`, `@` para `v-on:` and `#` para `v-slot`) deben ser utilizadas siempre o nunca.**

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```html
<template v-slot:header>
  <h1>Aquí podría ser un título de página</h1>
</template>

<template #footer>
  <p>Aquí son unas informaciones de contacto</p>
</template>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```html
<template v-slot:header>
  <h1>Aquí podría ser un título de página</h1>
</template>

<template v-slot:footer>
  <p>Aquí son unas informaciones de contacto</p>
</template>
```

```html
<template #header>
  <h1>Aquí podría ser un título de página</h1>
</template>

<template #footer>
  <p>Aquí son unas informaciones de contacto</p>
</template>
```
</div>

## Reglas de prioridad C: Recomendadas <span class="hide-from-sidebar">(Minimizando Elecciones Arbitrarias y Sobrecarga Cognitiva)</span>

### Orden de las opciones en un componente/instancia <sup data-p="c">recomendado</sup>

**Opciones de componentes/instancias deben ser ordenadas consistentemente.**

Este es el orden por defecto que recomendamos para las opciones de los componentes. Estas están separadas en categorías, así usted sabe donde agregar nuevas propiedades de _plugins_.

1. **Consciencia Global** (requiere conocimiento más allá del componente)
    - `name`

2. **Opciones del compilador de plantillas** (cambia la manera de que son compiladas las plantillas)
    - `compilerOptions`

3. **Dependencias de plantilla** (_assets_ utilizados en la plantilla)
    - `components`
    - `directives`

4. **Composición** (mezcla propiedades en las opciones)
    - `extends`
    - `mixins`
    - `provide`/`inject`

5. **Interfaz** (la interfaz del componente)
    - `inheritAttrs`
    - `props`
    - `emits`
    - `expose`

6. **API de Composición** (el punto de entrada para utilizar la API de composición)
    - `setup`

7. **Estado Local** (propiedades reactivas locales)
    - `data`
    - `computed`

8. **Eventos** (_callbacks_ disparados por eventos reactivos)
    - `watch`
    - Eventos del ciclo de vida (en el orden que son invocados)
        - `beforeCreate`
        - `created`
        - `beforeMount`
        - `mounted`
        - `beforeUpdate`
        - `updated`
        - `activated`
        - `deactivated`
        - `beforeUnmount`
        - `unmounted`
        - `errorCaptured`
        - `renderTracked`
        - `renderTriggered`

9.  **Propiedades no reactivas** (propiedades de instancia independientes del sistema de reactividad)
    - `methods`

10. **Renderización** (la descripción declarativa de la salida del componente)
    - `template`/`render`

### Orden de los atributos en un elemento <sup data-p="c">recomendado</sup>

**Los atributos de elementos (incluyendo componentes) deben ser ordenadas consistentemente.**

Este es el orden por defecto que recomendamos para las opciones de los componentes. Estas están separadas en categorías, así usted sabe donde agregar nuevos atributos y directivas.

1. **Definición** (provee las opciones del componente)
    - `is`

2. **Renderización de Listas** (crea múltiples variaciones del mismo elemento)
    - `v-for`

3. **Condicionales** (si el elemento es renderizado/mostrado o no)
    - `v-if`
    - `v-else-if`
    - `v-else`
    - `v-show`
    - `v-cloak`

4. **Modificadores de renderizado** (cambia la forma en la que el elemento se renderiza)
    - `v-pre`
    - `v-once`

5. **Consciencia Global** (requiere conocimiento más allá del componente)
    - `id`

6. **Atributos Únicos** (atributos que requieren valores únicos)
    - `ref`
    - `key`

7. **Vinculación Bidireccional** (combinación de vinculación y eventos)
    - `v-model`

8. **Otros Atributos** (todos los atributos vinculados & desvinculados no especificados)

9. **Eventos** (escuchadores de eventos de los componentes)
    - `v-on`

10. **Contenido** (sobreescribe el contenido del elemento)
    - `v-html`
    - `v-text`

### Líneas vacías en las opciones de un componente/instancia <sup data-p="c">recomendado</sup>

**Usted puede añadir una línea vacía entre propiedades que se extienden en múltiples líneas, particularmente si las opciones no entrar en la pantalla sin _scrollear_.**

Cuando un componente comienza a sentirse apretado o difícil de leer, añadir espacios entre propiedades que se extienden en múltiples líneas puede mejorar la legibilidad. En algunos editores, como Vim, opciones de formateo como esta pueden facilitar la navegación con el teclado.

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

```js
// No tener espacios también es correcto, siempre y cuando
// el componente siga siendo fácil de leer y navegar.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```
</div>

### Orden de los elementos de nivel superior de componentes de un solo archivo <sup data-p="c">recomendado</sup>

**[Componentes de un solo archivo](../guide/single-file-component.html) siempre deben ordenar las etiquetas `<script>`, `<template>`, y `<style>` consistentemente, con `<style>` por último, ya que al menos una de las otras dos siempre es necesaria.**

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
</div>

## Reglas de prioridad D: Utilizar con Precaución <span class="hide-from-sidebar">(Patrones Potencialmente Peligrosos)</span>

### Selector de elemento con `scoped` <sup data-p="d">utilizar con precaución</sup>

**Los selectores de elementos deben ser evitados con `scoped`.**

Prefiera selectores de clase sobre selectores de elementos en estilos `scoped`, ya que grandes números de selectores de elementos son lentos.

::: details Explicación Detallada
Para aplicar alcance a los estilos, Vue añade un atributo único a los elementos del componente, como `data-v-f3f3eg9`. Luego, los selectores son modificados para que solo los elementos con ese atributo sean seleccionados (por ejemplo, `button[data-v-f3f3eg9]`).

El problema es que grandes números de selectores de atributo-elemento (por ejemplo, `button[data-v-f3f3eg9]`) será considerablemente más lento que selectores atributo-clase (por ejemplo, `.btn-close[data-v-f3f3eg9]`), así que los selectores de clase deben ser utilizados siempre que sea posible.
:::

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
</div>

### Comunicación implícita entre componentes padre-hijo <sup data-p="d">utilizar con precaución</sup>

**Se debe preferir el uso de _props_ y eventos para la comunicación entre componentes padre-hijo, en lugar de `this.$parent` o mutación de _props_.**

Una aplicación Vue ideal es usada con _props_ para abajo y eventos para arriba. Apegarse a esta convención hace que sus componentes sean más fáciles de entender. Sin embargo, hay casos border donde la mutación de _props_ o el uso de `this.$parent` puede simplificar dos componentes que están fuertemente acopladas.

El problema es que también existen muchos casos _simples_ donde estos patrones pueden ofrecer conveniencia. Cuidado: no se deje seducir por la conveniencia a corto plazo (escribir menos código) sobre la simpicidad (poder entender el flujo de su estado).

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(todo => todo.id !== vm.todo.id)
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```
</div>

### Manejo de estado sin utilizar flux <sup data-p="d">utilizar con precaución</sup>

**Se debe preferir el uso de [Vuex](https://next.vuex.vuejs.org/) para el manejo del estado global, en vez de `this.$root` u un _event bus_ global.**

Manejar el estado en `this.$root` y/u utilizar un _event bus_ global puede ser conveniente para casos simples, pero no son apropiados para la mayoría de las aplicaciones.

Vuex es la [implementación oficial similar a flux](/guide/state-management.html#official-flux-like-implementation) para Vue, y ofrece no solo un lugar central para manejar estado, sino también herramientas para organizar, rastrear y depurar cambios de estado. Se integra bien en el ecosistema de Vue (incluyendo soporte completo de [Vue DevTools](/guide/installation.html#vue-devtools)).

<div class="style-example style-example-bad">
<h4>Incorrecto</h4>

```js
// main.js
import { createApp } from 'vue'
import mitt from 'mitt'
const app = createApp({
  data() {
    return {
      todos: [],
      emitter: mitt()
    }
  },

  created() {
    this.emitter.on('remove-todo', this.removeTodo)
  },

  methods: {
    removeTodo(todo) {
      const todoIdToRemove = todo.id
      this.todos = this.todos.filter(todo => todo.id !== todoIdToRemove)
    }
  }
})
```
</div>

<div class="style-example style-example-good">
<h4>Correcto</h4>

```js
// store/modules/todos.js
export default {
  state: {
    list: []
  },

  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },

  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

```html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: mapActions(['removeTodo'])
}
</script>
```
</div>

<style lang="scss" scoped>
$color-bgr-good: #d7efd7;
$color-bgr-bad: #f7e8e8;
$color-priority-a: #6b2a2a;
$color-priority-b: #8c480a;
$color-priority-c: #2b5a99;
$color-priority-d: #3f536d;

.style-example {
  border-radius: 7px;
  margin: 1.6em 0;
  padding: 1.6em 1.6em 1em;
  position: relative;
  border: 1px solid transparent;
  border-top-width: 5px;

  h4 {
    margin-top: 0;

    &::before {
      font-family: 'FontAwesome';
      margin-right: .4em;
    }
  }

  &-bad {
    background: $color-bgr-bad;
    border-color: darken($color-bgr-bad, 20%);
    
    h4 {
      color: darken($color-bgr-bad, 50%);
    }

    h4::before {
      content: '\f057';
    }
  }

  &-good {
    background: $color-bgr-good;
    border-color: darken($color-bgr-good, 20%);
    
    h4 {
      color: darken($color-bgr-good, 50%);
    }

    h4::before {
      content: '\f058';
    }
  }
}

.details summary {
  font-weight: bold !important;
}

h3 {
  a.header-anchor {
    // Ya que tenemos demasiados elementos h3 en esta página, establecemos que el
    // anclaje pueda ser siempre visible, así que puedan destacarse entre los textos del párrafo.
    opacity: 1; 
  }

  sup {
    text-transform: uppercase;
    font-size: 0.5em;
    padding: 2px 4px;
    border-radius: 3px;
    margin-left: 0.5em;

    &[data-p=a] {
      color: $color-priority-a;
      border: 1px solid $color-priority-a;
    }

    &[data-p=b] {
      color: $color-priority-b;
      border: 1px solid $color-priority-b;
    }

    &[data-p=c] {
      color: $color-priority-c;
      border: 1px solid $color-priority-c;
    }

    &[data-p=d] {
      color: $color-priority-d;
      border: 1px solid $color-priority-d;
    }
  }
}
</style>
