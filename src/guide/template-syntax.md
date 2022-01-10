# Sintaxis de Plantillas

Vue.js utiliza una sintaxis de plantillas basado en HTML que le permite vincular declarativamente el DOM renderizado a los datos que hay debajo de la instancia del componente. Todas las plantillas Vue.js son HTML válido que puede ser procesado por navegadores y procesadores HTML que cumplen con las especificaciones.

Detrás de escena, Vue compila las plantillas a funciones de renderizado en un DOM Virtual. Combinado con el sistema de reactividad, Vue es capaz de encontrar inteligentemente el mínimo número de componentes que requieren ser renderizados y aplicar la menor cantidad de manipulaciones de DOM posibles cuando el estado de la aplicación cambia.

Si usted está familiarizado con los conceptos del DOM Virtual y prefiere el poder puro de JavaScript, también puede [escribir directamente funciones de renderizado](render-function.html) en vez de plantillas, con soporte opcional para JSX.

## Interpolaciones

### Texto

La forma más básica de vinculación de datos es la interpolación de texto empleando la sintaxis "_Mustache_" (llaves dobles):

```html
<span>Mensaje: {{ msg }}</span>
```

La etiqueta de llaves dobles será reemplazada con el valor de la propiedad `msg` de la instancia de componente correspondiente. También será actualizado cuando la propiedad `msg` cambie.

Usted también puede realizar interpolaciones de "una sola vez", las cuales no actualizan cuando los datos cambian, empleando la [directiva v-once](../api/directives.html#v-once), pero tome en cuenta que esto también afectará cualquier otra vinculación en el mismo nodo:

```html
<span v-once>Este mensaje nunca cambiará: {{ msg }}</span>
```

### HTML Puro

Las llaves dobles interpretan los datos como texto plano, no como HTML. Para obtener HTML como salida, necesitará utilizar la [directiva `v-html`](../api/directives.html#v-html):

```html
<p>Usando llaves dobles: {{ rawHtml }}</p>
<p>Usando la directiva v-html: <span v-html="rawHtml"></span></p>
```

<common-codepen-snippet title="Renderizar v-html" slug="yLNEJJM" :preview="false" />

El contenido de la etiqueta `span` será reemplazado con el valor de la propiedad `rawHtml`, interpretado como HTML plano, ignorando las vinculaciones de datos. Debe notar que no puede utilizar `v-html` para componer plantillas parciales porque Vue no es un motor de plantillas basado en cadenas de caracteres. En su lugar, los componentes son preferidos como la unidad fundamental para la reutilización y composición de interfaces de usuario.

::: tip
Renderizar dinámicamente HTML arbitrario en su sitio web puede ser muy peligroso porque puede llevar fácilmente a [vulnerabilidades XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Solo utilice la interpolación de HTML en contenido de confianza y **nunca** en contenido proporcionado por el usuario.
:::

### Atributos

Las llaves dobles no pueden ser utilizadas dentro de los atributos de HTML. En su lugar, utilice la [directiva `v-bind`](../api/directives.html#v-bind):

```html
<div v-bind:id="dynamicId"></div>
```

Si el valor vinculado es `null` o `undefined`, el atributo no será incluido en el elemento renderizado.

En el caso de los atributos booleanos, donde su existencia implica `true`, `v-bind` trabaja de una forma distinta. Por ejemplo:

```html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

El atributo `disabled` será incluido si `isButtonDisabled` tiene un valor _truthy_ (que puede evaluarse a `true`). Será también incluido si el valor es una cadena de caracteres vacia, mantiene la consistencia con `<button disabled="">`. Por otras valores _falsy_ (que puede evaluarse a `false`), el atributo será ignorado.

### Utilizando Expresiones de JavaScript

Hasta ahora solo hemos estado vinculando propiedades sencillos en nuestras plantillas. Pero Vue.js soporta el poder completo de las expresiones de JavaScript dentro de las vinculaciones de datos:

```html
{{ number + 1 }}

{{ ok ? 'SI' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Esas expresiones serán evaluadas como JavaScript en el alcance de los datos de la instancia activa actual. Una restricción es que cada vinculación solo puede contener **una única expresión**, por lo que lo siguiente **NO** funcionará:

```html
<!-- esto es una declaración, no una expresión: -->
{{ var a = 1 }}

<!-- el flujo de control tampoco funcionará, utilice operaciones ternarias -->
{{ if (ok) { return message } }}
```

## Directivas

Las directivas son atributos especiales con el prefijo `v-`. Se espera que los valores de los atributos de estas directivas sean **una sola expresión de JavaScript** (con la excepción de `v-for` y `v-on`, las cuales discutiremos más adelante). El trabajo de una directiva es aplicar reactivamente los efectos secundarios al DOM cuando el valor de la expresión cambia. Vamos a revisar el ejemplo que vimos en la introducción:

```html
<p v-if="seen">Ahora me ve</p>
```

Aquí, la directiva `v-if` eliminaría/insertaría el elemento `<p>` basado en la veracidad del valor de la expresión `seen`.

### Argumentos

Algunas directivas pueden aceptar un "argumento", denotado por dos puntos (:) después del nombre de la directiva. Por ejemplo, la directiva `v-bind` es utilizada para actualizar reactivamente un atributo HTML:

```html
<a v-bind:href="url"> ... </a>
```

Aquí, `href` es el argumento, el cual le indica a la directiva `v-bind` que vincule el atributo `href` del elemento al valor de la expresión `url`.

Otro ejemplo es la directiva `v-on`, la cual escucha los eventos del DOM:

```html
<a v-on:click="doSomething"> ... </a>
```

Aquí, el argumento es el nombre del evento que se va a escuchar. Hablaremos también del manejo de eventos con mayor detalle.

### Argumentos Dinámicos

También es posible utilizar una expresión de JavaScript en un argumento de directiva encerrándolo entre corchetes:

```html
<!--
Note que hay ciertas restricciones para la expresión del argumento, como se explica abajo en la sección "Restricciones de Expresión de Argumento Dinámico".
-->
<a v-bind:[attributeName]="url"> ... </a>
```

Aquí, `attributeName` será evaluado dinámicamente como una expresión de JavaScript, y su valor resultante será utilizado como el valor final para el argumento. Por ejemplo, si su instancia de componente tiene una propiedad de datos `attributeName`, cuyo valor es `"href"`, entonces esta vinculación será equivalente a `v-bind:href`.

De forma similar, puede utilizar argumentos dinámicos para vincular un manejador a un nombre de evento dinámico:

```html
<a v-on:[eventName]="doSomething"> ... </a>
```

En este ejemplo, cuando el valor de `eventName` es `"focus"`, `v-on:[eventName]` será equivalente a `v-on:focus`.

### Modificadores

Los modificadores son sufijos especiales denotados por un punto, los cuales indican que una directiva debería estar vinculada de una forma especial. Por ejemplo, el modificador `.prevent` indica a la directiva `v-on` que llame a `event.preventDefault()` en el evento que es disparado:

```html
<form v-on:submit.prevent="onSubmit">...</form>
```

Usted verá luego otros ejemplos de modificadores, [para `v-on`](events.md#event-modifiers) y [para `v-model`](forms.md#modifiers), cuando exploremos estás características.

## Abreviaturas de las Directivas

El prefijo `v-` sirve como una señal para identificar los atributos específicos de Vue en sus plantillas. Esto es útil cuando está utilizando Vue.js para aplicar un comportamiento dinámico a un código existente, pero se puede sentir verboso en algunas directivas utilizadas frecuentemente. Al mismo tiempo, la necesidad para el prefijo `v-` se vuelve menos importante cuando está construyendo una [SPA](https://en.wikipedia.org/wiki/Single-page_application), donde Vue maneja cada plantilla. Por lo tanto, Vue provee abreviaturas especiales para las dos directivas más utilizadas, `v-bind` y `v-on`:

### `v-bind` Shorthand

```html
<!-- sintaxis completa -->
<a v-bind:href="url"> ... </a>

<!-- versión abreviada -->
<a :href="url"> ... </a>

<!-- abreviatura con argumento dinámico -->
<a :[key]="url"> ... </a>
```

### Abreviatura de la Directiva `v-on`

```html
<!-- sintaxis completa -->
<a v-on:click="doSomething"> ... </a>

<!-- versión abreviada -->
<a @click="doSomething"> ... </a>

<!-- abreviatura con argumento dinámico -->
<a @[event]="doSomething"> ... </a>
```

Pueden parecer un poco diferentes del HTML normal, pero `:` y `@` son caracteres válidos para los nombres de los atributos y todos los navegadores soportados por Vue pueden analizarlos correctamente. Además, ellos no aparecen al final del código. La sintaxis abreviada es totalmente opcional, pero la apreciará cuando aprenda más sobre su uso en etapas posteriores.

> De la página siguiente en adelante, utilizaremos las abreviaturas en nuestros ejemplos, debido a que es lo más común para los desarrolladores de Vue.

### Advertencias

#### Restricciones de Valores de Argumento Dinámico

Se espera que los argumentos dinámicos sean evaluados a cadenas de caracteres, con la excepción de `null`. El valor especial `null` puede ser utilizado para eliminar explícitamente la vinculación. Cualquier otro valor que no sea cadena de caracteres disparará una advertencia.

#### Restricciones de Expresión de Argumento Dinámico

Las expresiones de los argumentos dinámicos tienen algunas restricciones de sintaxis debido a que ciertos caracteres, como los espacios y comillas, son inválidos dentro de los nombres de atributos HTML. Por ejemplo, lo siguiente es inválido:

```html
<!-- Esto disparará una advertencia en el compilador. -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

Recomendamos reemplazar cualquier expresión compleja con una [propiedad calculada](computed.html), una de las piezas fundamentales de Vue, la cual cubriremos próximamente.

Cuando se estén utilizando plantillas dentro del DOM (plantillas directamente escritas en un archivo HTML), debería también evitar nombrar las claves con caracteres en mayúscula, debido a que los navegadores forzarán los nombres de los atributos a minúsculas:

```html
<!--
Esto será convertido a v-bind:[someattr] en plantillas dentro del DOM.
A menos que tenga una propiedad "someattr" en su instancia, su código no funcionará.
-->
<a v-bind:[someAttr]="value"> ... </a>
```

#### Expresiones de JavaScript

Las expresiones de plantillas están encerradas en un entorno aislado y solo tienen acceso a una [lista permitida de variables globales](https://github.com/vuejs/vue-next/blob/master/packages/shared/src/globalsWhitelist.ts#L3) como `Math` y `Date`. No debería intentar acceder a variables globales definidas por el usuario en las expresiones de plantilla.
