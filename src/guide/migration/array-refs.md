---
title: v-for Array Refs
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

En Vue 2, cuando se utiliza el atributo `ref` dentro de `v-for`, la propiedad correspondiente `$refs` será llenado con una matriz de _refs_. Este comportamiento se vuelve ambiguo y ineficiente cuando hay `v-for` anidados.

En Vue 3, dicho uso no creará automáticamente una matriz en `$refs`. Para recuperar múltiples _refs_ de una sola vinculación de dato, vincula la `ref` a una función que provea más flexibilidad (esta es una nueva característica):

```html
<div v-for="item in list" :ref="setItemRef"></div>
```

Con la API de opciones:

```js
export default {
  data() {
    return {
      itemRefs: []
    }
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
    }
  },
  beforeUpdate() {
    this.itemRefs = []
  },
  updated() {
    console.log(this.itemRefs)
  }
}
```

Con la API de composición:

```js
import { onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      if (el) {
        itemRefs.push(el)
      }
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      setItemRef
    }
  }
}
```

Note que:

- `itemRefs` no es necesario ser una matriz: puede también ser un objeto dónde las _refs_ son establecidas mediante sus claves de iteración.

- Este también permite que `itemRefs` sea reactivo y observado, si es necesario.

## Estrategia de Migración

[Indicadores de compilación de migración:](migration-build.html#compat-configuration)

- `V_FOR_REF`
- `COMPILER_V_FOR_REF`
