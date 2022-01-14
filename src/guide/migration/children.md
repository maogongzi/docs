---
badges:
  - removed
---

# $children <MigrationBadges :badges="$frontmatter.badges" />

## Visión General

La propiedad de instancia `$children` se ha eliminado desde Vue 3.0 y ya no es soportada.

## Sintaxis para 2.x

En 2.x, los desarrolladores pudieron acceder componentes hijo directos de la instancia actual mediante `this.$children`:

```vue
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <my-button>Cambiar el logo</my-button>
  </div>
</template>

<script>
import MyButton from './MyButton'

export default {
  components: {
    MyButton
  },
  mounted() {
    console.log(this.$children) // [VueComponent]
  }
}
</script>
```

## Actualización en 3.x

En 3.x, la propiedad `$children` se ha eliminado y ya no es soportada. En su lugar, si necesita acceder una instancia de componente hijo, recomendamos utilizar [$refs](/guide/component-template-refs.html#template-refs).

## Estrategia para Migración

[Indicadores de compilación de migración: `INSTANCE_CHILDREN`](migration-build.html#compat-configuration)
