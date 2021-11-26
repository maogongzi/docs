# Slots

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

<VideoLesson href="https://vueschool.io/lessons/vue-3-component-slots?friend=vuejs" title="Lección gratis sobre Slots de Vue.js">Aprender los básicos de slot con una lección gratis en Vue School</VideoLesson>

## Contenido del Slot

Vue implementa una API de distribución de contenido inspirado en el [Borrador de especificaciones de componentes web](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), utilizando el elemento `<slot>` para servir como puntos de distribución para el contenido.

Esto le permite componer componentes como este:

```html
<todo-button>
  Add todo
</todo-button>
```

Luego en la plantilla para `<todo-button>`, es posible que usted tenga:

```html
<!-- la plantilla del componente todo-button -->
<button class="btn-primary">
  <slot></slot>
</button>
```

Cuando el componente se renderiza, `<slot></slot>` será reemplazado por “Add Todo”.

```html
<!-- el HTML renderizado -->
<button class="btn-primary">
  Add todo
</button>
```

¡Pero las cadenas de caracteres son justo el inicio! Slots pueden también contener cualquier código de plantilla, incluso HTML:

```html
<todo-button>
  <!-- Agregar un ícono de Font Awesome -->
  <i class="fas fa-plus"></i>
  Agregar tarea
</todo-button>
```

O hasta otros componentes:

```html
<todo-button>
  <!-- Utilizar un componente para agregar un ícono -->
  <font-awesome-icon name="plus"></font-awesome-icon>
  Agregar tarea
</todo-button>
```

Si la plantilla de `<todo-button>` **no** contuvo un elemento `<slot>`, cualquier contenido proporcionado entre sus etiquetas de apertura y de cierre sería desechado.

```html
<!-- la plantilla del componente todo-button -->

<button class="btn-primary">
  Crear un nuevo elemento
</button>
```

```html
<todo-button>
  <!-- el texto siguiente no será renderizado -->
  Agregar tarea
</todo-button>
```

## Alcance de Renderización

Cuando quiere utilizar dato dentro de un _slot_, como en el siguiente código:

```html
<todo-button>
  Eliminar {{ item.name }}
</todo-button>
```

Ese _slot_ tiene acceso a las propiedades de la misma instancia (es decir, el mismo "alcance") como el resto de la plantilla.

<img src="/images/slot.png" width="447" height="auto" style="display: block; margin: 0 auto; max-width: 100%" loading="lazy" alt="Diagrama de explanación de slot">

El _slot_ **no** tiene acceso al alcance de `<todo-button>`. Por ejemplo, la intención de acceder a `action` no funcionaría:

```html
<todo-button action="delete">
  Haz clic aquí para {{ action }} un elemento
  <!--
  La `action` será undefined, porque este contenido está pasado a <todo-button>, en vez de ser definido dentro del componente <todo-button>.
  -->
</todo-button>
```

Como una regla, recuerda que:

> Todo en la plantilla del padre está compilado en el alcance del padre; todo en la plantilla del hijo está compilado en el alcance del hijo.

## Contenido Alternativo

Hay casos cuando es útil especificar una alternativa (es decir, por defecto) contenido para un _slot_, para ser renderizado solo cuando no contenido sea proporcionado. Por ejemplo, en un componente `<submit-button>`:

```html
<button type="submit">
  <slot></slot>
</button>
```

Podríamos querer que el texto "Submit" sea renderizado dentro de `<button>` la mayoría de las veces. Para hacer "Submit" el contenido alternativo, podemos ponerlo dentro de las etiquetas de `<slot>`:

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

Ahora cuando utilizamos `<submit-button>` en un componente padre proporcionando nada para el _slot_:

```html
<submit-button></submit-button>
```

se renderizará el contenido alternativo, "Submit":

```html
<button type="submit">
  Submit
</button>
```

Pero si proporcionamos contenido:

```html
<submit-button>
  Save
</submit-button>
```

Entonces, el contenido proporcionado será renderizado en su lugar:

```html
<button type="submit">
  Save
</button>
```

## Slots Nombrados

Hay momentos cuando es útil tener múltiples _slots_, Por ejemplo, en un componente `<base-layout>` con la siguiente plantilla:

```html
<div class="container">
  <header>
    <!-- Queremos el contenido del encabezado aquí -->
  </header>
  <main>
    <!-- Queremos el contenido principal aquí -->
  </main>
  <footer>
    <!-- Queremos el contenido del pie de página aquí -->
  </footer>
</div>
```

Para estos casos, el elemento `<slot>` tiene un atributo especial, `name`, lo cual puede ser utilizado para asignar un ID único a diferentes _slots_, así que puede determinar donde el contenido debería renderizarse:

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Un `<slot>` sin nombre tiene implícitamente el nombre “default”.

Para proporcionar contenido a los slots nombrados, podemos utilizar la directiva `v-slot` en un `<template>`, proporcionando el nombre del slot como argumento de v-slot:

```html
<base-layout>
  <template v-slot:header>
    <h1>Aquí podría ir un título de página</h1>
  </template>

  <template v-slot:default>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </template>

  <template v-slot:footer>
    <p>Aquí va alguna información de contacto</p>
  </template>
</base-layout>
```

Ahora todo lo que está dentro de los elementos de `<template>` se pasará a los slots correspondientes.

El HTML renderizado será:

```html
<div class="container">
  <header>
    <h1>Aquí podría ir un título de página</h1>
  </header>
  <main>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </main>
  <footer>
    <p>Aquí va alguna información de contacto</p>
  </footer>
</div>
```

Note que **`v-slot` solo puede ser agregado a un `<template>`** (con [una excepción](#abbreviated-syntax-for-lone-default-slots)).

## Slots con Alcance (Scoped Slots)

A veces, es útil para el contenido del slot tener acceso a los datos solo disponibles en el componente secundario. Es un caso común cuando un componente está utilizado para renderizar una matriz de elementos, y queremos ser capaz de personalizar la manera de la que cada elemento sea renderizado.

Por ejemplo, tenemos un componente que contiene una lista de tareas.

```js
app.component('todo-list', {
  data() {
    return {
      items: ['Alimentar al gato', 'Comprar Leche']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items">
        {{ item }}
      </li>
    </ul>
  `
})
```

Podríamos querer reemplazar el <span v-pre>`{{ item }}`</span> con un `<slot>` para personalizarlo en el componente padre:

```html
<todo-list>
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

Pero, eso no funcionará, debido a que solo el componente `<todo-list>` tiene acceso al `item` y estamos proporcionando el contenido del _slot_ desde su padre.

para hacer `item` disponible para el contenido del _slot_ proporcionado por el padre, podemos agregar un elemento `<slot>` y vincularlo como un atributo:

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item"></slot>
  </li>
</ul>
```

Puede vincular tantos atributos al `slot`, como necesita:

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item" :index="index" :another-attribute="anotherAttribute"></slot>
  </li>
</ul>
```

Las propiedades vinculadas a un elemento `<slot>` se llaman **props de slots**. Ahora, en el alcance del padre, podemos utilizar `v-slot` con un valor para definir un nombre para las _props_ del _slot_ que nos han proporcionado:

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

<img src="/images/scoped-slot.png" width="611" height="auto" style="display: block; margin: 0 auto; max-width: 100%;" loading="lazy" alt="Diagrama de slots con alcance">

En este ejemplo, hemos elegido nombrar al objeto que contiene todos nuestras _props_ del _slot_ “slotProps”, pero puede utilizar cualquier nombre que prefiera.

### Sintaxis abreviada para los Slots Solitarios por Defecto

En casos como el anterior, cuando _solo_ proporcionan contenido al slot por defecto, las etiquetas del componente pueden utilizarse como plantilla del slot. Esto nos permite utilizar `v-slot` directamente en el componente:

```html
<todo-list v-slot:default="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

Esto puede acortarse aún más. Así como se asume que el contenido no especificado es para el slot por defecto, se asume que la `v-slot` sin un argumento se refiere al slot por defecto:

```html
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

Note que la sintaxis abreviada del slot por defecto **no puede** mezclarse con los slots con nombre, ya que resultará en una ambigüedad de alcance:

```html
<!-- INVALID, will result in warning -->
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>

  <template v-slot:other="otherSlotProps">
    slotProps NO está disponible aquí
  </template>
</todo-list>
```

Cada vez que hay múltiples slots, utilice la sintaxis completa basada en `<template>` para _todos_ slots:

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

### Desestructuración de las _props_ del Slot

Internamente, los slots con alcance funcionan envolviendo el contenido de su contenido de slot en una función pasada con un solo argumento:

```js
function (slotProps) {
  // ... contenido del slot ...
}
```

Esto significa que el valor de `v-slot` puede en realidad aceptar cualquier expresión JavaScript válida que pueda aparecer en la posición del argumento de una definición de función. Así que también puede utilizar [Desestructuración de ES2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) para sacar _props_ específicas del slot, tales como:

```html
<todo-list v-slot="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

Esto puede hacer que la plantilla sea mucho más limpia, especialmente cuando el slot proporciona muchas _props_. También abre otras posibilidades, como renombrar las _props_, por ejemplo, de `item` a `todo`:

```html
<todo-list v-slot="{ item: todo }">
  <i class="fas fa-check"></i>
  <span class="green">{{ todo }}</span>
</todo-list>
```

Incluso puede definir las alternativas, para ser utilizadas en caso de que un _prop_ de slot esté _undefined_:

```html
<todo-list v-slot="{ item = 'Placeholder' }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

## Nombre dinámicos de los slots

[Argumentos dinámicos de las directivas](template-syntax.md#dynamic-arguments) también funcionan en `v-slot`, permitiendo la definición de nombres dinámicos de los slots:

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## Abreviaturas de slots nombrados

Similar a `v-on` y `v-bind`, `v-slot` también tiene una abreviatura, reemplazando todo antes el argumento (`v-slot:`) con el símbolo `#`. Por ejemplo, `v-slot:header` puede ser reescrito como `#header`:

```html
<base-layout>
  <template #header>
    <h1>Aquí podría ir un título de página</h1>
  </template>

  <template #default>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </template>

  <template #footer>
    <p>Aquí va alguna información de contacto</p>
  </template>
</base-layout>
```

Sin embargo, justo como con otras directivas, la abreviatura está solo disponible cuando un argumento es proporcionado. Eso significa que la siguiente sintaxis es inválido:

```html
<!-- resultará en una advertencia -->

<todo-list #="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

En cambio, siempre debe especificar el nombre del slot si desea utilizar la abreviatura:

```html
<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```
