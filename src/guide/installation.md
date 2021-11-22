# Instalación

Vue.js es construido por diseño para que sea adoptable incrementamente. Esto significa que puede ser integrado en un proyecto en múltiples formas dependiendo de los requisitos.

Hay cuatro formas primarias para añadir Vue.js a un proyecto:

1. Importarlo como un [paquete de CDN](#cdn) en la página
2. Descargar los archivos JavaScript y [alojarlos por sí mismo](#download-and-self-host)
3. Instalarlo utilizando [npm](#npm)
4. Utiliza el [CLI](#cli) oficial para organizar un proyecto, lo cual proporciona configuraciones de construcción originalmente para un flujo de trabajo moderno de frontend(por ejemplo, hot-reload, lint-on-save, et cetera)

## Notas de Lanzamiento

Última Versión: ![npm](https://img.shields.io/npm/v/vue/next.svg)

Las notas de lanzamiento detalladas para cada versión se encuentran en [GitHub](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md).

## Vue Devtools

> Actualmente en fase Beta - Vuex y la integración con Router aún son trabajo en progreso
 
<VideoLesson href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3?friend=vuejs" title="Aprender como instalar Vue Devtools en Vue School">Aprender como instalar y utilizar Vue Devtools en un lección gratis de Vue School</VideoLesson>

Cuando utiliza Vue, recomendamos instalar también las [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) en su navegador, permitiéndole inspeccionar y depurar sus aplicaciones Vue mediante una interfaz más amigable al usuario.

[Obtener la Extensión de Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)

[Obtener el Addon de Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

[Obtener la aplicación independiente de Electron](https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-electron/README.md)

## CDN

Para prototipos o con fines de aprendizaje, puede utilizar la última versión con:

```html
<script src="https://unpkg.com/vue@next"></script>
```

Para producción, recomendamos vincular a una versión específica para evitar rupturas inesperadas de nuevas versiones.

## Descargar y Auto Alojamiento

Si quiere evitar utilizar herramientas de construcción pero no puede acceder a un CDN en producción puede descargar el archivo pertinente de `.js` y alojarlo utilizando su propio servidor. Puede luego incluirlo mediante una etiqueta `<script>`, justo como con el enfoque CDN.

Pueden ser navegado y descargado los archivos por un CDN como [unpkg](https://unpkg.com/browse/vue@next/dist/) o [jsDelivr](https://cdn.jsdelivr.net/npm/vue@next/dist/). Los varios archivos diferentes serán  [explicado más tarde](#explanation-of-different-builds) pero tipicamente quería descargar ambos de el construcción desarrollamiento y el de producción.

## npm

npm es el método recomendado de instalación cuando construir aplicaciones Vue a gran escala. Se combina muy bien con empaquetador de módulos como [webpack](https://webpack.js.org/) o [Rollup](https://rollupjs.org/).

```bash
# la última estable
$ npm install vue@next
```

Vue tambien proporciona herramientas correspondientes para crear [Componentes de Único Archivo](../guide/single-file-component.html) (SFCs). Si quiere utilizar SFC también necesita instalar `@vue/compiler-sfc`:

```bash
$ npm install -D @vue/compiler-sfc
```

Si viene de Vue 2 nota que `vue-template-compiler` está replazado por `@vue/compiler-sfc`

Además de `@vue/compiler-sfc`, podría necesitar un cargador or plugin de SFC para el empaquetador de módulos elegido por usted. Vea [Documento de SFC](../guide/single-file-component.html) para más detalles.

En la mayoría de los casos, el método preferido para crear una paquete de Webpack con minimal configuraciones es utilizar el CLI de Vue.

## CLI

Vue proporciona un [CLI Oficial](https://cli.vuejs.org/) para organizar rápidamente Single Page Aplicaciones ambiciosos. Lo cual proporciona configuraciones de construcción originalmente para un flujo de trabajo moderno de frontend. Toma solo unos minutos para establecer todos con hot-reload, lint-on-save, y compilaciones preparados para producción.

::: tip
El CLI(interfaz de línea de comandos) asume que usted posee conocimiento previo de Node.js y las herramientas de compilación asociadas. Si usted es nuevo en Vue o en el manejo de las herramientas de compilación de front-end, le recomendamos leer [la guía](./introduction.html) sin ninguna herramienta de compilación antes de usar el CLI.
:::

Para Vue 3, usted debería utilizar Vue CLI v4.5 disponible en `npm` as `@vue/cli`. Para actualizar, necesita reinstalar la última versión de `@vue/cli`  globalmente:

```bash
yarn global add @vue/cli
# OR
npm install -g @vue/cli
```

Luego, en los proyectos de Vue, ejecute

```bash
vue upgrade --next
```

## Vite

[Vite](https://vitejs.dev/) es una herramienta de desarrollo web que le permite el rápido despliegue del código debido a su enfoque nativo para importación de Módulos ES.

Los proyectos de Vue pueden ser rápidamente configurados con Vit ejecutando los siguientes comandos en su terminal.

Con NPM:

```bash
# npm 6.x
$ npm init vite@latest <project-name> --template vue

# npm 7+, doble guion adicional es requerido:
$ npm init vite@latest <project-name> -- --template vue

$ cd <project-name>
$ npm install
$ npm run dev
```

O con Yarn:

```bash
$ yarn create vite <project-name> --template vue
$ cd <project-name>
$ yarn
$ yarn dev
```

## Explicación de las Distintas Compilaciones

En el [directorio `dist/` del paquete NPM](https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/) encontrará varias compilaciones de Vue.js. Aquí está una visión general de cuál archivo del directorio `dist` debería ser utilizado dependiendo del caso de uso.

### Desde un CDN o sin un Empaquetador

#### `vue(.runtime).global(.prod).js`:

- Para uso directo mediante `<script src="...">` en el navegador, expone la variable Vue globalmente.
- Compilación de plantillas dentro del navegador:
  - `vue.global.js` es la compilación "completa" que incluye ambos, el compilador y el entorno de ejecución, así que soporta compilar plantillas sobre la marcha.
  - `vue.runtime.global.js` contiene solo el entorno de ejecución y requiere que las plantillas sean compiladas antes de mano durante la etapa de compilación.
- Todos los paquetes internos del núcleo de Vue en líneas, es decir, un único archivo sin dependencias de otros. Esto significa que debe importar todo solo desde este archivo para garantizar que está obteniendo la misma instancia de código.
- Contiene las ramas prod/dev codificadas, y la compilación de production está minificada antes de mano. Utilice los archivos `*.prod.js` para producción.

:::tip Nota
Las compilaciones globales no son compilaciones [UMD](https://github.com/umdjs/umd). Están compilados como [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) y solo están destinadas para uso directo mediante `<script src="...">`.
:::

#### `vue(.runtime).esm-browser(.prod).js`:

- Para uso mediante la importación de módulos nativos de ES (en el navegador mediante `<script type="module">`).
- Comparte la misma compilación del entorno de ejecución, declaración de dependencias en línea y el comportamiento codificado de prod/dev con la compilación global.

### Con un Empaquetador

#### `vue(.runtime).esm-bundler.js`:

- Para uso con empaquetadores como `webpack`, `rollup` y `parcel`.
- Deja las ramas prod/dev con `la guardia de process.env.NODE_ENV` (debe ser reemplazado por el empaquetador)
- No entrega las compilaciones minificadas (por hacer junto con el resto del código después de empaquetar)
- Importa las dependencias (p. ej. `@vue/runtime-core`, `@vue/runtime-compiler`)
  - Las dependencias importadas son también compilaciones de _esm-bundler_ y a su vez importarán sus dependencias (p. ej. @vue/runtime-core importa @vue/reactivity)
  - Esto significa que usted **puede** instalar/importar estas dependencias sin terminar con instancias diferentes de ellas, pero debe asegurarse de que todas ellas resuelven a la misma versión.
- Compilación de plantillas dentro del navegador:
  - `vue.runtime.esm-bundler.js` **(por defecto)** es solo entorno de ejecución, y requiere que todas las plantillas sean compiladas antes de mano. Esta es la entrada por defecto para los empaquetadores (mediante el campo módulo en `package.json`) debido a que cuando se utiliza un empaquetador las plantillas son típicamente compiladas antes de mano (p. ej. en los archivos `*.vue`).
  - `vue.esm-bundler.js`: incluye el compilador del entorno de ejecución. Use esto si está empleando un empaquetador pero todavía quiere la compilación de plantillas en tiempo de ejecución (p. ej. plantillas dentro del DOM o plantillas mediante cadena de caracteres en línea de JavaScript). Necesitará configurar su empaquetador para establecer el alias Vue a este archivo.

### Para el Renderización en el lado del Servidor

#### `vue.cjs(.prod).js`:

- Para uso en renderización en el lado del servidor en Node.js mediante `require()`.
- Si usted empaqueta su aplicación con Webpack utilizando `target: 'node'` y externaliza correctamente `vue`, esta será la compilación que será cargada.
- Los archivos dev/prod son compilados antes de mano, pero el archivo apropiado es requerido automáticamente basado en `process.env.NODE_ENV`.

## Entorno en tiempo de Ejecución + Compilador vs. Solo Entorno en tiempo de Ejecución

Si usted necesita compilar plantillas en el cliente (p. ej. pasando una cadena de caracteres a la opción de plantilla, o montando en un elemento utilizando su HTML dentro del DOM como la plantilla), necesitará el compilador y por lo tanto la compilación completa:

```js
// esto requiere el compilador
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// esto no
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

Cuando se esté utilizando `vue-loader`, las plantillas dentro de archivos `*.vue` son compiladas antes de mano a JavaScript en tiempo de compilación. No necesita realmente el compilador en el compilación final, por lo tanto, puede utilizar la compilación solo entorno en tiempo de ejecución.
