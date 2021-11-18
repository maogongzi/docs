# Componentes de un Solo Archivo

<VideoLesson href="https://vueschool.io/lessons/vue-3-introduction-to-single-file-components?friend=vuejs" title="Free Vue.js Single File Components Lesson">Aprender sobre componentes de un solo archivo con una lección de vídeo gratis en Vue School</VideoLesson>

## Introducción

Componentes de un Solo Archivo de Vue (también conocido como archivos `*.vue`, abreviado como **SFC**) es un formato especial que nos permite encapsular las plantillas, lógica, **y** estilos de un componente Vue en un solo archivo. Aquí es un ejemplo de SFC:

```vue
<script>
export default {
  data() {
    return {
      greeting: '¡Hola Mundo!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

Como podemos ver, Vue SFC es un extensión natural de trío clasical de HTML, CSS y JavaScript. Cada archivo `*.vue` consiste en tres tipos de bloques de lenguaje de nivel superior: `<template>`, `<script>`, y `<style>`:

- La sección `<script>` es una módulo estándar de JavaScript. Debería exportar una definición de componente Vue como su exportación por defecto.
- La sección `<template>` define la plantilla del componente.
- La sección `<style>` define estilos(CSS) asociados con el componente.

Consulte más detalles en el [Especificación del Sintaxis de SFC](/api/sfc-spec).

## Como funciona

Vue SFC es un formato específico del framework y debe ser compilado antes de mano por [@vue/compiler-sfc](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc) a JavaScript y CSS estándares. Un SFC compilado es un módulo estándar de JavaScript (ES) - lo que significa que con paso adecuado de construcción puede importar un SFC como un módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Las etiquetas `<style>` dentro de SFCs son típicamente inyectados como etiquetas nativas de `<style>` durante desarrollo para soportar actualizaciones en tiempo(_hot update_). Para producción pueden ser extraido y fusionado a un archivo único de CSS.

Puede jugar con los SFCs y explorar como son compilado en el [Patio de Recreo de Vue SFC](https://sfc.vuejs.org/).

En proyectos actuales, típicamente integramos el compilador de SFC con una herramienta de construcción como [Vite](https://vitejs.dev/) o [Vue CLI](http://cli.vuejs.org/) (lo cual es basado en [webpack](https://webpack.js.org/)), y Vue proporciona herramientas oficales de andamiaje para ayudarle empezar con los SFCs lo antes posible. Consulte más detalles en la sección [Herramientas de SFC](/api/sfc-tooling).

## Por qué SFC

Mientras los SFCs requieren un paso de construcción, hay numerosos beneficos a cambio:

- Componentes modularizados por el autor utilizando sintaxis familiares de HTML, CSS y JavaScript
- Plantillas compilados antes de mano
- [CSS con alcance limitado al componente](/api/sfc-style)
- [Sintaxis más ergonómica cuando trabaja con los APIs de composición](/api/sfc-script-setup)
- Más optimizaciones al tiempo de compilación mediante el análisis cruzado de plantilla y script
- [Soporte de IDE](/api/sfc-tooling.html#ide-support) con _auto-completion_ y comprobación de tipos para expresiones de plantillas
- Soporte fuera de la caja de reemplazo caliente de módulos (HMR)

El SFC es una característica típica de Vue como un framework, y es el enfoque recomendado para utilizar Vue en los escenarios a continuación:

- Aplicación de una sola página (SPA)
- Generación de sitios estáticos (SSG)
- Cualquier frontend no trivial donde un paso de construcción es considerado mejor para la experiencia de desarrollo (DX).

Dicho esto, realizamos que hay escenarios donde los SFCs pueden ser excesos. Es porque Vue puede también utilizado mediante JavaScript plano sin un paso de construcción. Si solo está buscando mejorar HTML estático en gran medida con interacciones livianos, puede consultar también [petite-vue](https://github.com/vuejs/petite-vue), un subconjunto de Vue de solo 5kb, optimizado para mejoramientos progresivos.

## ¿Qué hay de separación de responsabilidades?

Unos usuarios vienen de un fondo tradicional del desarrollo web pueden llevar la preocupación de que los SFCs están mezclando distintos intereses en el mismo lugar - de lo cual HTML/CSS/JS se suponían de separarse!

Para responder esta pregunta, es importante para nosotros acodar que **separación de responsabilidades no es igual a separación de tipos de archivo.** El último objetivo de principios de ingeniería es mejorar la mantenibilidad del base de código. Separación de responsabilidades, una vez que sea aplicado como separación de tipos de archivo, no nos ayuda a alcanzar el objetivo en el context de frontend aplicaciones con más y más complejidad.

En el desarrollo de interfaz de usuario moderno, hemos encontrado que en vez de separar la base de código en tres grandes capas que entretejen entre sí, tiene más sentido dividirlos en componentes débilmente acoplados y los componemos. Dentro de un componente, su plantilla, lógica y estilos son acoplados inherentemente, y colocarlos de hecho hace que el componente más cohesivo y mantenible.

Note que aunque no le gusta el idea de Componentes de un Solo Archivo, puede todavía aprovechar sus características de _hot-reloading_ y _pre-compilation_ mediante separar su JavaScript y CSS en archivos separados utilizando [Src Imports](/api/sfc-spec.html#src-imports).
