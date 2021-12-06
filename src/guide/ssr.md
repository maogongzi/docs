# Renderización en el lado del Servidor

## La Guía Completa al Renderización en el lado del Servidor

Hemos creado una guía independiente para crear aplicaciones de Vue que sean renderizadas en el lado del servidor. Esta es una guía profunda para todos aquellos que están familiarizados con el desarrollo de Vue en el lado cliente, desarrollo con Node.js en el lado del servidor y webpack. Échele un vistazo [aquí](/guide/ssr/introduction.html).

## Nuxt.js

Configurar apropiadamente todos los aspectos discutidos de una aplicación lista para producción renderizada en el lado del servidor puede ser una tarea desalentadora. Por suerte, hay un excelente proyecto de la comunidad que busca hacer este proceso más sencillo: [Nuxt.js](https://nuxtjs.org/). Nuxt.js es un framework de alto nivel construido sobre el ecosistema de Vue y que provee una experiencia de desarrollo extremadamente sencilla para escribir aplicaciones universales con Vue. Mejor aún, ¡usted puede utilizarlo como un generador de sitios web estáticos (con páginas escritas como Single File Components)! Le recomendamos probarlo.

## Quasar Framework SSR + PWA

[Quasar Framework](https://quasar.dev) generará una aplicación renderizada en el lado del servidor (con posibilidad de PWA) que apalanca su mejor sistema de compilación, configuración sensible y extensibilidad para el desarrollador para hacer que el diseño y la construcción de su idea algo muy sencillo. Con más de cien componentes específicos en cumplimiento con "Material Design 2.0", usted puede decidir cuáles deben ser ejecutados en el servidor, cuáles están disponibles en el navegador, e incluso manejar las etiquetas `<meta>` de su sitio. Quasar es un entorno de desarrollo basado en Node.js y webpack que sobrecarga y y simplifica el desarrollo rápido de aplicaciones SPA, PWA, SSR, Electron, Capacitor y Cordova, todo con el mismo código fuente.

## Vite SSR

[Vite](https://vitejs.dev/) es un nuevo especie de herramienta de compilación de frontend que notablemente mejora la experiencia de desarrollo de frontend. Consiste en dos partes principales:

- Un servidor de desarrollo que sirve sus archivos de fuente sobre módulos ES nativos, junto con características integradas abundantes y reemplazo de módulo activo (HMR) increíblemente rápido.

- Un comando integrado que empaqueta su código con [Rollup](https://rollupjs.org/), preconfigurado para generar recursos estáticos optimizados en alto grado para producción.

Vite también proporciona [sorporte integrado para renderización en el lado del servidor](https://vitejs.dev/guide/ssr.html). Puede encontrar un proyecto de ejemplo con Vue [aquí](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)
