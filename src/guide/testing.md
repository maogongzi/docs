# Pruebas

## Introducción

Cuando se refiere a desarrollar aplicaciones de confianza, las pruebas pueden jugar un papel fundamental en la habilidad de un individuo o equipo para desarrollar nuevas características, refactorizar código, corregir errores, etc. Aunque existen muchas escuelas de pensamiento con las pruebas, hay tres categorías a menudo discutidas en el contexto de aplicaciones web:

- Pruebas Unitarias
- Pruebas de Componente
- Pruebas Punto-a-Punto (E2E)

Esta sección busca proveer una guía para navegar el ecosistema de pruebas y elegir las herramientas adecuadas para su aplicación Vue o librería de componente.

## Pruebas Unitarias

### Introducción

Las pruebas unitarias le permiten probar unidades individuales de código aisladas. El proósito de las pruebas unitarias es garantizar a los desarrolladores la confianza en su código. Escribiendo minuciosamente, pruebas significativas, logra la confianza de que a medida que se crean nuevas funciones o se refactoriza su código, su aplicación seguirá siendo funcional y estable.

Realizar pruebas unitarias en una aplicación Vue no difiere significativamente de probar otro tipo de aplicaciones.

### Elegir su Framework

Debido a que los consejos de pruebas unitarias son a menudo agnóstico al framework, aquí son unas lineamientos para tener en cuenta cuando evalua cuál herramienta de prueba uitaria es mejor para su aplicación.

#### Reporte de errores de primera-clase

Cuando las pruebas fallan, es crítico que su framework de pruebas unitarias provea errores útiles. Este es el trabajo de una librería de aserción. Una aserción con un mensaje de error de alta calidad ayuda a minimizar la cantidad de tiempo que gaste para depurar el problema. Además de simplemente decirle cuál prueba está fallando, estas deberían proveerle contexto de porqué una prueba falla, por ejemplo, cuál es el valor esperado versus el valor recibido.

Algunos frameworks de pruebas unitarias, como Jest, incluyen librerías de aserción. Otros, como Mocha, requieren que instale librerías de aserción por separado (usualmente Chai).

#### Comunidad Activa y equipo

Como la mayoría de los framework de pruebas unitarias son de código abierto, tener una comunidad que es activa puede ser crítico para algunos equipos que mantendrán sus pruebas por un largo período de tiempo y necesitar estar seguros de que un proyecto será mantenido activamente. Además, tener una comunidad activa tiene el beneficio de proveer más soporte cuando ocurra un problema.

### Frameworks

Aunque existen muchas herramientas en el ecosistema, aquí están algunas herramientas comunes de pruebas unitarias que están siendo utilizadas en el ecosistema de Vue.js.

#### Jest

Jest es un framework de pruebas de JavaScript que se enfoca en la simplicidad. Una de sus características únicas es la habilidad de tomar instantáneas de pruebas para proveer un medio alternativo de verificar las unidades de su aplicación.

**Recursos:**

- [Sitio Web Oficial de Jest](https://jestjs.io)
- [Plugin Oficial de Línea de Comandos para Vue 2 - Jest](https://cli.vuejs.org/core-plugins/unit-jest.html)

#### Mocha

Mocha es un framework de pruebas de JavaScript enfocado en ser flexible. Por esta flexibilidad, le permite elegir diferentes librerías para cumplir con otras características comunes como espiando (p. ej., Sinon) y aserciones (p. ej., Chai). Otra característica única de Mocha es que también puede ejecutar pruebas en el navegador además de Node.js.

**Recursos:**

- [Sitio Web Oficial de Mocha](https://mochajs.org)
- [Plugin Oficial de Línea de Comandos para Vue - Mocha](https://cli.vuejs.org/core-plugins/unit-mocha.html)

## Pruebas de Componente

### Introducción

Para probar la mayoría de componentes Vue, estos deben estar montados en el DOM (ya sea virtual o real) para afirmar completamente que están funcionando. Esto es otro concepto agnóstico al framework. Como resultado, los frameworks de pruebas fueron creados para dar a los usuarios la habilidad de realizar esto en una forma confiable mientras proveen también conveniencias específicas de Vue como las integraciones para Vuex, Vue Router y otros plugins de Vue.

### Elegir su Framework

La siguiente sección provee lineamientos en cosas a tomar en cuenta cuando se evalúe cuál framework para pruebas en componentes es mejor para su aplicación.

#### Compatibilidad Óptima con el ecosistema de Vue

No debería ser ninguna sorpresa que uno de los primeros criterios es que una librería de pruebas de componentes debería ser lo más compatible posible con el ecosistema de Vue. Aunque esto pueda parecer comprensivo, algunas áreas de integración claves a tomar en cuenta incluyen componentes de un solo archivo (SFCs), Vuex, Vue Router, y cualquier otro plugin específico de Vue del que dependa su aplicación.

#### Reporte de errores de primera-clase

Cuando las pruebas fallan, es crítico que su framework de pruebas de componentes provea registros de errores útiles para ayudar a minimizar el tiempo que toma a depurar el problema. Además de simplemente decirle cuál prueba está fallando, estos deberían proveerle contexto de por qué una prueba falla, por ejemplo, cuál es el valor esperado versus el valor recibido.

### Recomendaciones

#### Librería de Pruebas de Vue (@testing-library/vue)

La librería de pruebas de Vue se compone de una serie de herramientas enfocadas en probar componentes sin depender en los detalles de implementación. Desarrollada con accesibilidad en mente, su enfoque también hace la refactorización un proceso fácil.

Su principio guía es que mientras más pruebas se parezcan a la forma en que se utiliza el software, más confianza pueden proveer.

**Recursos:**

- [Sitio Web Oficial de la Librería de Pruebas de Vue](https://testing-library.com/docs/vue-testing-library/intro)

#### Utilidades de Prueba de Vue

Las Utilidades de Prueba de Vue es la librería oficial de pruebas de componentes de bajo nivel que fue escrita para proveer a los usuarios acceso a las APIs específicas de Vue. Si es nuevo en pruebas de aplicaciones Vue, le recomendamos utilizar la Librería de Pruebas de Vue, la cual es una abstracción sobre Utilidades de Prueba de Vue.

**Recursos:**

- [Documentación Oficial de Utilidades de Prueba de Vue](https://vue-test-utils.vuejs.org)
- [Manual de Pruebas de Vue](https://lmiller1990.github.io/vue-testing-handbook/v3/#what-is-this-guide) por Lachlan Miller

## Pruebas Punto-a-Punto (E2E)

### Introducción

Aunque las pruebas unitarias proveen a los desarrolladores con un cierto grado de confianza, las pruebas unitarias y de componentes están limitadas por sus habilidades para proporcionar una cobertura holística de una aplicación cuando es desplegada a producción. Como resultado, las pruebas punto-a-punto (E2E) proveen cobertura en lo que, posiblemente, es el aspecto más importante de una aplicación: qué pasa cuando los usuarios utilizan sus aplicaciones.

En otras palabras, las pruebas punto-a-punto validan todas las capas de su aplicación. Esto no incluye únicamente su código de frontend, sino todos los servicios asociados al backend y la infraestructura que son más representativos del entorno en el que estarán sus usuarios. Mediante las pruebas de cómo las acciones del usuario impacta su aplicación, las pruebas punto-a-punto son a menudo la clave para mayor confianza en si una aplicación está funcionando apropiadamente o no.

### Elegir su Framework

While end-to-end (E2E) testing on the web has gained a negative reputation for unreliable (flaky) tests and slowing down development processes, modern E2E tools have made strides forward to create more reliable, interactive, and useful tests. When choosing an E2E testing framework, the following sections provide some guidance on things to keep in mind when choosing a testing framework for your application.

#### Pruebas en Varios Navegadores

Uno de los beneficios principales por los que son conocidas las pruebas punto-a-punto (E2E) es por su habilidad para probar su aplicación en múltiples navegadores. Aunque puede parecer deseable tener cobertura del 100% en varios navegadores, es importante notar que las pruebas en varios navegadores tienen reducciones en el rendimiento sobre los recursos de un equipo debido al tiempo adicional y poder computacional requerido para correrlas consistentemente. Como resultado, es importante ser consciente de esta compensación cuando se elija la cantidad de pruebas en varios navegadores que su aplicación necesita. 

::: tip
Un reciente desarrollo en la captura de problemas específicos de navegadores es utilizar la monitorización de aplicación y herramientas de reporte de error (p. ej., Sentry, LogRocket, etc.)  para navegadores que no son tan comúnmente utilizados (p. ej., < IE11, viejas versiones de Safari, etc.).
:::

#### Bucles de retroalimentación más rápidos

Uno de los principales problemas con las pruebas punto-a-punto (E2E) y el desarrollo es que correr la suite de pruebas entera toma un largo tiempo. Típicamente, esto es realizado solamente en procesos de integración continua y despliegue (CI/CD). Los frameworks moderno de pruebas E2E han ayudado a resolver esto añadiendo características como paralelización, lo que permite a los procesos de CI/CD ejecutar mangnitudes más ráido que antes. Adicionalmente, cuando se desarrolla localmente, la habilidad para ejecutar una prueba selectivamente para la página en la que está trabajando mientras se provee también recarga en caliente de pruebas puede ayudar a acelerar el flujo de trabajo y la productividad de un desarrollador.

#### Experiencia de Depuración de primera clase

Aunque los desarrolladores tradicionalmente dependían de escanear bitácoras en una ventana de terminal para ayudar a determinar qué salió mal en una prueba, los frameworks modernos para pruebas punto-a-punto (E2E) les permiten a los desarrolladores apalancar herramientas con las que están familiarizados, p. ej. herramientas de desarrollo en el navegador. 

#### Visibilidad en modo sin cabeza

Cuando las pruebas punto-a-punto (E2E) son ejecutadas en procesos de integración continua / despliegue, estas son usualmente ejecutadas en navegadores sin cabeza (es decir, no se abre un navegador visible para que el usuario lo vea). Como resultado, cuando los errores ocurren, una característica crítica para la cual los frameworks modernos de pruebas proveen soporte de primera clase es la habilidad de ver las instantáneas y/o videos de sus aplicaciones durante varias etapas de las pruebas para proveer información sobre por qué ocurren los errores. Históricamente, era tedioso mantener estas integraciones.

### Recomendaciones

Aunque existen muchas herramientas en el ecosistema, aquí están algunos frameworks comunes para pruebas punto-a-punto (E2E) que están siendo utilizadas en el ecosistema de Vue.js.

#### Cypress.io

Cypress.io es un framework para pruebas que apunta a mejorar la productividad del desarrollador permitiéndoles probar sus aplicaciones con confianza mientras provee una experiencia de primera clase al desarrollador.

**Recursos:**

- [Sitio Web Oficial de Cypress](https://www.cypress.io)
- [Plugin Oficial de Cypress para la Interfaz de Línea de Comandos de Vue CLI](https://cli.vuejs.org/core-plugins/e2e-cypress.html)
- [Librería de Pruebas de Cypress](https://github.com/testing-library/cypress-testing-library)

#### Nightwatch.js

Nightwatch.js es un framework de pruebas punto-a-punto que puede ser utilizado para probar aplicaciones y sitios web, así como pruebas unitarias y de integración en Node.js.

**Recursos:**

- [Sitio Web Oficial de Nightwatch](https://nightwatchjs.org)
- [Plugin Oficial de Nightwatch para la Interfaz de Línea de Comandos de Vue CLI](https://cli.vuejs.org/core-plugins/e2e-nightwatch.html)

#### Puppeteer

Puppeteer es una librería de Node que provee una API de alto nivel para controlar el navegador y puede utilizarse a la par con otros corredores de prueba (p. ej., Jest) para probar su aplicación.

**Recursos:**

- [Sitio Web Oficial de Puppeteer](https://pptr.dev)

#### TestCafe

TestCafe es un framework para pruebas punto-a-punto basado en Node.js que apunta a proveer una preparación fácil para que los desarrolladores puedan enfocarse en crear pruebas que son fáciles de escribir y confiables.

**Recursos:**

- [Sitio Web Oficial de TestCafe](https://devexpress.github.io/testcafe/)
