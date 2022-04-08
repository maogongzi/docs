# Preguntas frecuentes

## ¿Quién mantiene Vue?

Vue es un proyecto independiente impulsado por la comunidad. Fue creado por [Evan You](https://twitter.com/youyuxi) en 2014 como un proyecto personal paralelo. Hoy en día, Vue es mantenido activamente por [un equipo tanto de de tiempo completo como de miembros voluntarios alrededor de todo el mundo](/about/team), donde Evan se desempeña como líder del proyecto. Puedes obtener más información sobre la historia de Vue en este [documental](https://www.youtube.com/watch?v=OrxmtDw4pVI).

El desarrollo de Vue se financia principalmente a través de patrocinios y hemos sido financieramente sostenibles desde 2016. Si usted o su empresa se benefician de Vue, ¡considere [patrocinarnos](/sponsor/) para apoyar el desarrollo de Vue!

## ¿Qué licencia usa Vue?

Vue es un proyecto gratuito y de código abierto publicado bajo [Licencia MIT](https://opensource.org/licenses/MIT).

## ¿Qué navegadores admite Vue?

La última versión de Vue (3.x) solo admite [navegadores con soporte nativo para ES2015](https://caniuse.com/es6). Esto excluye IE11. Vue 3.x usa funciones de ES2015 a las que no se puede hacer polyfill en navegadores heredados, por lo que si necesita admitir navegadores heredados, deberá usar Vue 2.x en su lugar.

## ¿Es confiable Vue?

Vue es un framework maduro y probado en batalla. Es uno de los frameworks de JavaScript más ampliamente utilizados en producción en la actualidad, con más de 1,5 millones de usuarios en todo el mundo y con cerca de 10 millones de descargas al mes en npm.

Vue es utilizado en producción por organizaciones de renombre en diversas capacidades en todo el mundo, incluidas la Fundación Wikimedia, la NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou y muchas más.

## ¿Vue es rápido?

Vue 3 es uno de los frameworks frontend convencionales de mayor rendimiento y maneja la mayoría de los casos de uso de aplicaciones web con facilidad, sin necesidad de optimizaciones manuales.

En escenarios de pruebas de estrés, Vue supera a React y Angular por un margen decente en [js-framework-benchmark](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html). También va codo a codo con algunos de los frameworks de trabajo de DOM-no-virtual de nivel de producción más rápidos en el benchmark.

Tenga en cuenta que los benchmark sintéticos como el anterior se centran en el rendimiento de renderizado sin procesar con optimizaciones dedicadas y pueden no ser completamente representativos de los resultados de rendimiento del mundo real. Si le preocupa más el rendimiento de carga de la página, aquí está la [auditoría Lighthouse](https://www.webpagetest.org/result/210818_BiDcYB_4a83d7a1f2a7f6fdc76db16a00b4882d/) generada a través de [WebPageTest](https://www.webpagetest.org/lighthouse) para un sitio del mundo real con tecnología Vue con prerrenderizado SSG, hidratación de página completa y navegación SPA del lado del cliente. Obtiene un puntaje de 98 en rendimiento en un Moto G4 emulado con aceleración de CPU 4x en redes 3G.

Puede obtener más información sobre cómo Vue optimiza automáticamente el rendimiento del tiempo de ejecución en la sección [Mecanismo de Renderizado](/guide/extras/rendering-mechanism.html), y cómo optimizar una aplicación Vue en casos especialmente exigentes en la [Guía de Optimización del Rendimiento](/guide/best-practices/performance.html).

## ¿Vue es liviano?

Cuando usas una herramienta de compilación, muchas de las API de Vue son ["sacudibles del árbol"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Por ejemplo, si no utilizas el componente integrado `<Transition>`, no se incluirá en el paquete de producción final.

Una aplicación hello world de Vue que solo usa las API mínimas tiene un tamaño de referencia de solo alrededor de **16kb**, con minificación y compresión brotli. El tamaño real de la aplicación dependerá de la cantidad de funciones opcionales que use del framework. En el caso improbable de que una aplicación use todas las funciones que ofrece Vue, el tamaño total del runtime es de alrededor de **27kb**.

Cuando usamos Vue sin una herramienta de compilación, no solo perdemos lo sacudible del árbol, sino que también tenemos que enviar el compilador de templates al navegador. Esto aumenta el tamaño a alrededor de **41kb**. Por lo tanto, si usas Vue principalmente para mejora progresiva sin un paso de compilación, considera usar [petite-vue](https://github.com/vuejs/petite-vue) (solo **6kb**) en su lugar.

Algunos frameworks, como Svelte, usan una estrategia de compilación que produce resultados extremadamente livianos en escenarios de un solo componente. Sin embargo, [nuestra investigación](https://github.com/yyx990803/vue-svelte-size-analysis) muestra que la diferencia de tamaño depende en gran medida de la cantidad de componentes en la aplicación. Si bien Vue tiene un tamaño de referencia más pesado, genera menos código por componente. En escenarios del mundo real, una aplicación Vue puede terminar siendo más ligera.

## ¿Vue escala?

Si. A pesar de la idea errónea común de que Vue solo es adecuado para casos de uso simples, Vue es perfectamente capaz de manejar aplicaciones a gran escala:

- [Componentes de un Solo Archivo](/guide/scaling-up/sfc) proporcionan un modelo de desarrollo modular que permite desarrollar diferentes partes de una aplicación de forma aislada.

- [Composition API](/guide/reusability/composables) proporciona una integración de primera clase con TypeScript y permite patrones limpios para organizar, extraer y reutilizar lógica compleja.

- [Soporte exhaustivo de herramientas](/guide/scaling-up/tooling.html) garantiza una experiencia de desarrollo fluida a medida que crece la aplicación.

- Menor barrera de entrada y excelente documentación se traducen en menores costos de incorporación y capacitación para los nuevos desarrolladores.

## ¿Cómo contribuyo a Vue?

¡Agradecemos tu interés! Consulta nuestra [Guía de la Comunidad](/about/community-guide.html).

## ¿Cuál es la diferencia entre Vue 2 y Vue 3?

Vue 3 es la versión principal más reciente de Vue. Contiene nuevas características que no están presentes en Vue 2 (sobre todo la composition API) y también contiene cambios importantes que la hacen incompatible con Vue 2. A pesar de las diferencias, la mayor parte de las API de Vue se comparten entre las dos versiones principales, por lo que la mayoría de su conocimiento de Vue 2 seguirá funcionando en Vue 3.

En general, Vue 3 proporciona paquetes de menor tamaño, mejor rendimiento, mejor escalabilidad y mejor compatibilidad con TypeScript/IDE. Si estás comenzando un nuevo proyecto hoy, Vue 3 es la opción recomendada. Solo hay algunas razones para considerar Vue 2 a partir de ahora:

- Necesitas que soporte IE11. Vue 3 aprovecha las características modernas de JavaScript y no es compatible con IE11.

- Estás esperando aún que los proyectos mayores del ecosistema, como Nuxt o Vuetify, lancen versiones estables para Vue 3. Esto es razonable si no deseas utilizar el software en etapa beta. Sin embargo, ten en cuenta que existen otras librerías de componentes para Vue 3 ya estables, como [Quasar](https://quasar.dev/), [Naive UI](https://www.naiveui.com/) y [Element Plus](https://element-plus.org/).

Si tienes la intención de migrar una aplicación Vue 2 existente a Vue 3, consulta la [Guía de Migración de Vue 3](https://v3-migration.vuejs.org/).

Vue 2 recibirá una versión secundaria final (2.7) en 2022. Esta versión secundaria respaldará un subconjunto seleccionado de nuevas características de Vue 3. Después de eso, Vue 2 ingresará al modo de mantenimiento: ya no incluirá nuevas funciones, pero continuará recibiendo correcciones de errores críticos y actualizaciones de seguridad durante otros 18 meses.

## ¿Debo usar Options API o Composition API?

Si eres nuevo en Vue, ofrecemos una comparación de alto nivel entre los dos estilos [aquí](/guide/introduction.html#what-to-choose).

Si previamente utilizaste Options API y estás evaluando en la actualidad la Composition API, consulta [estas FAQ](/guide/extras/composition-api-faq).

## ¿Debo usar JavaScript o TypeScript con Vue?

Si bien Vue en sí está implementado en TypeScript y proporciona compatibilidad de primera clase con TypeScript, no impone una opinión sobre si debes usar TypeScript como usuario.

La compatibilidad con TypeScript es una consideración importante cuando se agregan nuevas funciones a Vue. Las API que están diseñadas con TypeScript en mente suelen ser más fáciles de entender para los IDE y los linters, incluso si tú mismo no estás usando TypeScript. Todo el mundo gana. Las API de Vue también están diseñadas para funcionar de la misma manera tanto en JavaScript como en TypeScript tanto como sea posible.

La adopción de TypeScript implica una compensación entre la complejidad de incorporación y las ganancias de mantenibilidad a largo plazo. La justificación de tal compensación puede variar según los antecedentes de tu equipo y la escala del proyecto, pero Vue no es realmente un factor que influya en la toma de esa decisión.

## ¿Cómo se equipara Vue con los componentes web?

Vue se creó antes de que los componentes web estuvieran disponibles de forma nativa y algunos aspectos del diseño de Vue (por ejemplo, los slots) se inspiraron en el modelo de componentes web.

Las especificaciones de los componentes web son de nivel relativamente bajo, ya que se centran en la definición de elementos personalizados. Como framework, Vue aborda preocupaciones adicionales de alto nivel, como la renderización eficiente del DOM, el manejo del estado reactivo, las herramientas, el enrutamiento del lado del cliente y la renderización del lado del servidor.

Vue también es totalmente compatible con el consumo o la exportación a elementos personalizados nativos; consulta la [Guía Vue y Componentes Web](/guide/extras/web-components) para obtener más detalles.

<!-- ## TODO ¿Cómo se compara Vue con React? -->

<!-- ## TODO ¿Cómo se compara Vue con Angular? -->
