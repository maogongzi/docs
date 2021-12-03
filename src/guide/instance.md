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

Aunque no está estrictamente asociado con el [Patrón MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), el diseño de Vue fue parcialmente inspirado por este. Como una convención, a menudo utilizamos la variable `vm` (abreviatura de _ViewModel_) para referirnos a la instancia de un componente.

Aunque todos los ejemplos en esta página solo necesitan un componente único, la mayoría de las aplicaciones del mundo real están organizadas en un árbol de componentes anidados y reutilizables. Por ejemplo, un árbol de componentes de una aplicación _Todo_ puede verse como sigue a continuación:

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

Cada componente tendrá su propia instancia de componente, `vm`. Para algunos componentes, como `TodoItem`, es muy probable que haya múltiples instancias renderizadas en un mismo momento. Todas las instancias de componentes en esta aplicación compartirán la misma instancia de aplicación.

Hablaremos luego [del sistema de componentes](component-basics.html) con mayor detalle. Por ahora, solo debe saber que el componente raíz no es diferente de cualquier otro componente. Las opciones de configuración son las mismas, así como también el comportamiento de la instancia de componente correspondiente.

## Propiedades de Instancia de Componente

Previamente en esta guía vimos las propiedades `data`. Las propiedades definidas en `data` son expuestas mediante la instancia del componente:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4
```

Existen otras opciones de componente que añaden propiedades definidas por el usuario a la instancia del componente, tal como `methods`, `props`, `computed`, `inject` y `setup`. Discutiremos cada una de esas en detalle más adelante en esta guía. Todas las propiedades de la instnacia del componente, sin importar cómo son definidas, serán accesibles en la plantilla del componente.

Vue también expone algunas propiedades integradas mediante la instancia del componente, tal como `$attrs` y `$emit`. Estas propiedades tienen un prefijo `$` para evitar conflictos con nombres de propiedades definidas por el usuario.

## _Hooks_ de Ciclo de Vida

Cada instancia de componente pasa por una serie de pasos de inicialización cuando este es creado, por ejemplo, necesita preparar la observación de datos, compilar la plantilla, montar la instancia al DOM y actualizar el mismo cuando los datos cambian. En el camino, también ejecuta funciones llamadas **_hooks_ de ciclo de vida**, dando a los usuarios la oportunidad de añadir su propio código en etapas específicas.

Por ejemplo, el _hook_ [created](../api/options-lifecycle-hooks.html#created) puede ser utilizado para ejecutar código después de que una instancia fue creada:

```js
Vue.createApp({
  data() {
    return { count: 1 }
  },
  created() {
    // `this` apunta a la instancia vm
    console.log('la cantidad es: ' + this.count) // => "la cantidad es: 1"
  }
})
```

Existen también otros _hooks_ los cuales serán llamados en etapas diferentes de ciclo de vida de la instancia, como [mounted](../api/options-lifecycle-hooks.html#mounted), [updated](../api/options-lifecycle-hooks.html#updated), y [unmounted](../api/options-lifecycle-hooks.html#unmounted). Todos los _hooks_ de ciclo de vida son llamados con su contexto `this` apuntando a la instancia actual y activa que los invoca.

::: tip
No utilice [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) en la propiedad de opciones o _callback_, como las `created: () => console.log(this.a)` o `vm.$watch('a', newValue => this.myMethod())`. Como una _arrow function_ no tiene un `this`, `this` será tratado como cualquier otra variable y buscada léxicamente hacia los alcances del elemento padre hasta ser encontrada, usualmente resultando en errores como `Uncaught TypeError: Cannot read property of undefined` o `Uncaught TypeError: this.myMethod is not a function`.

## Diagrama de Ciclo de Vida

A continuación se muestra un diagrama de ciclo de vida de la instancia. No necesita entender en este momento todo lo que se muestra, pero conforme aprenda y construya más, será una referencia útil.

<img src="/images/lifecycle.svg" width="840" height="auto" style="margin: 0px auto; display: block; max-width: 100%;" loading="lazy" alt="Hooks de ciclo de vida de instancia">
