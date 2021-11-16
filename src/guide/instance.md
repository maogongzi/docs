# Instancias de Aplicación y Componente

## Creando una Instancia de Aplicación

Cada aplicación Vue empieza con la creación de una **instancia de aplicación** con la función `createApp`:

```js
const app = Vue.createApp({
  /* opciones */
})
```

La instancia de la aplicación es utilizada para registrar 'globals' que luego puede ser utilizada por componentes dentro de esa aplicación. Discutiremos eso en detalle más adelante en esta guía, pero como un ejemplo rápido:

```js
const app = Vue.createApp({})
app.component('SearchInput', SearchInputComponent)
app.directive('focus', FocusDirective)
app.use(LocalePlugin)
```

La mayoría de los métodos expuestos por la instancia de la aplicación retornan la misma instancia, permitiendo el encadenamiento:

```js
Vue.createApp({})
  .component('SearchInput', SearchInputComponent)
  .directive('focus', FocusDirective)
  .use(LocalePlugin)
```

Usted puede ver la API de la aplicación completa en [Referencia de API](../api/application-api.html).

## El Componente Raíz

Las opciones pasadas a `createApp` son utilizadas para configurar el **componente raíz**. Ese componente es utilizado como punto de partida para renderizar cuando **montamos** la aplicación.

Una aplicación necesita ser montada en un elemento del DOM. Por ejemplo, si queremos montar una aplicación Vue en `<div id="app"></div>`, deberíamos pasar `#app`:

```js
const RootComponent = {
  /* opciones */
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')
```

A diferencia de la mayoría de los métodos de la aplicación, `mount` no retorna la aplicación. En vez de eso, retorna la instancia del componente raíz.

Although not strictly associated with the [MVVM pattern](https://en.wikipedia.org/wiki/Model_View_ViewModel), Vue's design was partly inspired by it. As a convention, we often use the variable `vm` (short for ViewModel) to refer to a component instance.

While all the examples on this page only need a single component, most real applications are organized into a tree of nested, reusable components. For example, a Todo application's component tree might look like this:

```
Root Component
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Each component will have its own component instance, `vm`. For some components, such as `TodoItem`, there will likely be multiple instances rendered at any one time. All of the component instances in this application will share the same application instance.

We'll talk about [the component system](component-basics.html) in detail later. For now, just be aware that the root component isn't really any different from any other component. The configuration options are the same, as is the behavior of the corresponding component instance.

## Component Instance Properties

Earlier in the guide we met `data` properties. Properties defined in `data` are exposed via the component instance:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4
```

There are various other component options that add user-defined properties to the component instance, such as `methods`, `props`, `computed`, `inject` and `setup`. We'll discuss each of these in depth later in the guide. All of the properties of the component instance, no matter how they are defined, will be accessible in the component's template.

Vue also exposes some built-in properties via the component instance, such as `$attrs` and `$emit`. These properties all have a `$` prefix to avoid conflicting with user-defined property names.

## Lifecycle Hooks

Each component instance goes through a series of initialization steps when it's created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. Along the way, it also runs functions called **lifecycle hooks**, giving users the opportunity to add their own code at specific stages.

For example, the [created](../api/options-lifecycle-hooks.html#created) hook can be used to run code after an instance is created:

```js
Vue.createApp({
  data() {
    return { count: 1 }
  },
  created() {
    // `this` points to the vm instance
    console.log('count is: ' + this.count) // => "count is: 1"
  }
})
```

There are also other hooks which will be called at different stages of the instance's lifecycle, such as [mounted](../api/options-lifecycle-hooks.html#mounted), [updated](../api/options-lifecycle-hooks.html#updated), and [unmounted](../api/options-lifecycle-hooks.html#unmounted). All lifecycle hooks are called with their `this` context pointing to the current active instance invoking it.

::: tip
Don't use [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) on an options property or callback, such as `created: () => console.log(this.a)` or `vm.$watch('a', newValue => this.myMethod())`. Since an arrow function doesn't have a `this`, `this` will be treated as any other variable and lexically looked up through parent scopes until found, often resulting in errors such as `Uncaught TypeError: Cannot read property of undefined` or `Uncaught TypeError: this.myMethod is not a function`.
:::

## Lifecycle Diagram

Below is a diagram for the instance lifecycle. You don't need to fully understand everything going on right now, but as you learn and build more, it will be a useful reference.

<img src="/images/lifecycle.svg" width="840" height="auto" style="margin: 0px auto; display: block; max-width: 100%;" loading="lazy" alt="Instance lifecycle hooks">
