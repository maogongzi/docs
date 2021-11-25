# Básicos de Componentes

<VideoLesson href="https://vueschool.io/courses/vue-js-3-components-fundamentals?friend=vuejs" title="Curso gratis de componentes de Vue.js">Aprender los básicos de componentes con un curso gratis en Vue School</VideoLesson>

## Ejemplo básico

Aquí es un ejemplo de un componente Vue:

```js
// Crear una aplicación Vue
const app = Vue.createApp({})

// Definir un nuevo componente global llamado button-counter
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Me ha hecho clics de {{ count }} veces.
    </button>`
})
```

::: info
Le estámos mostrando un ejemplo sencillo aquí, pero en una aplicación Vue típica utilizamos componentes de un solo archivo (Single File Components) en vez de una plantilla de cadena de caracteres. Puede consultar más información sobre los [en esta sección](single-file-component.html).
:::

Los componentes son instancias reutilizables de Vue con un nombre: en este caso, `<button-counter>`. Podemos utilizar este componente como un elemento personalizado dentro de una instancia raíz:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
app.mount('#components-demo')
```

<common-codepen-snippet title="Básicos de componentes" slug="abORVEJ" tab="js,result" :preview="false" />

Dado que los componentes son instancias reutilizables, aceptan las mismas opciones de una instancia raíz, como `data`, `computed`, `watch`, `methods`, y _hooks_ de ciclo de vida.

## Reutilizar Componentes

Los componentes se pueden reutilizar tantas veces como se desee:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<common-codepen-snippet title="Básicos de componentes: reutilizar componentes" slug="rNVqYvM" tab="result" :preview="false" />

Tenga en cuenta que al hacer clic en los botones, cada uno mantiene su propio `count` por separado. Esto se debe a que cada vez que utiliza un componente, se crea una nueva **instancia** de sí mismo.

## Organización de Componentes

Es común que una aplicación se organice en un árbol de componentes anidados:

![Árbol de Componente](/images/components.png)

Por ejemplo, puede tener componentes para un encabezado, una barra lateral y un área de contenido, cada uno de los cuales generalmente contiene otros componentes para enlaces de navegación, publicaciones de blog, etc.

Para utilizar estos componentes en plantillas, deben registrarse para que Vue los conozca. Existen dos tipos de registro de componentes: **global** y **local**. Hasta ahora, solo hemos registrado componentes globalmente, utilizando el método `component` de nuestra aplicación:

```js
const app = Vue.createApp({})

app.component('my-component-name', {
  // ... opciones ...
})
```

Los componentes registrados globalmente se pueden utilizar en la plantilla de cualquier componente dentro de la aplicación.

Eso es todo lo que necesita saber sobre el registro por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [Registro de Componentes](component-registration.md).

## Pasar datos a componentes secundarios con _Props_

Anteriormente, mencionamos la creación de un componente para publicaciones de blog. El problema es que ese componente no será útil a menos que pueda pasarle datos, como el título y el contenido de la publicación específica que queremos mostrar. Ahí es donde entran las _props_.

Las _props_ son atributos personalizados que puede registrar en un componente. Para pasar un título a nuestro componente de publicación de blog, podemos incluirlo en la lista de _props_ que este componente acepta, usando la opción `props`:

```js
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```
Cuando se pasa un valor a un atributo _prop_, se convierte en una propiedad en esa instancia de componente. El valor de la propiedad es accesible dentro de la plantilla, justo como cualquiera otra propiedad del componente.

Un componente puede tener tantas _props_ como se desee, por defecto, se puede pasar cualquier valor a cualquiera _prop_.

Una vez que se registra un _prop_, puede pasarle datos como un atributo personalizado, de la siguiente manera:

```html
<div id="blog-post-demo" class="demo">
  <blog-post title="Mi viaje con Vue"></blog-post>
  <blog-post title="Blogging con Vue"></blog-post>
  <blog-post title="¿Por qué Vue es tan divertido?"></blog-post>
</div>
```

<common-codepen-snippet title="Básicos de componentes: pasar props" slug="PoqyOaX" tab="result" :preview="false" />

En una aplicación típica, sin embargo, es probable que tenga una matriz de publicaciones en `data`:

```js
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'Mi viaje con Vue' },
        { id: 2, title: 'Blogging con Vue' },
        { id: 3, title: '¿Por qué Vue es tan divertido?' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

Entonces querría renderizar un componente para cada una:

```html
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

Arriba, verá que podemos utilizar `v-bind` para pasar _props_ dinámicamente. Esto es especialmente útil cuando no se conoce el contenido exacto que se va a renderizar con anticipación.

Esto es todo lo que necesita saber sobre _props_ por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [_Props_](component-props.html).

## Escuchar a eventos de componentes secundarios

A medida que desarrollamos nuestro componente `<blog-post>`, es posible que algunas funciones requieran la comunicación hacia el componente padre. Por ejemplo, podemos decidir incluir una característica de accesibilidad para ampliar el texto de las publicaciones del blog, dejando el resto de la página en su tamaño por defecto:

En el padre, podemos soportar esta característica agregando una propiedad `postFontSize` en `data`:

```js
const App = {
  data() {
    return {
      posts: [
        /* ... */
      ],
      postFontSize: 1
    }
  }
}
```

Esta propiedad puede ser utilizado en la plantilla para controlar el tamaño de la fuente de todas las publicaciones del blog:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
    ></blog-post>
  </div>
</div>
```

Ahora agreguemos un botón para ampliar el texto justo antes del contenido de cada publicación:

```js
app.component('blog-post', {
  props: ['title'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button>
        Agrandar texto
      </button>
    </div>
  `
})
```

El problema es que este botón no hace nada:

```html
<button>
   Agrandar texto
</button>
```

Cuando hacemos clic en el botón, debemos comunicar al componente padre que debe agrandar el texto de todas las publicaciones. Para resolver este problema, las instancias componentes proporcionan una sistema de eventos personalizados. El padre puede optar por escuchar a cualquier evento de la instancia del componente secundario con `v-on` o `@`, justo como lo que haríamos con un evento nativo de DOM:

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

Entonces, el componente secundario puede emitir un evento en sí mismo mediante llamar el método integrado [**`$emit`**](../api/instance-methods.html#emit) pasando el nombre del evento:

```html
<button @click="$emit('enlargeText')">
  Enlarge text
</button>
```

Gracias al escuchador `@enlarge-text="postFontSize += 0.1"`, el padre recibirá el evento y actualizará el valor de `postFontSize`.

<common-codepen-snippet title="Básicos de componentes: emitir eventos" slug="KKpGyrp" tab="result" :preview="false" />

Podemos enumerar eventos emitidos en la opción `emits` del componente:

```js
app.component('blog-post', {
  props: ['title'],
  emits: ['enlargeText']
})
```

Esto le permite probar todos los eventos emitidos por un componente y opcionalmente [validarlos](component-custom-events.html#validate-emitted-events).

### Emitir un valor con un Evento

A veces es útil emitir un valor específico con un evento. Por ejemplo, podemos querer que el componente `<blog-post>` se encargue de cuánto agrandar el texto. En esos casos, podemos usar el segundo parámetro de `$emit` para proporcionar este valor:

```html
<button @click="$emit('enlargeText', 0.1)">
  Agrandar texto
</button>
```

Luego, cuando escuchamos el evento en el padre, podemos acceder al valor del evento emitido con `$event`:

```html
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

O, si el manejador de evento es un método:

```html
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

Entonces el valor se pasará como el primer parámetro de ese método:

```js
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Utilizar `v-model` en Componentes

Los eventos personalizados también se pueden utilizar para crear entradas personalizadas que funcionan con `v-model`. Recuerde que:

```html
<input v-model="searchText" />
```

hace lo mismo que:

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

Cuando se utiliza en un componente, `v-model` en su lugar hace esto:

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

::: warning
Tenga en cuenta que utilizamos `model-value` con _kebab-case_ aquí porque estámos trabajando con plantillas en DOM. Puede encontrarse una explicación detallada sobre _kebab-case_ y _camelCase_ en la sección [Casos especiales de análisis de plantillas DOM](#dom-template-parsing-caveats)
:::

Para que esto realmente funcione, el `<input>` dentro del componente debe:

- Enlazar el atributo `value` a la _prop_ `modelValue`
- En el `input`, emitir un evento `update:modelValue` con el nuevo valor

Aquí está lo que en acción:

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

Ahora `v-model` debería funcionar perfectamente con este componente:

```html
<custom-input v-model="searchText"></custom-input>
```

Otra manera de implementar `v-model` dentro de este componente es utilizar la capacidad de las propiedades de `computed` para definir un cargador y establecedor. El método `get` debería retornar la propiedad `modelValue` y el método `set` debería emitir el evento correspondiente:

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

Eso es todo que necesita saber sobre eventos personalizados de componentes por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [Eventos Personalizados](component-custom-events.md).

## Distribución de contenido con Slots

Al igual que con los elementos HTML, a menudo es útil poder pasar contenido a un componente, como este:

```html
<alert-box>
  Algo salió mal.
</alert-box>
```

Lo que podría renderizar algo como:

<common-codepen-snippet title="Básicos de componentes: slots" slug="jOPeaob" :preview="false" />

Esto se puede lograr mediante el elemento personalizado de Vue `<slot>`:

```js
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

Como verá arriba, utilizamos el `<slot>` como un marcador de posición donde queramos poner el contenido - y eso es todo. ¡Hemos terminado!

Eso es todo lo que necesita saber acerca de _slots_ por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos que regrese más tarde para leer la guía completa de [Slots](component-slots.md).

## Componentes dinámicos

A veces, es útil cambiar dinámicamente entre componentes, como en una interfaz con pestañas:

<common-codepen-snippet title="Básicos de componentes: componentes dinámicos" slug="oNXaoKy" :preview="false" />

Lo anterior es posible gracias al elemento `<component>` de Vue con el atributo especial `is`:

```html
<!-- El componente cambia cuando currentTabComponent cambia -->
<component :is="currentTabComponent"></component>
```

En el ejemplo anterior, `currentTabComponent` puede contener:

- el nombre de un componente registrado, o
- un objeto de opciones de un componente

Vea [esta caja de arena](https://codepen.io/team/Vue/pen/oNXaoKy) para experimentar con el código completo, o [esta versión](https://codepen.io/team/Vue/pen/oNXapXM) para un ejemplo de vinculación al objeto de opciones de un componente, en lugar de su nombre registrado.

Puede también utilizar el atributo `is` para crear elementos HTML regulares.

Eso es todo lo que necesita saber sobre los componentes dinámicos por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa sobre [Componentes Dinámicos y Asíncronos](./component-dynamic-async.html).

## Casos especiales de análisis de plantillas DOM

Si está escribiendo sus plantillas Vue directamente en DOM, Vue tendrá que recuperar la cadena de caracteres de plantilla desde el DOM. Esto conduce a algunos casos especiales debido a los comportamientos nativos de análisis de HTML de los navegadores.

:::tip
Debería tenerse en cuenta que las limitaciones debatidos abajo solo aplican si está escribiendo sus plantillas directamente en DOM. No aplican si está utilizando plantillas de cadenas de caracteres desde los siguiente fuentes:

- Plantillas de cadenas de caracteres (p. ej. `template: '...'`)
- [Componentes de un solo archivo (`.vue`)](single-file-component.html)
- `<script type="text/x-template">`
:::

### Las restricciones de la colocación de elementos

Algunos elementos HTML, como `<ul>`, `<ol>`, `<table>` y `<select>` tienen restricciones sobre qué elementos pueden aparecer dentro de ellos, y algunos elementos como `<li>`, `<tr>` y `<option>` solo pueden aparecer dentro de ciertos otros elementos.

Esto conducirá a problemas cuando se utilizan componentes con elementos que tienen tales restricciones. Por ejemplo:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

El componente personalizado `<blog-post-row>` será levantado (hoisted) como contenido inválido, lo que provocará errores en la final salida renderizada. Podemos utilizar el atributo especial [`is`](/api/special-attributes.html#is) como una solución alternativa:

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
When used on native HTML elements, the value of `is` must be prefixed with `vue:` in order to be interpreted as a Vue component. This is required to avoid confusion with native [customized built-in elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

### Distinción entre mayúsculas y minúsculas (Case Insensitivity)

Los nombres de atributos HTML no distinguen mayúsculas de minúsculas, por eso los navegadores interpretarán cualquier carácter en mayúscula como minúscula. Eso significa que cuando está utilizando plantillas dentro del DOM, los nombres de _props_ y los parámetros de manejadores de eventos de _camelCase_ necesitan utilizar sus equivalentes de _kebab-case_ (delimitado por guiones):

```js
// camelCase en JavaScript

app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- kebab-case en HTML -->

<blog-post post-title="hello!"></blog-post>
```

Eso es todo lo que necesita saber sobre los casos especiales de análisis de plantillas DOM por ahora, y en realidad, el final de los _aspectos esenciales_ de Vue. ¡Felicidades! Todavía hay más que aprender, pero primero, recomendamos tomar un descanso para practicar con Vue usted mismo y construir algo divertido.

Una vez que se sienta cómodo con el conocimiento que acaba de digerir, le recomendamos que regrese para leer la guía completa de [Componentes Dinámicos y Asíncronos](component-dynamic-async.html), así como las otras páginas en la sección Componentes en Profundidad de la barra lateral.
