# Enrutamiento

## Enrutador Oficial

Para la mayoría de aplicaciones de una sola página, es recomendable utilizar la librería oficialmente soportada [vue-router](https://github.com/vuejs/vue-router-next). Para más detalles, véase la [documentación de Vue Router](https://next.router.vuejs.org/).

## Enrutamiento Sencillo desde Cero

Si usted solo necesita enrutamiento muy sencillo y no desea involucrarse con una librería de enrutamiento con todas características, puede hacerlo renderizando dinámicamente un componente a nivel de página como se muestra a continuación:

```js
const { createApp, h } = Vue

const NotFoundComponent = { template: '<p>No se encuentra la página</p>' }
const HomeComponent = { template: '<p>Página de inicio</p>' }
const AboutComponent = { template: '<p>Página «Acerca de» </p>' }

const routes = {
  '/': HomeComponent,
  '/about': AboutComponent
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).mount('#app')
```

Combinado con la [API de Historial](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API), puede construir un enrutador muy básico pero completamente funcional en el cliente. Para ver eso en práctica, Consulte [esta aplicación de ejemplo](https://github.com/phanan/vue-3.0-simple-routing-example).

## Integrando Enrutadores de Terceros

Si existe un enrutador de terceros que prefiera utilizar, como [Page.js](https://github.com/visionmedia/page.js) o [Director](https://github.com/flatiron/director), la integración es [sencillamente similar](https://github.com/phanan/vue-3.0-simple-routing-example/compare/master...pagejs). Aquí encontrará un [ejemplo completo](https://github.com/phanan/vue-3.0-simple-routing-example/tree/pagejs) empleando Page.js.
