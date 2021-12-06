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

In any web application, allowing unsanitized, user-provided content to be executed as HTML, CSS, or JavaScript is potentially dangerous, so should be avoided wherever possible. There are times when some risk may be acceptable though.

For example, services like CodePen and JSFiddle allow user-provided content to be executed, but it's in a context where this is expected and sandboxed to some extent inside iframes. In the cases when an important feature inherently requires some level of vulnerability, it's up to your team to weigh the importance of the feature against the worst-case scenarios the vulnerability enables.

### Injecting HTML

As you learned earlier, Vue automatically escapes HTML content, preventing you from accidentally injecting executable HTML into your application. However, in cases where you know the HTML is safe, you can explicitly render HTML content:

- Using a template:

  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- Using a render function:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Using a render function with JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::tip
Note that user-provided HTML can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that HTML can ever be exposed to it. Additionally, allowing users to write their own Vue templates brings similar dangers.
:::

### Injecting URLs

In a URL like this:

```html
<a :href="userProvidedUrl">
  click me
</a>
```

There's a potential security issue if the URL has not been "sanitized" to prevent JavaScript execution using `javascript:`. There are libraries such as [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) to help with this, but note:

:::tip
If you're ever doing URL sanitization on the frontend, you already have a security issue. User-provided URLs should always be sanitized by your backend before even being saved to a database. Then the problem is avoided for _every_ client connecting to your API, including native mobile apps. Also note that even with sanitized URLs, Vue cannot help you guarantee that they lead to safe destinations.
:::

### Injecting Styles

Looking at this example:

```html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

let's assume that `sanitizedUrl` has been sanitized, so that it's definitely a real URL and not JavaScript. With the `userProvidedStyles`, malicious users could still provide CSS to "click jack", e.g. styling the link into a transparent box over the "Log in" button. Then if `https://user-controlled-website.com/` is built to resemble the login page of your application, they might have just captured a user's real login information.

You may be able to imagine how allowing user-provided content for a `<style>` element would create an even greater vulnerability, giving that user full control over how to style the entire page. That's why Vue prevents rendering of style tags inside templates, such as:

```html
<style>{{ userProvidedStyles }}</style>
```

To keep your users fully safe from click jacking, we recommend only allowing full control over CSS inside a sandboxed iframe. Alternatively, when providing user control through a style binding, we recommend using its [object syntax](class-and-style.html#object-syntax-2) and only allowing users to provide values for specific properties it's safe for them to control, like this:

```html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### Injecting JavaScript

We strongly discourage ever rendering a `<script>` element with Vue, since templates and render functions should never have side effects. However, this isn't the only way to include strings that would be evaluated as JavaScript at runtime.

Every HTML element has attributes with values accepting strings of JavaScript, such as `onclick`, `onfocus`, and `onmouseenter`. Binding user-provided JavaScript to any of these event attributes is a potential security risk, so should be avoided.

:::tip
Note that user-provided JavaScript can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that JavaScript can ever be exposed to it.
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
