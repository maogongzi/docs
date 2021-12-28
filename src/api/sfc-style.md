---
sidebarDepth: 1
---

# Características de estilos de SFC

## `<style scoped>`

Cuando una etiqueta `<style>` tiene el atributo `scoped`, sus CSS sólo serán aplicadas a elementos del componente actual. Este es similar a la encapsulación de estilos encontrados en DOM _shadow_. Viene con algunas advertencias, pero no necesita cualquier _polyfill_. Es realizado mediante utlizar PostCSS para transformar el siguiente:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

al siguiente:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Los Elementos Raíz de Componentes Hijos

Con `scoped`, los estilos del componente padre no se filtrarán a componentes hijos. Sin embargo, el nodo raíz de un componente hijo será afectado por las CSS del alcance padre y las CSS del alcance hijo. Eso es a propósito para que el padre pueda aplicar estilos al elemento raíz del hijo para el propósito de _layout_.

### Selector _Deep_

Si quiere que un selector en estilos con alcance sea "profundo", p. ej. afectar componentes hijos, puede utilizar el _pseudo-class_ `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

El arriba será compilado a:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
Los contenidos DOM creados por `v-html` no son afectados por estilos con alcance, pero puede también aplicar estilos a ellos utilizando selectores profundos.
:::

### Selector _Slotted_

Por defecto, los estilos con alcance no afectan a contenidos renderizados por `<slot/>`, debido a que son considerados pertenecientes al componente padre que los pasen. Para orientar explícitamente los contenidos de _slot_, utilice el _pseudo-class_ `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Selector _Global_

Si quiere que se aplique solo una regla globalmente, puede utilizar el _pseudo-class_ `:global` en vez de crear otro `<style>` (vea abajo):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Mezclar Los Estilos Locales y Globales

Puede también incluir estilos tanto con alcance como sin alcance en el mismo componente:

```vue
<style>
/* estilos globales */
</style>

<style scoped>
/* estilos locales */
</style>
```

### Scoped Style Tips

- **Los estilos con alcance no elimina la necesidad de clases**. Debido a la manera que utilizan los navegadores para renderizar varios selectores CSS, `p { color: red }` será muchas veces más lentos cuando se utilice con alcance (es decir, cuando está combinado con un selector de atributo). Si utiliza clases o _ids_ en su lugar, tal como en `.example { color: red }`, luego prácticamente elimina el impacto en el rendimiento.

- **¡Tenga cuidado con selectores de descendientes en componentes recursivos!** Para una regla CSS con el selector `.a .b`, si el elemento que coincide con `.a` contiene un componente hijo recursivo, luego todos `.b` en ese componente hijo se harán coincidir por la regla.

## `<style module>`

Una etiqueta `<style module>` es compilada como [módulos CSS](https://github.com/css-modules/css-modules) y expuesta las clases CSS resultantes al componente como un objeto debajo la clave `$style`:

```vue
<template>
  <p :class="$style.red">
    Este debe ser rojo
  </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Las clases resultantes utilizan _hash_ para evitar colisión, realiza el mismo efecto de CSS con alcance al componente actual solamente.

Refierase a la la [especificación de módulos CSS](https://github.com/css-modules/css-modules) para más detalles tal como [excepciones globales](https://github.com/css-modules/css-modules#exceptions) y [composición](https://github.com/css-modules/css-modules#composition).

### Personalizar el nombre de inyección

Puede personalizar la clave de la propiedad del objeto de clases inyectadas mediante darle un valor al atributo `module`:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Uso con API de Composición

Las clases inyectadas pueden ser accesadas en `setup()` y `<script setup>` mediante la API [`useCssModule`](/api/global-api.html#usecssmodule). Para bloques `<style module>` con nombres de inyección personalizados, `useCssModule` acepta el valor del atributo coincidente `module` como su primer argumento:

```js
// por defecto retorna clases para <style module>
useCssModule()

// nombrado, retorna clases para <style module="classes">
useCssModule('classes')
```

## CSS dinámico impulsado por estados

Las etiquetas `<style>` soporta enlacer valores CSS a estados dinámicos de componentes utilizando la función CSS `v-bind`:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

La sintaxis funciona con [`<script setup>`](./sfc-script-setup), y soporta expresiones JavaScript (debe encerrarse entre comillas):

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

El valor actual será compilado a una propiedad CSS personalizada, así que el CSS es todavía estático. la propiedad personalizada será aplicada al elemento raíz del componente mediante estilos en línea y actualizada reactivamente si el valor del fuente se cambie.
