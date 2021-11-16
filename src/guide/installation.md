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

Si quiere evitar utilizar herramientas de construcción pero no puede acceder a un CDN en producción puede descargar el archivo pertinente de `.js` y alojarlo utilizando su propio servidor. Puede luego incluirlo mediante un tag `<script>`, justo como con el enfoque CDN.

Pueden ser navegado y descargado los archivos por un CDN como [unpkg](https://unpkg.com/browse/vue@next/dist/) o [jsDelivr](https://cdn.jsdelivr.net/npm/vue@next/dist/). Los varios archivos diferentes serán  [explicado más tarde](#explanation-of-different-builds) pero tipicamente quería descargar ambos de el construcción desarrollamiento y el de producción.

## npm

npm es el método recomendado de instalación cuando construir aplicaciones Vue a gran escala. Se combina muy bin con paquete de módulos como [webpack](https://webpack.js.org/) o [Rollup](https://rollupjs.org/).

```bash
# la última estable
$ npm install vue@next
```

Vue tambien proporciona herramientas correspondientes para crear [Componentes de Único Archivo](../guide/single-file-component.html) (SFCs). Si quiere utilizar SFC también necesita instalar `@vue/compiler-sfc`:

```bash
$ npm install -D @vue/compiler-sfc
```

Si viene de Vue 2 nota que `vue-template-compiler` está replazado por `@vue/compiler-sfc`

Además de `@vue/compiler-sfc`, podría necesitar un cargador or plugin de SFC para el paquete de módulos elegido por usted. Vea [Documento de SFC](../guide/single-file-component.html) por más detalles.

En la mayoría de los casos, el método preferido para crear una paquete de Webpack con minimal configuraciones es utilizar el CLI de Vue.

## CLI

Vue proporciona un [CLI Oficial](https://github.com/vuejs/vue-cli) para organizar rápidamente Single Page Applicaciones ambiciosos. Lo cual proporciona configuraciones de construcción originalmente para un flujo de trabajo moderno de frontend. Toma solo algunos minutos para establecer todos con hot-reload, lint-on-save, y construcciones preparados para producción. Vea [El Documento de Vue CLI](https://cli.vuejs.org) por más detalles.

::: tip
The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Vue or front-end build tools, we strongly suggest going through [the guide](./introduction.html) without any build tools before using the CLI.
:::

For Vue 3, you should use Vue CLI v4.5 available on `npm` as `@vue/cli`. To upgrade, you need to reinstall the latest version of `@vue/cli` globally:

```bash
yarn global add @vue/cli
# OR
npm install -g @vue/cli
```

Then in the Vue projects, run

```bash
vue upgrade --next
```

## Vite

[Vite](https://github.com/vitejs/vite) is a web development build tool that allows for lightning fast serving of code due to its native ES Module import approach.

Vue projects can quickly be set up with Vite by running the following commands in your terminal.

With npm:

```bash
# npm 6.x
$ npm init vite@latest <project-name> --template vue

# npm 7+, extra double-dash is needed:
$ npm init vite@latest <project-name> -- --template vue

$ cd <project-name>
$ npm install
$ npm run dev
```

Or with Yarn:

```bash
$ yarn create vite <project-name> --template vue
$ cd <project-name>
$ yarn
$ yarn dev
```

## Explanation of Different Builds

In the [`dist/` directory of the npm package](https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/) you will find many different builds of Vue.js. Here is an overview of which `dist` file should be used depending on the use-case.

### From CDN or without a Bundler

#### `vue(.runtime).global(.prod).js`:

- For direct use via `<script src="...">` in the browser, exposes the Vue global.
- In-browser template compilation:
  - `vue.global.js` is the "full" build that includes both the compiler and the runtime so it supports compiling templates on the fly.
  - `vue.runtime.global.js` contains only the runtime and requires templates to be pre-compiled during a build step.
- Inlines all Vue core internal packages - i.e. it's a single file with no dependencies on other files. This means you must import everything from this file and this file only to ensure you are getting the same instance of code.
- Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.prod.js` files for production.

:::tip Note
Global builds are not [UMD](https://github.com/umdjs/umd) builds. They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and are only meant for direct use via `<script src="...">`.
:::

#### `vue(.runtime).esm-browser(.prod).js`:

- For usage via native ES modules imports (in browser via `<script type="module">`).
- Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build.

### With a Bundler

#### `vue(.runtime).esm-bundler.js`:

- For use with bundlers like `webpack`, `rollup` and `parcel`.
- Leaves prod/dev branches with `process.env.NODE_ENV guards` (must be replaced by bundler)
- Does not ship minified builds (to be done together with the rest of the code after bundling)
- Imports dependencies (e.g. `@vue/runtime-core`, `@vue/runtime-compiler`)
  - Imported dependencies are also esm-bundler builds and will in turn import their dependencies (e.g. @vue/runtime-core imports @vue/reactivity)
  - This means you **can** install/import these deps individually without ending up with different instances of these dependencies, but you must make sure they all resolve to the same version.
- In-browser template compilation:
  - `vue.runtime.esm-bundler.js` **(default)** is runtime only, and requires all templates to be pre-compiled. This is the default entry for bundlers (via module field in `package.json`) because when using a bundler templates are typically pre-compiled (e.g. in `*.vue` files).
  - `vue.esm-bundler.js`: includes the runtime compiler. Use this if you are using a bundler but still want runtime template compilation (e.g. in-DOM templates or templates via inline JavaScript strings). You will need to configure your bundler to alias vue to this file.

### For Server-Side Rendering

#### `vue.cjs(.prod).js`:

- For use in Node.js server-side rendering via `require()`.
- If you bundle your app with webpack with `target: 'node'` and properly externalize `vue`, this is the build that will be loaded.
- The dev/prod files are pre-built, but the appropriate file is automatically required based on `process.env.NODE_ENV`.

## Runtime + Compiler vs. Runtime-only

If you need to compile templates on the client (e.g. passing a string to the template option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

```js
// this requires the compiler
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// this does not
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

When using `vue-loader`, templates inside `*.vue` files are pre-compiled into JavaScript at build time. You don’t really need the compiler in the final bundle, and can therefore use the runtime-only build.
