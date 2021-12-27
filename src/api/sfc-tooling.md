# Herramienta de SFC

## Área de Pruebas En Líneas

No necesita instalar todas las cosas en su mácina para probar SFCs Vue, hay múltiples áreas de pruebas en líneas que le permite hacerlo justo en el navegador:

- [Área de Pruebas de Vue SFC](https://sfc.vuejs.org) (oficial, desplegado con el último commit)
- [Área de Pruebas de VueUse](https://play.vueuse.org)
- [Vue en CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue en Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue en Codepen](https://codepen.io/pen/editor/vue)
- [Vue en StackBlitz](https://stackblitz.com/fork/vue)
- [Vue en Components.studio](https://components.studio/create/vue3)
- [Vue en WebComponents.dev](https://webcomponents.dev/create/cevue)

Es también recomendado utilizar estas áreas de pruebas en líneas para proveer reproducciones cuando reporte errores.

## La Construcción de Proyectos

### Vite

[Vite](https://vitejs.dev/) es una herramienta de construcción ligera y rápida con soporte de primera clase para SFC Vue. Es creado por Evan You, ¡quien es también el autor de Vue mismo! Para empezar con Vite + Vue, simplemente ejecuta:

```sh
npm init vite@latest
```

Entonces seleciona la plantilla Vue y seguir las instrucciones.

- Para aprender más sobre Vite, echa un vistazo a [las documentaciones de Vite](https://vitejs.dev/guide/).
- Para configurar comportamientos específicos de Vue en un proyecto de Vite, por ejemplo pasar opciones al compilador de Vue, echa un vistazo a las documentaciones de [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).

La [área de pruebas de SFC](https://sfc.vuejs.org/) también soporta descargar los archivos como un proyecto de Vite.

### Vue CLI

[Vue CLI](https://cli.vuejs.org/) es la herramienta de compilación oficial basada de webpack para proyectos de Vue. Para empezar con Vue CLI:

```sh
npm install -g @vue/cli
vue create hello-vue
```

- Para aprender más sobre Vue CLI, echa un vistazo a [documentaciones de Vue CLI](https://cli.vuejs.org/guide/installation.html).

### ¿Vite o Vue CLI?

Nosotros recomendamos empezar nuevos proyectos con Vite debido a que ofrece drásticamente mejor experiencia de desarrollo en términos de rendimiento de la inicialización de servidor de desarrollo y actualización de recarga en caliente (HMR) ([detalles](https://vitejs.dev/guide/why.html)). Solo opta por Vue CLI si depende de características específicas de webpack (p. ej. federación de módulos (Module Federation)).

Si usted es un usuario de [Rollup](https://rollupjs.org/), puede adopta Vite con seguridad debido a que utiliza Rollup para las construcciones de producción y soporta el sistema de plugins compatibles con Rollup. [Incluso el mantenedor de Rollup recomienda Vite como el envoltorio de desarrollo web para Rollup](https://twitter.com/lukastaegert/status/1412119729431584774).

## Soporte de IDE

La configuración recomendada de IDE es [VSCode](https://code.visualstudio.com/) + la extención [Volar](https://github.com/johnsoncodehk/volar). Volar provee el resaltado de sintaxis y IntelliSense avanzada para epxresiones de plantilla, _props_ de componente y incluso la validación de _slots_. Recomendamos encarecidamente esta configuración si quiere obtener la mejor posible experiencia con los SFCs Vue, especialmente si está también utilizando TypeScript.

[WebStorm](https://www.jetbrains.com/webstorm/) también provee soporte decente para los SFCs Vue. Sin embargo, tenga en cuenta que ahora su soporte para `<script setup>` es todavía [en curso](https://youtrack.jetbrains.com/issue/WEB-49000).

La mayoría de otros editores tienen soporte de resaltado de sintaxis creado por la comunidad para Vue, pero falta el mismo nivel de IntelliSense de código. A largo plazo, Esperamos que podamos extender el rango de soporte de editores mediante apalancar el [protocol de servicio de lenguaje](https://microsoft.github.io/language-server-protocol/) debido a que la lógica principal de Volar es implementada como un servidor estándar de lenguaje.

## Soporte de Prueba

- Si se utilice Vite, recomendamos [Cypress](https://www.cypress.io/) como el mejor ejecutor para las pruebas unitarias y e2e. Las pruebas unitarias para SFCs Vue pueden realizarse con el [ejecutador de pruebas de componentes de cypress](https://www.cypress.io/blog/2021/04/06/introducing-the-cypress-component-test-runner/).

- Vue CLI proporciona la integración de [Jest](https://jestjs.io/) y [Mocha](https://mochajs.org/).

- Si está configurando manualmente Jest para trabajar con SFCs Vue, echa un vistazo a [vue-jest](https://github.com/vuejs/vue-jest), lo que es la transformación oficial de Jest para SFCs Vue.

## Integración con Bloques Personalizados

Bloques Personalizados son compilados en importaciones al mismo archivo Vue con queries de solicitudes distintos (different request queries). La herramienta de compilación subyacente puede decidir cómo manajar estas solicitudes de importación.

- Si se utiliza Vite, un plugin personalizado de Vite debe ser utilizado para transformar los bloques personalizados correspondidos en JavaScript ejecutable. [[Ejemplo](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)]

- Si se utiliza Vue CLI o webpack plano, un cargador webpack debe ser configurado para transformar los bloques correspondidos. [[Ejemplo](https://vue-loader.vuejs.org/guide/custom-blocks.html#custom-blocks)]

## Herramientas de nivel inferior

### `@vue/compiler-sfc`

- [Documentación](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc)

Este paquete es parte del monorepo núcleo de Vue y siempre publicado con la misma versión como el paquete principal `vue`. Típicamente, será listado como una dependencia _peer_ de `vue` en un proyecto. Para asegurarse del comportamiento correcto, su versión debe ser siempre sincronizado con `vue`, es decir, cada vez que actualice la versión de `vue`, debería también actualizar `@vue/compiler-sfc` para que coincidan.

El paquete mismo provee utilidades de nivel inferior para procesar SFCs Vue y sólo está dedicado para los autores de herramientos que necesitan soportar SFCs Vue en herramientas personalizadas.

### `@vitejs/plugin-vue`

- [Documentación](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

El plugin oficial que provee soporte de SFC Vue en Vite.

### `vue-loader`

- [Documentación](https://vue-loader.vuejs.org/)

El cargador oficial que provee soporte de SFC Vue en webpack. Si está utilizando Vue CLI, vea también la [documentación sobre modificar opciones de `vue-loader` en Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).
