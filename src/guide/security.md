# Seguridad

## Reportar Vulnerabilidades

Cuando una vulnerabilidad es reportada, se transforma inmediatamente en nuestra principal preocupación, con un contribuidor de tiempo completo deja todos al lado para trabajar solo en esta. Para reportar una vulnerabilidad, por favor envíe un email a [security@vuejs.org](mailto:security@vuejs.org).

Mientras el descubrimiento de nuevas vulnerabilidades es raro, también recomendamos siempre utilizar la última versión de Vue y sus librerías oficiales de complementos para aseguar que su aplicación mantenga lo más segura posible.

## Norma N°1: No utilice nunca plantillas que no son de confianza

La norma de seguridad más fundamental cuando se utiliza Vue es **no utilice nunca contenidos que no son de confianza como la plantilla de su componente**. Hacerlo es equivalente a permitir ejecución arbitraria de JavaScript en su aplicación, y peor, puede conducir a las brechas en el servidor si el código es ejecutido durante la renderización en el lado del servidor. Un ejemplo de tal uso:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NUNCA HACERLO
}).mount('#app')
```

Las plantillas Vue son compilada a JavaScript, y expresiones dentro de plantillas son ejecutadas como un parte del proceso de la renderización. Aunque las expresiones son evauladas contra un contexto específico de renderización, debido a que la complejidad del entorno potencial de ejecución global, es impráctico para un framework como Vue para protegerle complementamente de las ejecuciones potenciales de códigos maliciosos sin incurrir sobrecarga de rendimiento irreal. La más directa manera para evitar esta categoría de problemas por completo es aseguarse que los contenidos de sus plantillas Vue son siempre confiables y controlados completamente por usted mismo.

## Que hace Vue para protegerle

### El contenido HTML

Pese a lo que se utiliza, tanto plantilla como función de _render_, el contenido será automáticamente escapado, lo que significa que en la siguiente plantilla:

```html
<h1>{{ userProvidedString }}</h1>
```

si `userProvidedString` contiene:

```js
'<script>alert("hi")</script>'
```

entonces sería escapada al siguiente HTML:

```html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

por lo tanto previene la inyección de _script_. Este escape es realizado utilizando las APIs nativos del navegador, como `textContent`, así una vulnerabilidad sólo puede existir si el navegador mismo es vulnerable.

### Las Vinculaciones de Atributos

De la misma manera, las vinculaciones dinámicas de atributos son también automáticamente escapadas. Lo que significa que en la siguiente plantilla:

```html
<h1 :title="userProvidedString">
  hola
</h1>
```

si `userProvidedString` contiene:

```js
'" onclick="alert(\'hi\')'
```

entonces sería escapado al siguiente HTML:

```html
&quot; onclick=&quot;alert('hi')
```

por lo tanto previene que el cierre del atributo `title` inyecte nuevo, arbitrario HTML. Este escape es realizado utilizando las APIs nativos del navegador, como `setAttribute`, así una vulnerabilidad sólo puede existir si el navegador mismo es vulnerable.

## Peligros Potenciales

En cualquiera aplicación web, permitir la ejecución del contenido sin desinfectar, proporcionado por el usuario como HTML, CSS o JavaScript puede ser peligroso, por lo tanto, eso debe ser evitado siempre que sea posible. Pero también hay casos en que algunos riesgos pueden ser aceptables.

Por ejemplo, los servicios como CodePen y JSFiddle permite que el contenido proporcionado por el usuario sea ejecutado, pero eso ocurre en un contexto previsto, y en un entorno de recinto de seguridad (sandboxed) dentro de _iframes_. en los casos cuando una característica importante requiere alguno nivel de vulnerabilidad por naturaleza, depende de su equipo para evaluar la importancia de la característica contra los escenarios más peores que pueda provocar la vulnerabilidad.

### Inyectar HTML

Como ha aprendido anteriormente, Vue escapa automáticamente el contenido HTML, le previene de inyectar HTML ejecutable por accidente en su aplicación. Sin embargo, in casos dónde sabe que el HTML es seguro, puede renderizar el contenido HTML explícitamente:

- Utiliando una plantilla:

  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- Utilizando un función _render_:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Utilizando un función _render_ con JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::tip
Note que el HTML proporcionado por el usuario no puede nunca considerado 100% seguro salvo que es en un entorno de recinto de seguridad (sandbox) dentro de _iframe_ o en una parte de la aplicación dónde solo el usuario quién escribió aquel HTML puede ser expuesto a el. Además, permitir a los usuarios escribir sus propias plantillas Vue puede provocar los mismos riesgos.
:::

### Inyectar URLs

En un URL como este:

```html
<a :href="userProvidedUrl">
  hazme clic
</a>
```

Hay un problema potencial de seguridad  si el _URL_ no se ha "desinfectado (sanitized)" para prevenir ejecución de JavaScript utilizando `javascript:`. Hay librerías como [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) para ayudar con esto, pero tenga en cuenta:

:::tip
Si está realizando desinfección de URL en el lado _frontend_, ya tiene un problema de seguridad. los _URLs_ proporcionados por el usuario deberían ser desinfectados por su _backend_ incluso antes de guardarse en la base de datos. Entonces el problema es evitado para _cada_ cliente conectado a su API, incluye las aplicaciones móviles nativas. También tenga en cuenta que incluso con los _URLs_ desinfectados, Vue no puede garantizarle que apunten a direcciones seguras.
:::

### Inyectar Estilos (Styles)

Mire el siguiente ejemplo:

```html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  Hazme clic
</a>
```

Asumamos que `sanitizedUrl` ya ha sido desinfectado, así que es definitivamente un _URL_ real y no es JavaScript. Con `userProvidedStyles`, los usuarios maliciosos podrían todavía proporcionar CSS para "clickjacking (secuestro de clic)", por ejemplo, decorar el enlace como una caja transparente sobre el botón "Log in". Entonces si `https://user-controlled-website.com/` es construido para asemejar la página de inicio de sesión de su aplicación, ya podrían haber capturado la información real de inicio de sesión de un usuario.

Podría ser capaz de imaginar cómo permitir contenido proporcionado por el usuario para un elemento `<style>` pueda provocar una vulnerabilidad más fuerte, dado que el usuario obtenga el control completo sobre cómo decorar la página entera. Eso es porque Vue previene la renderización de etiquetas de style dentro de plantillas, como esto:

```html
<style>{{ userProvidedStyles }}</style>
```

Para mantener su usuarios completamente seguros de _clickjacking_, recomendamos solo permitir el control completo sobre CSS dentro de un _iframe_ que forma un entorno de recinto de seguridad (sandboxed). Alternativamente, cuando proviene al usuario el control mediante una vinculación de estilos (style), recomendamos utilizar la [sintaxis de objeto](class-and-style.html#object-syntax-2) y solo permitir que los usuarios proporcionen valores para propiedades específicas que sean seguros para ellos para controlar, como esto:

```html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  Hazme clic
</a>
```

### Inyectar JavaScript

Desaconsejamos fuertemente renderizar un elemento `<script>` con Vue, debido a que plantillas y funciones de _render_ deberían causar ninguno efecto secundario. Sin embargo, esta no es la única manera para incluir cadenas de caracteres que podrían ser evaluadas como JavaScript en tiempo de ejecución.

Cada elemento HTML tiene atributos con valores que aceptan cadenas de caracteres de JavaScript, por ejemplo, `onclick`, `onfocus`, y `onmouseenter`. Vincular JavaScript proporcionado por el usuario a cualquier de estos atributos de eventos es un riesgo potencial de seguridad, por lo tanto eso debe ser evitado.

:::tip
Note que JavaScript proporcionado por el usuario no se puede considerar 100% seguro, salvo que dentro de un _iframe_ que forma un entorno de recinto de seguridad o en una parte de la aplicación dónde solo el usuario quién escribió ese JavaScript puede ser expuesto a el.
:::

A veces recibimos reportajes de vulnerabilidad sobre cómo es posible hacer _cross-site scripting (XSS)_ en plantillas Vue. Por lo general, no consideramos que tales casos sean vulnerabilidades verdaderas, porque no hay maneras prácticas para protejer los desarrolladores de los dos escenarios que podrían permitir XSS:

1. El desarrollador está pidiendo a Vue explícitamente renderizar el contenido sin desinfectar proporcionado por el usuario como plantillas Vue. Este es inseguro por naturaleza y no hay ninguna manera de que Vue pueda reconocer el origen.

2. El desarrollador está montando Vue a una página HTML entera en que pasa a contener contenido renderizado por el servidor o proporcionado por el usuario. Eso es fundamentalmente el mismo problama como \#1, pero a veces los desarrolladores podrían hacerlo sin darse cuenta. Eso puede provocar vulnerabilidades posibles dónde el atacante proporciona HTML que es seguro como HTML plano pero inseguro como una plantilla Vue. La mejor práctica es nunca montar Vue en nodos que pueda contener contenido renderizado por el servidor o proporcionado por el usuario.

## Prácticas Óptimas

La regla general es que si permite la ejecución de contenido sin desinfectar, proporcionado por el usuario (ya sea HTML, JavaScript u incluso CSS), se estaría exponiendo a los ataques. En realidad, este consejo mantiene válido tanto en el uso de Vue como con otro framework, o incluso con ninguno framework.

Más allá de las recomendaciones hechas arriba para [peligros potenciales](#potential-dangers), también recomendamos familiarizarse usted mismo con estos recursos:

- [Hoja de apuntes de la seguridad de HTML5](https://html5sec.org/)
- [Hoja de apuntes de la prevención de _Cross Site Scripting (XSS)_ de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Luego utilice lo que ya ha aprendido para también revisar el código de fuente de sus dependencias por patrones potencialmente peligrosos. Si cualquier de ellas incluye componentes de tercera parte o influye lo que va a ser renderizado al DOM.

## Coordinación con _Backend_

Las vulnerabilidades de seguridad de HTML, como solicitudes falsas de sitios cruzados (CSRF/XSRF) y _cross-site script inclusion (XSSI)_, son dirigidos principalmente al _backend_, por lo tanto son afuera de las preocupaciones de Vue. Sin embargo, es aún una buena idea para comunicar con su equipo de _backend_ para aprender la mejor manera de interactuar con sus APIs, por ejemplo, enviar el formulario junto con el token CSRF.

## Renderización en el lado del Servidor (SSR)

Hay unas preocupaciones adicionales de seguridad cuando se utiliza SSR, así que asegúrese de seguir las mejores prácticas reseñadas a través de [nuestra documentación de SSR](ssr/introduction.html) para evitar las vulnerabilidades.
