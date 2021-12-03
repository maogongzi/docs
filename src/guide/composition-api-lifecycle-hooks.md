# Hooks de Ciclo de Vida

> Esta sección utiliza [componentes de un solo archivo](single-file-component.html) para ejemplos de códigos

> Esta página asume que usted ya ha leído [Introducción de la API de Composición](composition-api-introduction.html) y [Fundamentos de la Reactividad](reactivity-fundamentals.html). Léalos primero si usted es nuevo con la API de Composición.

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-essentials/lifecycle-hooks" title="Aprender cómo hooks de ciclo de vida funcionan con Vue Mastery">Vea un video gratis sobre hooks de ciclo de vida en Vue Mastery</VideoLesson>

Usted puede acceder a los _hooks_ de ciclo de vida de un componente agregando el prefijo "on" al _hook_.

La siguiente tabla contiene como los _hooks_ de ciclo de vida son invocados dentro de [setup()](composition-api-setup.html):

| API de Opciones   | _Hook_ dentro de `setup` |
| ----------------- | ------------------------ |
| `beforeCreate`    | Not needed\*             |
| `created`         | Not needed\*             |
| `beforeMount`     | `onBeforeMount`          |
| `mounted`         | `onMounted`              |
| `beforeUpdate`    | `onBeforeUpdate`         |
| `updated`         | `onUpdated`              |
| `beforeUnmount`   | `onBeforeUnmount`        |
| `unmounted`       | `onUnmounted`            |
| `errorCaptured`   | `onErrorCaptured`        |
| `renderTracked`   | `onRenderTracked`        |
| `renderTriggered` | `onRenderTriggered`      |
| `activated`       | `onActivated`            |
| `deactivated`     | `onDeactivated`          |

:::tip
Como `setup` es ejecutado alrededor de los _hooks_ de ciclo de vida `beforeCreate` y `created`, usted no necesita definirlos explícitamente. En otras palabras, cualquier código que podría ser escrito dentro de estos deberían ser escrito directamente en la función `setup`.
:::

Estas funciones aceptan un _callback_ que será ejecutado cuando el _hook_ sea invocado por el componente:

```js
// MyBook.vue

export default {
  setup() {
    // montado
    onMounted(() => {
      console.log('¡El componente está montado!')
    })
  }
}
```
