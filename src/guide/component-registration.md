# Registro de Componente

<VideoLesson href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components?friend=vuejs" title="Lección gratis sobre registro de componente de Vue.js">Aprender cómo funciona el registro de componente con una lección gratis en Vue School</VideoLesson>

> Esta pagina asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

## Nombre del Componente

Cuando registramos un componente, siempre se le asignará un nombre. Por ejemplo, en el registro global hemos visto hasta ahora:

```js
const app = Vue.createApp({...})

app.component('my-component-name', {
  /* ... */
})
```

El nombre del componente es el primer argumento de `app.component`. En el ejemplo arriba, el nombre del componente es "my-component-name".

El nombre que le dé a un componente puede depender de dónde pretenda utilizarlo. Cuando utilice un componente directamente en el DOM (a diferencia de en una plantilla de cadena de caracteres o [componentes de un solo archivo](../guide/single-file-component.html)), recomendamos encarecidamente seguir las [reglas de W3C](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) para nombres de etiquetas personalizados:

1. Todo en minúsculas
2. Debe contener un guión (es decir, hay múltiples palabras conectadas por el guión)

De esta manera, le ayudará evitar conflictos con los elementos HTML actuales y futuros.

Usted puede ver otras recomenaciones para nombres de componentes en la [Guía de Estilo](../style-guide/#base-component-names-strongly-recommended).

### Nomenclatura

Cuando define componentes en una plantilla de cadena de caracteres o en un componente de un solo archivo, tiene dos opciones para nombrarlos:

#### Con _kebab-case_

```js
app.component('my-component-name', {
  /* ... */
})
```

Al definir un componente con _kebab-case_, también debe utilizar _kebab-case_ al hacer referencia a su elemento personalizado, como en `<my-component-name>`.

#### Con _PascalCase_

```js
app.component('MyComponentName', {
  /* ... */
})
```

Cuando define un componente con _PascalCase_, puede utilizar cualquiera de los dos casos al hacer referencia a su elemento personalizado. Eso significa que tanto `<my-component-name>` como `<MyComponentName>` son aceptables. Sin embargo, tenga en cuenta que solo los nombres de _kebab-case_ son válidos directamente en el DOM (es decir, plantillas que no son cadenas de caracteres).

## Registro Global

Hasta ahora, solo hemos creado componentes utilizando `app.component`:

```js
Vue.createApp({...}).component('my-component-name', {
  // ... opciones ...
})
```

Estos componentes son **registrados globalmente** para la aplicación. Lo que significa que ellos pueden ser utilizado en la plantilla de cualquiera instancia de componente dentro de esta aplicación:

```js
const app = Vue.createApp({})

app.component('component-a', {
  /* ... */
})
app.component('component-b', {
  /* ... */
})
app.component('component-c', {
  /* ... */
})

app.mount('#app')
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

Esto se aplica incluso a todos los componentes secundarios, lo que significa que todos los tres componentes también estarán disponibles _dentro de cada uno_.

## Registro local

El registro global a menudo no es ideal. Por ejemplo, si estás utilizando un empaquetador de módulos como Webpack, el registro global de todos los componentes significa que, incluso si deja de utilizar un componente, podría ser incluido en su compilación final. Esto aumenta innecesariamente la cantidad de JavaScript que sus usuarios tienen que descargar.

En estos casos, puede definir sus componentes como objetos JavaScript simples:

```js
const ComponentA = {
  /* ... */
}
const ComponentB = {
  /* ... */
}
const ComponentC = {
  /* ... */
}
```

Entonces, defina los componentes que le gustaría utilizar en una opción `components`:

```js
const app = Vue.createApp({
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

Para cada propiedad del objeto `components`, la clave será el nombre del elemento personalizado, mientras que el valor contendrá el objeto de opciones del componente.

Note que **los componentes registrados localmente _no_ están tampoco disponibles en los componentes secundarios**. Por ejemplo, si quisiera que el `ComponentA` estuviera disponible en el `ComponentB`, tendría que utilizar:

```js
const ComponentA = {
  /* ... */
}

const ComponentB = {
  components: {
    'component-a': ComponentA
  }
  // ...
}
```

O si está usando módulos ES2015, como por ejemplo a través de Babel y Webpack, podría parecerse más a:

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
  // ...
}
```

Note que en ES2015+, colocar un nombre de variable como `ComponentA` dentro de un objeto es la abreviatura de `ComponentA: ComponentA`, lo que significa que el nombre de la variable es ambos:

- el nombre del elemento personalizado para utilizar en la plantilla, y
- el nombre de la variable que contiene las opciones del componente

## Sistemas de módulos

Si no está utilizando un sistema de módulos con `import`/`require`, puede probablemente saltar esta sección por ahora. Si lo está, tenemos algunas instrucciones y consejos especiales solo para usted.

### Registro local en un Sistema de Módulos

Si todavía está aquí, es probable que esté usando un sistema de módulos, tales como Babel y Webpack. En estos casos, recomendamos crear un directorio de `components`, con cada componente en su propio archivo.

Entonces tendrá que importar cada componente que quiera utilizar, antes de registrarlo localmente. Por ejemplo, en un hipotético archivo `ComponentB.js` o `ComponentB.vue`:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  }
  // ...
}
```

Ahora ambos `ComponentA` y `ComponentC` pueden ser utilizado dentro de la plantilla de `ComponentB`.
