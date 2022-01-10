# Manejo de Eventos

<VideoLesson href="https://vueschool.io/lessons/user-events-in-vue-3?friend=vuejs" title="Aprender cómo manejar eventos en Vue School">Aprender cómo manejar eventos con una lección gratis en Vue School</VideoLesson>

## Escuchar eventos

Podemos utilizar la directiva `v-on`, la cual típicamente abreviamos al símbolo `@`, para escuchar eventos DOM y ejecutar algunos JavaScript cuando se activen. El uso podría ser `v-on:click="methodName"` o con la abreviatura, `@click="methodName"`.

Por ejemplo:

```html
<div id="basic-event">
  <button @click="counter += 1">Añadir 1</button>
  <p>Se ha hecho clic en el botón de arriba {{ counter }} veces.</p>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      counter: 0
    }
  }
}).mount('#basic-event')
```

Result:

<common-codepen-snippet title="Manejo de Eventos: básicos" slug="xxGadPZ" tab="result" :preview="false" />

## Métodos Manejadores de eventos

Sin embargo, la lógica para muchos controladores de eventos será más compleja, por lo que no es factible mantener su JavaScript en el valor del atributo `v-on`. Eso es porque `v-on` también puede aceptar el nombre de un método al que quería llamar.

Por ejemplo:

```html
<div id="event-with-method">
  <!-- `greet` es el nombre de un método definido a continuación -->
  <button @click="greet">Saludar</button>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      name: 'Vue.js'
    }
  },
  methods: {
    greet(event) {
      // `this` dentro de los métodos apunta a la actual instancia activa
      alert('Hello ' + this.name + '!')
      // `event` es el evento DOM nativo
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
}).mount('#event-with-method')
```

Resultado:

<common-codepen-snippet title="Manejo de eventos: con un método" slug="jOPvmaX" tab="result" :preview="false" />

## Métodos Manejadores en línea

En lugar de enlazar directamente con un nombre de método, también podemos utilizar métodos en una declaración de JavaScript en línea:

```html
<div id="inline-handler">
  <button @click="say('hola')">Di hola</button>
  <button @click="say('que')">Di que</button>
</div>
```

```js
Vue.createApp({
  methods: {
    say(message) {
      alert(message)
    }
  }
}).mount('#inline-handler')
```

Resultado:

<common-codepen-snippet title="Manejo de eventos: con un manejador en línea" slug="WNvgjda" tab="result" :preview="false" />

A veces también necesitamos acceder al evento DOM original en un manejador de declaración en línea. Puede pasarlo a un método utilizando la variable especial `$event`:

```html
<button @click="warn('El formulario no se puede enviar aun.', $event)">
  Enviar
</button>
```

```js
// ...
methods: {
  warn(message, event) {
    // ahora tenemos acceso al evento nativo.
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

## Múltiples manejadores de evento

Puede haber múltiples métodos en un manejador de evento separados por un operador de comma así:

```html
<!-- tanto one() como two() serán ejecutado cuando se hace clic en el botón -->
<button @click="one($event), two($event)">
  Enviar
</button>
```

```js
// ...
methods: {
  one(event) {
    // la lógica del primero manejador...
  },
  two(event) {
    // la lógica del segundo manejador...
  }
}
```

## Modificadores de eventos

Es una necesidad muy común llamar a `event.preventDefault()` o `event.stopPropagation()` dentro de los manejadores de eventos. Aunque podemos hacerlo fácilmente dentro de los métodos, sería mejor si los métodos fueran 
puramente sobre lógica de datos en lugar de tener que lidiar con los detalles del evento DOM.

Para solucionar este problema, Vue proporciona **modificadores de eventos** para `v-on`. Recuerde que los modificadores son postfijos de directivas marcados por un punto.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`
- `.passive`

```html
<!-- Se detendrá la propagación del evento click. -->
<a @click.stop="doThis"></a>

<!-- El evento de enviar ya no volverá a recargar la página. -->
<form @submit.prevent="onSubmit"></form>

<!-- Los modificadores pueden encadenarse -->
<a @click.stop.prevent="doThat"></a>

<!-- solo el modificador -->
<form @submit.prevent></form>

<!-- utilizar el modo de captura al agregar el escuchador de eventos -->
<!-- es decir, un evento dirigido a un elemento interno se maneja aquí antes de ser manejado por ese elemento -->
<div @click.capture="doThis">...</div>

<!-- solo activa el manejador si event.target es el elemento de sí mismo -->
<!-- es decir, no de un elemento hijo -->
<div @click.self="doThat">...</div>
```

::: tip
El orden es importante cuando se utilizan modificadores porque el código relevante se genera en el mismo orden. Por lo tanto, el uso de `@click.prevent.self` evitará **todas las acciones por defecto de clics en el elemento de sí mismo y en sus elementos hijo** mientras que `@click.self.prevent` solo evitará la acción por defecto de clics en el elemento de sí mismo.
:::

```html
<!-- El evento de clic se activará como máximo una vez. -->
<a @click.once="doThis"></a>
```

A diferencia de los otros modificadores, que son exclusivos de los eventos DOM nativos, el modificador `.once` también se puede usar en [eventos de componentes](component-custom-events.html). Si aún no ha leído sobre componentes, no se preocupe de esto por ahora.

Vue también ofrece el modificador `.passive`, correspondiente a [la opción `pasiva` de `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters).

```html
<!-- El comportamiento por defecto del evento scroll (scrolling) sucederá -->
<!-- inmediatamente, en lugar de esperar a que se complete `onScroll` -->
<!-- en caso de que contenga `event.preventDefault ()` -->
<div @scroll.passive="onScroll">...</div>
```

El modificador `.passive` es especialmente útil para mejorar el rendimiento en dispositivos móviles.

::: tip
No utilice `.passive` y `.prevent` juntos, ya que `.prevent` se ignorará y su navegador probablemente le mostrará una advertencia. Recuerde, `.passive` comunica al navegador que _no_ desea evitar el comportamiento por defecto del evento.
:::

## Modificadores de Teclas

Cuando se escuchan eventos de teclado, a menudo necesitamos verificar teclas específicas. Vue permite agregar modificadores clave para `v-on` o `@` cuando se escuchan eventos de teclado:

```html
<!-- solo llama a `vm.submit()` cuando el `key` es `Enter` -->
<input @keyup.enter="submit" />
```
Puede utilizar directamente cualquier nombre válido de tecla expuesto mediante [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) como modificadores convirtiéndolos a kebab-case:

```html
<input @keyup.page-down="onPageDown" />
```

En el ejemplo arriba, solo se llamará el manejador si `$event.key` es igual a `'PageDown'`.

### Aliases de tecla

Vue proporciona aliases para las teclas más comúnmente utilizados:

- `.enter`
- `.tab`
- `.delete` (captura las teclas tanto "Delete" como "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

## Modificador de Teclas del Sistema

Puede utilizar los siguientes modificadores para activar escuchadores de eventos de ratón o teclado solo cuando se presiona la tecla modificadora correspondiente:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Note
En los teclados de Macintosh, meta es la tecla de comando (⌘). En los teclados de Windows, meta es la tecla de Windows (⊞). En los teclados de Sun Microsystems, el meta está marcado como un diamante sólido (◆). En ciertos teclados, específicamente los teclados y sucesores de máquinas MIT y Lisp, como el teclado Knight, el teclado space-cadet, el meta está etiquetado como “META”. En los teclados de Symbolics, el meta está etiquetado como “META” o “Meta”.
:::

Por ejemplo:

```html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Hacer algo</div>
```

::: tip
Tenga en cuenta que las teclas modificadoras son diferentes de las teclas normales y cuando se usan con eventos `keyup`, deben ser presionado cuando se emite el evento. En otras palabras, `keyup.ctrl` solo se activará si suelta una tecla mientras mantiene presionada la tecla `Ctrl`. No se activará si suelta la tecla `ctrl` solo.
:::

### Modificador `.exact`

El modificador `.exact` permite el control de la combinación exacta de modificadores del sistema necesarios para activar un evento.

```html
<!-- esto se disparará incluso si se presione Alt o Shift -->
<button @click.ctrl="onClick">A</button>

<!-- esto solo se disparará cuando se presione Ctrl y no se presionen otras teclas -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- esto solo se disparará cuando no se presionen modificadores del sistema -->
<button @click.exact="onClick">A</button>
```

### Modificador de Boton del Ratón

- `.left`
- `.right`
- `.middle`

Estos modificadores restringen el manejador a eventos activados por un botón específico del ratón.

## ¿Por qué Escuchadores en HTML?

Es posible que le preocupe que todo este enfoque de escucha de eventos viole las viejas buenas reglas sobre la “separación de preocupaciones” (“separation of concerns”). Tenga la tranquilidad de que todas las funciones y expresiones del escuchador de Vue están estrictamente vinculadas al ViewModel que está manejando la vista actual, no causará ninguna dificultad de mantenimiento. De hecho, hay varios beneficios en el uso de `v-on` o `@`:

1. Es más fácil ubicar las implementaciones de la función de manejador dentro de su código JS al ojear la plantilla HTML.

2. Dado que no tiene que adjuntar manualmente escuchadores de eventos en JS, su código de ViewModel puede ser de lógica pura y libre de DOM. Esto hace que sea más fácil de probar.

3. Cuando se destruye un ViewModel, todos los escuchadores de eventos se eliminan automáticamente. No tiene que preocuparse de limpiarlo por usted mismo.
