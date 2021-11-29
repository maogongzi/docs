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

- `mounted`: llamado cuando el componente padre del elemento vinculado está montado.

- `beforeUpdate`: llamado antes de que se actualice el VNode del componente que contiene el elemento

:::tip Note
Vamos a hablar de VNodes con más detalles [más tarde](render-function.html#the-virtual-dom-tree), cuando hablamos de funciones de _render_
:::

- `updated`: llamado después de que se hayan actualizado el VNode del componente que contiene el elemento, **y los VNodes de sus hijos**.

- `beforeUnmount`: llamado antes de que el componente padre del elemento vinculado sea desmontado

- `unmounted`: llamado solo una vez, cuando la directiva esté desvinculado del elemento y el componente padre sea desmontado.

Puede probar los argumentos pasados a estos hooks (es decir, `el`, `binding`, `vnode` y `prevVnode`) en [API de directivas personalizadas](../api/application-api.html#directive)

### Dynamic Directive Arguments

Directive arguments can be dynamic. For example, in `v-mydirective:[argument]="value"`, the `argument` can be updated based on data properties in our component instance! This makes our custom directives flexible for use throughout our application.

Let's say you want to make a custom directive that allows you to pin elements to your page using fixed positioning. We could create a custom directive where the value updates the vertical positioning in pixels, like this:

```vue-html
<div id="dynamic-arguments-example" class="demo">
  <p>Scroll down the page</p>
  <p v-pin="200">Stick me 200px from the top of the page</p>
</div>
```

```js
const app = Vue.createApp({})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.value is the value we pass to directive - in this case, it's 200
    el.style.top = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

This would pin the element 200px from the top of the page. But what happens if we run into a scenario when we need to pin the element from the left, instead of the top? Here's where a dynamic argument that can be updated per component instance comes in very handy:

```vue-html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
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
    // binding.arg is an argument we pass to directive
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

Result:

<common-codepen-snippet title="Custom directives: dynamic arguments" slug="YzXgGmv" :preview="false" />

Our custom directive is now flexible enough to support a few different use cases. To make it even more dynamic, we can also allow to modify a bound value. Let's create an additional property `pinPadding` and bind it to the `<input type="range">`

```vue-html{4}
<div id="dynamicexample">
  <h2>Scroll down the page</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Stick me {{ pinPadding + 'px' }} from the {{ direction || 'top' }} of the page</p>
</div>
```

```js{5}
const app = Vue.createApp({
  data() {
    return {
      direction: 'right',
      pinPadding: 200
    }
  }
})
```

Now let's extend our directive logic to recalculate the distance to pin on component update:

```js{7-10}
app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  },
  updated(el, binding) {
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})
```

Result:

<common-codepen-snippet title="Custom directives: dynamic arguments + dynamic binding" slug="rNOaZpj" :preview="false" />

## Function Shorthand

In previous example, you may want the same behavior on `mounted` and `updated`, but don't care about the other hooks. You can do it by passing the callback to directive:

```js
app.directive('pin', (el, binding) => {
  el.style.position = 'fixed'
  const s = binding.arg || 'top'
  el.style[s] = binding.value + 'px'
})
```

## Object Literals

If your directive needs multiple values, you can also pass in a JavaScript object literal. Remember, directives can take any valid JavaScript expression.

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## Usage on Components

When used on components, custom directive will always apply to component's root node, similarly to [non-prop attributes](component-attrs.html).

```vue-html
<my-component v-demo="test"></my-component>
```

```js
app.component('my-component', {
  template: `
    <div> // v-demo directive will be applied here
      <span>My component content</span>
    </div>
  `
})
```

Unlike attributes, directives can't be passed to a different element with `v-bind="$attrs"`.

With [fragments](/guide/migration/fragments.html#overview) support, components can potentially have more than one root node. When applied to a multi-root component, directive will be ignored and the warning will be thrown.
