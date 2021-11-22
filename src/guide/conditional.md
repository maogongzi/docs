# Renderización Condicional

<VideoLesson href="https://vueschool.io/lessons/conditional-rendering-in-vue-3?friend=vuejs" title="Aprender cómo renderización condicional funciona en Vue School">Aprender cómo renderización condicional funciona con una lección gratis en Vue School</VideoLesson>

## `v-if`

Esta directiva `v-if` es utilizado para renderizar un bloque condicionalmente. Este bloque solo será renderizado si la expresión de la directiva retorna un valor _truthy_.

```html
<h1 v-if="awesome">¡Vue es estupendo!</h1>
```

Es también posible añadir un bloque de _else_ con `v-else`:

```html
<h1 v-if="awesome">¡Vue es estupendo!</h1>
<h1 v-else>Oh no 😢</h1>
```

### Grupos Condicionales con `v-if` en `<template>`

Debido a que `v-if` es una directiva, tiene que ser adjuntado a un solo elemento. Pero ¿y si queremos alternar más que uno elemento? En este caso podemos utilizar `v-if` en un elemento `<template>`, lo que sierve como un envoltorio invisible. El final resulto renderizado no incluirá el elemento `<template>`.

```html
<template v-if="ok">
  <h1>Título</h1>
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
</template>
```

### `v-else`

Puede utilizar la directiva `v-else` para indicar un bloque _else_ para `v-if`:

```html
<div v-if="Math.random() > 0.5">
  Ahora me ve
</div>
<div v-else>
  Ahora no
</div>
```

Un elemento de `v-else` debe seguir inmediatamente un elemento de `v-if` o `v-else-if`, de lo contrario no será reconocido.

### `v-else-if`

La directiva `v-else-if`, como su nombre indica, sierve como un bloque de _else if_ para `v-if`. También puede ser encadenado múltiples tiempos:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Ni A/B/C
</div>
```

Similar como `v-else`, un elemento de `v-else-if` debe seguir inmediatamente un elemento de `v-if` o `v-else-if`.

## `v-show`

Otra opción para mostrar condicionalmente un elemento es la directiva `v-show`. El uso es lo mismo en gran medida.

```html
<h1 v-show="ok">¡Hola!</h1>
```

La diferencia es que un elemento con `v-show` será renderizado y mantenido en el DOM; `v-show` solo alterna la propiedad CSS `display` del elemento.

`v-show` no soporta el elemento `<template>`, tampoco funciona con `v-else`.

## `v-if` versus `v-show`

`v-if` es renderización condicional verdadero poeque garantiza que los escuchadores de evento y componentes secundarios dentro del bloque condicional serán destruido correctamente y recreado durante alternaciones.

`v-if` es también **perezoso**: si la condición es falsa o renderización inicial, no hará nada - el bloque condicional no será renderizado hasta que la condición se convierta en _true_ por primera vez.

En comparación, `v-show` es más sencillo - el elemento es siempre renderizado sin tener en cuenta la condición inicial, con alternación basada de CSS.

En términos generales, `v-if` es más costoso mientras `v-show` es más costoso en la renderización inicial. Por eso elige `v-show` si necesita alternar algo muy a menudo, y elige `v-if` si la condición es poco probable de cambiarse en tiempo de ejecución.

## `v-if` junto con `v-for`

::: tip Note
Utilice `v-if` y `v-for` juntos **no es recomendado**. Vea el [guía de estilos](../style-guide/#avoid-v-if-with-v-for-essential) por más detalles.
:::

Cuando `v-if` y `v-for` son aplicado juntos en el mismo elemento, `v-if` será evaluado primero. Vea el [guía de renderización de listas](list.html#v-for-with-v-if) por más detalles.
