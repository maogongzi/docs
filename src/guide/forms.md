# Vinculación de Entradas de Formularios

<VideoLesson href="https://vueschool.io/lessons/user-inputs-vue-devtools-in-vue-3?friend=vuejs" title="Aprender cómo manejar entradas de formularios en Vue School">Aprender cómo manejar entradas de formularios con una lección gratis en Vue School</VideoLesson>

## Uso Básico

Puede utilizar la directiva `v-model` para crear vinculaciones de datos de doble direcciones (two-way data binding) en elementos input, textarea y select de un formulario. La directiva busca automáticamente la manera correcta de actualizar el elemento según el tipo de entrada. Aunque un poco mágico, `v-model` es esencialmente azúcar de sintaxis para actualización de datos a través de eventos de entradas del usuario, además de mostrar un cuidado especial para algunos casos de borde.

::: tip Note
v-model ignorará los atributos iniciales de `value`, `checked` o `selected` encontrados en cualquier elemento de formulario, Siempre tratará los datos de la actual instancia activa como la fuente de verdad. Debería declarar el valor inicial del lado de JavaScript, dentro de la opción `data` de su componente.
:::

`v-model` internamente utiliza propiedades distintas y emitir eventos distintos para distintos elementos de entrada:

- Los elementos de texto y _textarea_ utilizan propiedad `value` y evento `input`;
- _checkbox_ y _radio_ utilizan propiedad `checked` y evento `change`;
- Los campos de _select_  utilizan propiedad `value` y evento `change`.

<span id="vmodel-ime-tip"></span>
::: tip Note
Para los idiomas que requieren un [IME](https://en.wikipedia.org/wiki/Input_method) (chino, japonés, coreano, etc.), notará que el `v-model` no se actualiza durante la composición del IME. Si también desea responder a estas actualizaciones, utilice un escuchador de evento `input` y la vinculación de `value` en vez de utilizar `v-model`.
:::

### Texto

```html
<input v-model="message" placeholder="edit me" />
<p>El mensaje es: {{ message }}</p>
```

<common-codepen-snippet title="Manejar formularios: básicos sobre v-model" slug="eYNPEqj" :preview="false" />

### Textos Multilínea

```html
<span>El mensaje multilínea es:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br />
<textarea v-model="message" placeholder="introducir múltiples líneas"></textarea>
```

<common-codepen-snippet title="Manejar formularios: textarea" slug="xxGyXaG" :preview="false" />

Interpolación sobre _textarea_ no funcionará. Utilice `v-model` en su lugar.

```html
<!-- mal -->
<textarea>{{ text }}</textarea>

<!-- bien -->
<textarea v-model="text"></textarea>
```

### Checkbox

Un solo checkbox con valor booleano:

```html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<common-codepen-snippet title="Manejar formularios: checkbox" slug="PoqyJVE" :preview="false" />

Múltiples _checkbox_, vinculados a la misma matriz:

```html
<div id="v-model-multiple-checkboxes">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames" />
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
  <label for="mike">Mike</label>
  <br />
  <span>Nombres marcados: {{ checkedNames }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      checkedNames: []
    }
  }
}).mount('#v-model-multiple-checkboxes')
```

<common-codepen-snippet title="Manejar formularios: múltiples checkbox" slug="bGdmoyj" :preview="false" />

### Radio

```html
<div id="v-model-radiobutton">
  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">One</label>
  <br />
  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Two</label>
  <br />
  <span>Picked: {{ picked }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      picked: ''
    }
  }
}).mount('#v-model-radiobutton')
```

<common-codepen-snippet title="Manejar formularios: radio" slug="MWwPEMM" :preview="false" />

### Select

Un solo _select_:

```html
<div id="v-model-select" class="demo">
  <select v-model="selected">
    <option disabled value="">Seleccione una opción por favor:</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Seleccionado: {{ selected }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      selected: ''
    }
  }
}).mount('#v-model-select')
```

<common-codepen-snippet title="Manejar formularios: select" slug="KKpGydL" :preview="false" />

:::tip Note
Si el valor inicial de su expresión `v-model` no coincide con ninguna de las opciones, el elemento `<select>` se renderizará en un estado “no seleccionado”. En iOS, esto hará que el usuario no pueda seleccionar el primer elemento porque iOS no dispara un evento de cambio en este caso. Por lo tanto, se recomienda proporcionar una opción deshabilitada con un valor vacío, como se muestra en el ejemplo anterior.
:::

Selección de múltiples elementos (vinculados a una matriz):

```html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br />
<span>Seleccionado: {{ selected }}</span>
```

<common-codepen-snippet title="Manejar formularios: selección de múltiples elementos vinculados a una matriz" slug="gOpBXPz" tab="result" :preview="false" />

Opciones dinámicas renderizadas con `v-for`:

```html
<div id="v-model-select-dynamic" class="demo">
  <select v-model="selected">
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Seleccionado: {{ selected }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'Uno', value: 'A' },
        { text: 'Dos', value: 'B' },
        { text: 'Tres', value: 'C' }
      ]
    }
  }
}).mount('#v-model-select-dynamic')
```

<common-codepen-snippet title="Manejar formularios: select con opciones dinámicas" slug="abORVZm" :preview="false" />

## Vinculación de Valor

Para opciones de _radio_, _checkbox_ y _select_, los valores vinculados de `v-model` son usualmente cadenas de caracteres estáticas (o booleanos para _checkbox_):

```html
<!-- `picked` es una cadena de caracteres "a" cuando está chequeado -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` es o `true` o `false` -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` es una cadena de caracteres "abc" cuando se selecciona la primera opción -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Pero a veces es posible que queramos vincular el valor a una propiedad dinámica en la actual instancia activa. Podemos utilizar `v-bind` para lograrlo. Además, el uso de `v-bind` nos permite vincular el valor de entrada a valores que no son cadenas de caracteres.

### Checkbox

```html
<input type="checkbox" v-model="toggle" true-value="yes" false-value="no" />
```

```js
// cuando está marcado:
vm.toggle === 'yes'
// cuando está desmarcado:
vm.toggle === 'no'
```

:::tip Tip
Los atributos de `true-value` y de `false-value` no afectan el atributo `value` del la entrada, ya que los navegadores no incluyen _checkbox_ desmarcados en los envíos de formularios. Para garantizar que uno de los dos valores se envie en un formulario (por ejemplo, “yes” o “no”), use entradas de _radio_ en su lugar.
:::

### Radio

```html
<input type="radio" v-model="pick" v-bind:value="a" />
```

```js
// cuando está marcado:
vm.pick === vm.a
```

### Select

```html
<select v-model="selected">
  <!-- objeto literal en línea -->
  <option :value="{ number: 123 }">123</option>
</select>
```

```js
// cuando está seleccionado:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modificadores

### `.lazy`

Por defecto, `v-model` sincroniza la entrada con los datos después de cada evento `input` (con la excepción de la composición IME [descrito anteriormente](#vmodel-ime-tip)). En lugar de esto, puede agregar el modificador `lazy` para realizar la sincronización después del evento `change`:

```html
<!-- sincronizado después de "change" en lugar de "input" -->
<input v-model.lazy="msg" />
```

### `.number`

Si desea que la entrada del usuario se convierten automáticamente en un número, puede agregar el modificador `number` al `v-model` de la entrada manejada:

```html
<input v-model.number="age" type="text" />
```

Esto suele ser útil cuando el tipo de la entrada es `text`. Si el tipo es `number`, Vue puede automáticamente convertir el valor de la cadena de caracteres original a un número, así no necesita agregar el modificador `.number` al `v-model`. Si el valor no se puede analizar con `parseFloat()`, se retorna el valor original.

### `.trim`

Si desea que las entradas del usuario se recorten automáticamente, puede agregar el modificador `trim` al `v-model` de la entrada manejada:

```html
<input v-model.trim="msg" />
```

## `v-model` con Componentes

> Si aún no está familiarizado con los componentes de Vue, puede omitir esto por ahora.

Los tipos de entradas nativas de HTML no siempre satisfarán sus necesidades. Afortunadamente, los componentes de Vue le permiten crear entradas reutilizables con un comportamiento completamente personalizado. ¡Estos componentes también funcionan con `v-model`! Para aprender más, lea acerca de [entradas personalizadas](./component-basics.html#using-v-model-on-components) en la guía de componentes.
