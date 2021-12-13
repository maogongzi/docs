# Despliegue de Producción

::: info
Muchos de los consejos a continuación son activados por defecto si está utilizando [Vue CLI](https://cli.vuejs.org). Esta sección es sólo relevante si está utilizando una configuración personalizada de compilación.
:::

## Encender el Modo de Producción

Durante desarrollo, Vue proporciona un montón de advertencias para ayudarle con los errores comunes y trampas. Sin embargo, estas advertencias se vuelven inútiles en producción y aumentan el tamaño de la carga de su aplicación. Además, algunas verificaciones de estas advertencias tienen pequeños cuestos de tiempo de ejecución que pueden ser evitados en [el modo de producción](https://cli.vuejs.org/guide/mode-and-env.html#modes).

### Sin Herramientas de Compilación

Si está utilizando la compilación completa, es decir, directamente incluyiendo Vue mediante una etiqueta de script sin una herramienta de compilación, asegúrese de utilizar la versión minificada para producción. Se puede encontrar este en la [guía de instalación](/guide/installation.html#cdn).

### Con Herramientas de Compilación

Cuando se utiliza una herramienta de compilación como Webpack o Browserify, el modo de producción será determinado mediante `process.env.NODE_ENV` dentro del fuente de código de Vue, y será en modo de desarrollo por defecto. Ambos herramientas proporcionan métodos para sobreescribir esta variable para habilitar el modo de producción de Vue, y advertencias serán eliminadas por los minificadores durante el proceso de compilación. Vue CLI tiene este configurado antes de mano para usted, pero sería beneficioso saber cómo se haga:

#### Webpack

En Webpack 4+, puede utilizar la opción `mode`:

```js
module.exports = {
  mode: 'production'
}
```

#### Browserify

- Ejecuta su comando de compilación con la variable de entorno actual `NODE_ENV` configurada como `"production"`. Este informa a `vueify` a evitar incluir recarga en caliente y los códigos relacionados con el desarrollo.

- Aplicar una transformación global de [envify](https://github.com/hughsk/envify) a su compilación. Este le permite al minificador a eliminar todas las advertencias envueltas dentro de los bloques condicionales de variables de entorno en el fuente de código de Vue. Por ejemplo:

  ```bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- O, utiliza [envify](https://github.com/hughsk/envify) con Gulp:

  ```js
  // Utilizar el módulo _custom_ de _envify_ para especificar variables de entorno
  const envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Requerida para procesar archivos de node_modules
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- o, utiliza [envify](https://github.com/hughsk/envify) con Grunt y [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ```js
  // Utilizar el módulo _custom_ de _envify_ para especificar variables de entorno
  const envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Función para desviarse del orden por defecto de grunt-browserify
        configure: (b) =>
          b
            .transform('vueify')
            .transform(
              // Requerida para procesar archivos de node_modules
              { global: true },
              envify({ NODE_ENV: 'production' })
            )
            .bundle()
      }
    }
  }
  ```

#### Rollup

Utiliza [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
const replace = require('@rollup/plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Compilar Plantillas Antes de Mano

Cuando se utiliza plantillas en DOM o plantillas de cadena de caracteres en JavaScript, la compilación _template-to-render-function_ es realizada al vuelo. Usualmente este es suficientemente rápido en la mayoría de casos, pero sería mejor evitado si su aplicación es sensible al rendimiento.

La más fácil manera para compilar plantillas antes de mano es utilizar [componentes de un solo archivo](/guide/single-file-component.html), las configuraciones de compilación asociados automáticamente realizan compilación antes de mano para usted, por lo tanto el código compilado contiene las funciones ya compiladas en vez de plantillas crudas de cadenas de caracteres.

Si está utilizando Webpack y prefiere separar JavaScript y los archivos de plantillas, puede utilizar [vue-template-loader](https://github.com/ktsn/vue-template-loader), lo cual también transforma los archivos de plantillas en JavaScript funciones de _render_ durante el proceso de compilación.

## Extraer CSS de Componentes

Cuando se utiliza componentes de un solo archivo, el CSS dentro de componentes son inyecctadas dinámicamente como etiquetas de `<style>` mediante JavaScript. Este tiene un pequeño cuesto de tiempo de ejecución, y si está utilizando renderización en el lado del servidor (ssr), resultará un "flash de contenido sin estilos". Extraer el CSS por todos componentes en el mismo archivo evitará estos problemas, y también resultará una mejor minificación y _caching_ de CSS.

Refiérase a las documentaciones respectivas de las herramientas de compilación para ver cómo se haga:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

## Rastregar Errores de Tiempo de Ejecución

Si un error de tiempo de ejecución ocurre durante la renderización de un componente, será pasado a la función de configuración global `app.config.errorHandler` si se haya establecido. Podría ser una buena idea apalancar este _hook_ junto con un servicios de seguimiento de errores como [Sentry](https://sentry.io), lo cual proporciona [una integración oficial](https://sentry.io/for/vue/) para Vue.
