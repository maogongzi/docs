---
title: $attrs includes class & style
badges:
  - breaking
---

# `$attrs` incluye `class` & `style` <MigrationBadges :badges="$frontmatter.badges" />

## Visión General

`$attrs` ahora contiene _todos_ atributos pasados a un componente, incluye `class` y `style`.

## Comportamiento en 2.x

Los atributos `class` y `style` obtienen unos tratamientos especiales en la implementación de DOM virtual en Vue 2. Por esa razón, _no_ son incluidos en `$attrs`, mientras todos otros atributos son incluidos.

Un efecto secundario de este se manifiesta cuando se utiliza `inheritAttrs: false`:

- Los atributos en `$attrs` ya no son agregados automáticamente al elemento raíz, dejándoselo al desarrollador para decidir el lugar para agregarlos.
- Pero `class` y `style`, no siendo parte de `$attrs`, será todavía aplicado al elemento raíz del componente:

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

cuando está utilizado como esto:

```html
<my-component id="my-id" class="my-class"></my-component>
```

...generará HTML como esto:

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

## Comportamiento en 3.x

`$attrs` contiene _todos_ atributos, lo que hace posible aplicar todos ellos a un elemento diferente. El ejemplo arriba ahora genera el HTML como lo siguiente:

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```

## Estrategia para Migración

En componentes que utiliza `inheritAttrs: false`, asegúrese de que los estilos todavía funcionan como se espera. Si anteriormente confía en el comportamiento especial de `class` y `style`, algunos partes de su interfaz de usuario podrían funcionar anormalmente, debido a que ahora estos atributos podrían haberse aplicado a un otro elemento.

[Indicadores de compilación de migración: `INSTANCE_ATTRS_CLASS_STYLE`](migration-build.html#compat-configuration)

## Vea también

- [RFC pertinente](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [Guía para migración - `$listeners` se ha eliminado](./listeners-removed.md)
- [Guía para migración - la nueva opción _emits_](./emits-option.md)
- [Guía para migración - el modificador `.native` se ha eliminado](./v-on-native-modifier-removed.md)
- [Guía para migración - cambios en la API de funciones render](./render-function-api.md)
