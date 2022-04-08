---
footer: false
---

# Inicio Rápido

Según tu caso de uso y preferencias, puedes usar Vue con o sin un paso de compilación.

## Con Herramientas de Construcción

Una configuración de desarrollo nos permite usar los [Componentes de un Solo Archivo](/guide/scaling-up/sfc) (SFC) de Vue. La configuración de desarrollo oficial de Vue se basa en [Vite](https://vitejs.dev), una herramienta de compilación frontend que es moderna, ligera y extremadamente rápida.

### En Línea

Puedes probar Vue con SFC en línea en [StackBlitz](https://vite.new/vue). StackBlitz ejecuta la configuración de desarrollo basada en Vite directamente en el navegador, por lo que es casi idéntica a la configuración local pero no requiere instalar nada en tu máquina.

### En Local

:::tip Prerrequisitos

- Familiaridad con la línea de comandos.
- Instalar [Node.js](https://nodejs.org/)
  :::

Para crear un proyecto Vue habilitado para herramientas de compilación en tu máquina, ejecuta el siguiente comando en tu terminal (sin el signo `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará y ejecutará [create-vue](https://github.com/vuejs/create-vue), la herramienta estructural oficial de proyectos de Vue. Se te consultará por una serie de características opcionales, como TypeScript y soporte para testing:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Cypress for both Unit and End-to-End testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formating? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Si no estás seguro sobre alguna opción, simplemente escoge `No` haciendo enter. Una vez que el proyecto esté creado, sigue las instrucciones para instalar las dependencias e inicializar el servidor de desarrollo:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

¡Ahora deberías tener en ejecución tu primer proyecto de Vue! Hay algunos consejos adicionales:

- La configuración de IDE recomendada es [Visual Studio Code](https://code.visualstudio.com/) + [Extensión Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar). También está disponible para [WebStorm](https://www.jetbrains.com/webstorm/).
- En la [Guía de Herramientas](/guide/scaling-up/tooling.html) se analizan más detalles sobre las herramientas, incluida la integración con frameworks backend.
- Para obtener más información sobre la herramienta de compilación subyacente Vite, consulta la [documentación de Vite](https://vitejs.dev).
- Si eliges usar TypeScript, consulta la [Guía de Uso de TypeScript](typescript/overview.html).

Cuando estés listo para enviar tu aplicación a producción, ejecuta lo siguiente:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Esto creará una compilación de tu aplicación lista para producción en el directorio `./dist` del proyecto. Consulta la [Guía de Implementación de Producción](/guide/best-practices/production-deployment.html) para obtener más información sobre cómo enviar tu aplicación a producción.

[Próximos Pasos >](#next-steps)

## Sin Herramientas de Construcción

Para comenzar con Vue sin un paso de compilación, simplemente copia el siguiente código en un archivo HTML y ábrelo en tu navegador:

```html
<script src="https://unpkg.com/vue@3"></script>

<div id="app">{{ message }}</div>

<script>
  Vue.createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

El ejemplo anterior usa la compilación global de Vue donde todas las API están expuestas bajo la variable global `Vue`.

Si bien la compilación global funciona, usaremos principalmente la sintaxis de [módulos ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) en el resto de la documentación para mantener la coherencia. Para usar Vue sobre módulos ES nativos, usa el siguiente HTML en lugar del anterior:

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

Observa cómo podemos importar directamente desde `'vue'` en nuestro código; esto es posible gracias al bloque `<script type="importmap">`, que aprovecha una característica nativa del navegador llamada [Import Maps](https://caniuse.com/import-maps). Actualmente, la importación de mapas solo está disponible en navegadores basados ​​en Chromium, por lo que recomendamos usar Chrome o Edge durante el proceso de aprendizaje. Si tu navegador preferido aún no admite la importación de mapas, puedes usar polyfill con [es-module-shims](https://github.com/guybedford/es-module-shims).

Puedes agregar entradas para otras dependencias al mapa de importación; solo asegúrate de que apunten a la versión de módulos ES de la biblioteca que pretendes usar.

:::tip No para producción
La configuración basada en la importación de mapas está diseñada solo para el aprendizaje; si tienes la intención de usar Vue sin herramientas de compilación en producción, asegúrate de consultar la [Guía de Implementación de Producción](/guide/best-practices/production-deployment.html#).
:::

### Servicio a través de HTTP

A medida que profundizamos en la guía, es posible que necesitemos dividir nuestro código en archivos JavaScript separados para que sean más fáciles de manejar. Por ejemplo:

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

Para que esto funcione, debe servir tu HTML sobre el protocolo `http://` en lugar del protocolo `file://`. Para iniciar un servidor HTTP local, primero instala [Node.js](https://nodejs.org/en/), y luego ejecuta `npx serve` desde la línea de comandos en el mismo directorio donde se encuentra tu archivo HTML. Puedes usar también cualquier otro servidor HTTP que pueda servir archivos estáticos con los tipos MIME correctos.

Es posible que hayas notado que la template del componente importado está integrada como un string de JavaScript. Si estás utilizando VSCode, puedes instalar la extensión [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) y prefijar las cadenas con un comentario `/*html*/` para que sea resaltada la sintaxis de los mismos.

## Próximos Pasos

Si te saltaste la [Introducción](/guide/introduction), te recomendamos encarecidamente que la leas antes de pasar al resto de la documentación.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Continúa con la Guía</p>
    <p class="next-steps-caption">La guía te lleva a través de cada aspecto del framework con todos sus detalles.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Prueba el Tutorial</p>
    <p class="next-steps-caption">Para aquellos que prefieren aprender las cosas de forma práctica.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Mira los Ejemplos</p>
    <p class="next-steps-caption">Explora ejemplos de las principales características y las tareas comunes de la UI.</p>
  </a>
</div>
