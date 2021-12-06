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

Sometimes we receive vulnerability reports on how it's possible to do cross-site scripting (XSS) in Vue templates. In general, we do not consider such cases to be actual vulnerabilities, because there's no practical way to protect developers from the two scenarios that would allow XSS:

1. The developer is explicitly asking Vue to render user-provided, unsanitized content as Vue templates. This is inherently unsafe and there's no way for Vue to know the origin.

2. The developer is mounting Vue to an entire HTML page which happens to contain server-rendered and user-provided content. This is fundamentally the same problem as \#1, but sometimes devs may do it without realizing. This can lead to possible vulnerabilities where the attacker provides HTML which is safe as plain HTML but unsafe as a Vue template. The best practice is to never mount Vue on nodes that may contain server-rendered and user-provided content.

## Best Practices

The general rule is that if you allow unsanitized, user-provided content to be executed (as either HTML, JavaScript, or even CSS), you might be opening yourself up to attacks. This advice actually holds true whether using Vue, another framework, or even no framework.

Beyond the recommendations made above for [Potential Dangers](#potential-dangers), we also recommend familiarizing yourself with these resources:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Then use what you learn to also review the source code of your dependencies for potentially dangerous patterns, if any of them include 3rd-party components or otherwise influence what's rendered to the DOM.

## Backend Coordination

HTTP security vulnerabilities, such as cross-site request forgery (CSRF/XSRF) and cross-site script inclusion (XSSI), are primarily addressed on the backend, so aren't a concern of Vue's. However, it's still a good idea to communicate with your backend team to learn how to best interact with their API, e.g. by submitting CSRF tokens with form submissions.

## Server-Side Rendering (SSR)

There are some additional security concerns when using SSR, so make sure to follow the best practices outlined throughout [our SSR documentation](ssr/introduction.html) to avoid vulnerabilities.
