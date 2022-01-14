# Directivas Personalizadas

## Introducción

Además del conjunto por defecto de directivas incluidas en el núcleo (como `v-model` y `v-show`), Vue también le permite registrar sus propias directivas personalizadas. Note que en Vue, la forma primaria de reutilización y abstracción del código son los componentes; sin embargo, puede haber casos en los que necesite un acceso al bajo nivel al DOM en elementos simples, y aquí es donde las directivas personalizadas seguirían siendo útiles. Un ejemplo sería enfocarse en un elemento de entrada, como este:

<common-codepen-snippet title="Directivas personalizadas: ejemplo básico" slug="JjdxaJW" :preview="false" />

Cuando se carga la página, este elemento se enfoca (nota: el atributo `autofocus` no funciona en Safari para dispositivos mobiles). De hecho, si no ha hecho clic en nada más desde que visitó esta página, la entrada de arriba debería estar enfocada ahora. También, puede hacer clic en el botón `Rerun` y la entrada será enfocado.

Ahora vamos a construir la directiva que realiza esto:

```js
const app = Vue.createApp({})
// Registra una directiva personalizada global llamada `v-focus`
app.directive('focus', {
  // Cuando el elemento vinculado se inserta en el DOM...
  mounted(el) {
    // Enfoca el elemento
    el.focus()
  }
})
```

Si desea registrar una directiva localmente en su lugar, los componentes también aceptan una opción `directives`:

```js
directives: {
  focus: {
    // Definición de directiva
    mounted(el) {
      el.focus()
    }
  }
}
```

Luego, en una plantilla, puede utilizar el nuevo atributo `v-focus` en cualquier elemento, como este:

```html
<input v-focus />
```

## Funciones de Hook

Un objeto de definición de directiva puede proveer algunas funciones de hook (todas son opcionales):

- `created`: llamado antes de que se apliquen los atributos u escuchadores de eventos del elemento vinculado. Este es útil en casos donde la directiva necesita adjuntar escuchadores de eventos que deben ser llamado antes de los escuchadores normales de eventos de `v-no`.

- `beforeMount`: llamado cuando la directiva es vinculado por primera vez al elemento y antes de que se monte el componente padre.

- `mounted`: llamado antes de que se monte el componente padre del elemento vinculado.

- `beforeUpdate`: llamado antes de que se actualice el VNode del componente que contiene el elemento

:::tip Note
Vamos a hablar de VNodes con más detalles [más tarde](render-function.html#the-virtual-dom-tree), cuando hablamos de funciones de _render_
:::

- `updated`: llamado después de que se hayan actualizado el VNode del componente que contiene el elemento, **y los VNodes de sus hijos**.

- `beforeUnmount`: llamado antes de que el componente padre del elemento vinculado sea desmontado

- `unmounted`: llamado solo una vez, cuando la directiva esté desvinculado del elemento y el componente padre sea desmontado.

Puede probar los argumentos pasados a estos hooks (es decir, `el`, `binding`, `vnode` y `prevVnode`) en [API de directivas personalizadas](../api/application-api.html#directive)

### Dynamic Directive Arguments

Los argumentos de directivas pueden ser dinámicos. Por ejemplo, en `v-mydirective:[argument]="value"`, ¡la `argument` puede ser actualizado basado en las propiedades de dato en nuestra instancia de componente! Este hace que nuestras directivas personalizadas sean flexibles para uso en toda nuestra aplicación.

Digamos que quiere realizar una directiva personalizada que te permita fijar elementos a tu página utilizando posicionamiento fijado. Podríamos crear una directiva personalizada dónde el valor actualice el posicionamiento vertical en píxeles, como este:

```vue-html
<div id="dynamic-arguments-example" class="demo">
  <p>Desplácese por la página</p>
  <p v-pin="200">Fíjeme 200 píxeles desde la parte superior de la página</p>
</div>
```

```js
const app = Vue.createApp({})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.value es el valor que pasamos a la directiva, en este caso, es 200
    el.style.top = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

Este podría fijar el elemento 200 píxeles desde la parte superior de la página. ¿Pero que sucederá si nos encontramos en un escenario cuando necesitamos fijar el elemento desde la izquierda, en lugar de la arriba? Aquí viene el muy útil argumento dinámico que puede ser actualizado por instancias de componente:

```vue-html
<div id="dynamicexample">
  <h3>Desplácese dentro de esta sección ↓</h3>
  <p v-pin:[direction]="200">Estoy fijado en la página a la distancia de 200 píxeles desde la izquierda.</p>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      direction: 'right'
    }
  }
})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.arg es un argumento que pasamos a la directiva
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

Result:

<common-codepen-snippet title="Directivas personalizadas: argumentos dinámicos" slug="YzXgGmv" :preview="false" />

Ahora nuestra directiva personalizada es suficientemente flexible para soportar unos casos diferentes. Para hacerla aún más dinámica, podemos también permitir modificar un valor vinculado. Creamos una propiedad adicional `pinPadding` y la vinculemos a `<input type="range">`

```vue-html{4}
<div id="dynamicexample">
  <h2>Desplácese por la página</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Fíjeme {{ pinPadding + 'px' }} de la {{ direction || 'arriba' }} de la página</p>
</div>
```

```js{5}
const app = Vue.createApp({
  data() {
    return {
      direction: 'derecha',
      pinPadding: 200
    }
  }
})
```

Ahora extendamos la lógica de nuestra directiva para recalcular la distancia de fijar cuando el componente se actualice:

```js{7-10}
app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    const s = binding.arg || 'arriba'
    el.style[s] = binding.value + 'px'
  },
  updated(el, binding) {
    const s = binding.arg || 'arriba'
    el.style[s] = binding.value + 'px'
  }
})
```

Resultado:

<common-codepen-snippet title="Directivas personalizadas: argumentos dinámicos + vinculaciones dinámicos" slug="rNOaZpj" :preview="false" />

## Forma Abreviada de Funciones

En el ejemplo anterior, podría querer el mismo comportamiento en `mounted` y `updated`, sin preocuparse de otras hooks. Puede hacerlo mediante pasar el _callback_ a la directiva:

```js
app.directive('pin', (el, binding) => {
  el.style.position = 'fixed'
  const s = binding.arg || 'arriba'
  el.style[s] = binding.value + 'px'
})
```

## Objetos Literales

Si su directiva necesita varios valores, también puede pasar un objeto literal de JavaScript. Recuerde, las directivas pueden tomar cualquier expresión válida de JavaScript.

```vue-html
<div v-demo="{ color: 'blanco', text: '¡hola!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "blanco"
  console.log(binding.value.text) // => "¡hola!"
})
```

## Usos en Componentes

Cuando se utilizan en componentes, las directivas personalizadas solo aplicarán al nodo raíz del componente, similar a [atributos que no son _props_](component-attrs.html).

```vue-html
<my-component v-demo="test"></my-component>
```

```js
app.component('my-component', {
  template: `
    <div> // la directiva v-demo solo se aplicará aquí
      <span>El contenido de mi componente</span>
    </div>
  `
})
```

A diferencia de atributos, las directivas no se pueden pasar a un elemento diferente con `v-bind="$attrs"`.

Con suporte de [fragmentos](/guide/migration/fragments.html#overview), los componentes pueden potencialmente tener más que un solo nodo raíz. Al aplicarla a un componente con múltiples raíces, la directiva será ignorado y se lanzará una advertencia.
