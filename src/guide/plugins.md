# Plugins

Los _Plugins_ son códigos autocontenidos que usualmente agregan funcionalidades de nivel global a Vue. Es o un `objeto` que expone un método `install()`, o una `function`.

No hay un alcance estrictamente definido para un _Plugin_, pero los escenarios comunes dónde los _plugins_ son útiles incluyen:

1. Agregar algunos métodos o propiedades globales. Por ejemplo, [vue-custom-element](https://github.com/karol-f/vue-custom-element).

2. Agregar uno o más recursos globales: directivas/transiciones, etc. (p. ej. [vue-touch](https://github.com/vuejs/vue-touch)).

3. Agregar algunas opciones de componentes mediante mixines globales (p. ej. [vue-router](https://github.com/vuejs/vue-router)).

4. Agregar algunos métodos globales de instancias mediante adjuntarlos a `config.globalProperties`.

5. Una librería que proporciona una API propia, mientras que al mismo tiempo inyecta alguna combinación de lo anterior (e.g. [vue-router](https://github.com/vuejs/vue-router)).

## Escribir un _Plugin_

Para mejor comprender cómo crear sus propios _plugins_ de Vue.js, crearémos una versión de un _plugin_ muy simplificada que mostra cadenas de caracteres que se han prepadado para `i18n`.

Cuando este _plugin_ es agregado a la aplicación, el método `install` será llamado si es un objeto. Si es una función, la misma función será llamado. En ambos casos, recibirá dos parámetros, el objeto `app` resultante de `createApp` de Vue, y las opciones pasadas por el usuario.

Empecemos por establecer el objeto de _plugin_. Es recomendado crearlo en un archivo separado y exportarlo, como mostrado a continuación para mantener la lógica contenida y separada.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // El código del _plugin_ code va aquí
  }
}
```

Queremos realizar una función para traducir las claves disponibles a la aplicación entera, por lo tanto, exponerémoslo utilizando `app.config.globalProperties`.

Esta función recibirá una cadena de caracteres `key`, la que utilizarémos para buscar la cadena de caracteres traducida en las opciones proporcionadas por el usuario.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Asumimos que nuestros usuarios pasarán un objeto que contenga las claves traducidas en el parámetro `options` cuando utilicen el _plugin_. Nuestra función `$translate` tomará una cadena de caracteres como por ejemplo, `greetings.hello`, y mirará dentro de la configuración proporcionada por el usuario y retornará el valor traducido, en este caso, `Bonjour!`

Por ejemplo:

```js
greetings: {
  hello: 'Bonjour!',
}
```

Los _plugins_ también nos permiten utilizar `inject` para proporcionar una función o atributo a los usuarios del _plugin_. Por ejemplo, podemos dejar la aplicación tener acceso al parámetro `options` para que sea capaz de utilizar el objeto de las traducciones.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)
  }
}
```

Los usuarios del _plugin_ ahora son capaz de `inject['i18n']` en sus componentes y acceder el objeto.

Adicionalmente, debido a que tenemos acceso al objeto `app`, todas otras capacidades como utilizar `mixin` y `directive` son disponibles al _plugin_. Para aprender más sobre `createApp` y la instancia de la aplicación, Consulte la [documentación de API de la aplicación](/api/application-api.html).

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.')
        .reduce((o, i) => { if (o) return o[i] }, options)
    }

    app.provide('i18n', options)

    app.directive('my-directive', {
      mounted (el, binding, vnode, oldVnode) {
        // unas lógicas ...
      }
      ...
    })

    app.mixin({
      created() {
        // unas lógicas ...
      }
      ...
    })
  }
}
```

## Utilizar un _Plugin_

Desupés de que una aplicación Vue se haya iniciado con `createApp()`, puede agregar un _plugin_ a su aplicación mediante llamar el método `use()`.

Utilizarémos el `i18nPlugin` creado por nosotros en la sección [Escribir un _Plugin_](#writing-a-plugin) para propósitos de demostración.

El método `use()` toma dos parámetros. Lo primero es el _plugin_ para instalarse, en este caso es `i18nPlugin`.

También automáticamente le impide de utilizar el mismo _plugin_ más de una vez, así que llamarlo múltiples veces al mismo _plugin_ solo lo instalará una vez.

El segundo parámetro es opcional, y depiende de cada _plugin_ particular. En el caso de la demostración `i18nPlugin`, es un objeto con las cadenas de caracteres traducidas.

:::info
Si está utilizando _plugins_ de terceros, como `Vuex` o `Vue Router`, simepre revisar la documentación para comprender qué cosa como el parámetro segundo espere recibir el _plugin_ particular.
:::

```js
import { createApp } from 'vue'
import Root from './App.vue'
import i18nPlugin from './plugins/i18n'

const app = createApp(Root)
const i18nStrings = {
  greetings: {
    hi: 'Hallo!'
  }
}

app.use(i18nPlugin, i18nStrings)
app.mount('#app')
```

Consulte [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) para una enorme colección de _plugins_ y librerías aportados por la comunidad.
