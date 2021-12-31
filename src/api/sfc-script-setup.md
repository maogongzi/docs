---
sidebarDepth: 1
---

# SFC `<script setup>`

`<script setup>` es un azúcar sintáctico de tiempo de compilación para utilizar [API de composición](/api/composition-api.html) dentro de componentes de un solo archivo (SFCs). Es la sintaxis recomendada si está utilizando SFSc y la API de composición. Provee un número de ventajas sobre la sintaxis normal de `<script>`:

- Más código sucinto con menos plantilla (boilerplate)
- Habilidad para declarar _props_ y emitir eventos utilizando TypeScript puro
- Mejor rendimiento de tiempo de ejecución (la plantilla es compilada en una función _render_ en el mismo alcance, sin ningún proxy intermediario)
- Mejor rendimiento de inferencia de tipo de IDE (menos trabajo para el servidor del lenguaje para extraer tipos del código)

## Sintaxis Básica

Para optar por la sintaxis, agrega el atributo `setup` al bloque `<script>`:

```vue
<script setup>
console.log('hola, script setup')
</script>
```

El código dentro es compilado como el contenido de la función `setup()` del componente. Este significa que, al contrario a `<script>` normal, lo que solo ejecuta una vez cuando el componente es importado por primera vez, el código dentro de `<script setup>` **ejecutará cada vez una instancia del componente es creada**.

### Las vinculaciones de nivel superior son expuestas a la plantilla

Cuando se utiliza `<script setup>`, cualquieras vinculaciones de nivel superior (incluyendo variables, declaraciones de funciones, y importaciones) declaradas dentro de `<script setup>` son directamente disponibles en la plantilla:

```vue
<script setup>
// variable
const msg = 'Hello!'

// funciones
function log() {
  console.log(msg)
}
</script>

<template>
  <div @click="log">{{ msg }}</div>
</template>
```

Las importaciones son expuestas en la misma manera. Este significa que puede directamente utilizar una función de ayuda importada en expresiones de plantilla sin tener que exponerla mediante la opción `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Reactividad

El estado reactivo necesita ser explícitamente creado utilizando [APIs de reactividad](/api/basic-reactivity.html). Similar a valores retornados de una función `setup()`, las _refs_ son automáticamente desenvueltas cuando sean referenciadas en plantillas:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Utilizar Componentes

Los valores en el alcance de `<script setup>` pueden también ser utilizados directamente como nombres de etiqueta de componente personalizado:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Piensa que `MyComponent` sea referido como un variable. Si ha utilizado JSX, el model mental es similar aquí. el equivalente de _kebab-case_ `<my-component>` también funciona en la plantilla, sin embargo las etiquetas de componentes en _PascalCase_ son recomendadas encarecidamente por consistencia. También ayuda a diferenciar de elementos personalizados nativos.

### Componentes Dinámicos

Debido a que componentes son referidos como variables en vez de registrados debajo de claves de cadena de caracteres, debería utilizar la vinculación dinámica `:is` cuando utilice componentes dinámicos en `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Note cómo los componentes pueden ser utilizados como variables en la expresión ternaria.

### Componentes Recursivos

Un SFC puede implícitamente referirse a sí mísmo mediante el nombre de su archivo. P. ej. un archivo llamado `FooBar.vue` puede referirse a sí mísmo como `<FooBar/>` en su plantilla.

Note que este tiene menor prioridad que los componentes importados. Si tiene una importación nombrada que tenga conflicto con el nombre inferido del componente, puede aplicar alias a la importación:

```js
import { FooBar as FooBarChild } from './components'
```

### Componentes con espacio de nombres (namespace)

Puede utilizar etiquetas de componentes con puntos como `<Foo.Bar>` para referir a componentes anidados bajo propiedades de objetos. Este es útil cuando importa múltiples componentes desde un solo archivo:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Utilizar Directivas Personalizadas

Las directivas registradas globalmente siempre funcionan como se esperan, y las locales pueden ser utilizadas directamente en la plantilla, muy similar a lo que explicamos para componentes arriba.

Pero hay una restricción a tener en cuenta: debe nombrar las directivas personalizadas locales conforme a la sequema siguiente: `vNameOfDirective` para que puedan ser utilizadas directamente en la plantilla.

```html
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // hacer algo con el elemento
  }
}
</script>
<template>
  <h1 v-my-directive>Este es un encabezado</h1>
</template>
```
```html
<script setup>
  // las importaciones también funcionan, y pueden ser renombradas para ajustarse a la esquema de nomenclatura requerida
  import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## `defineProps` y `defineEmits`

Para declarar `props` y `emits` en `<script setup>`, debe utilizar las APIs `defineProps` y `defineEmits`, los que proveen soporte completo de inferencia de tipos y son automáticamente disponibles dentro de `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// código para la configuración
</script>
```

- `defineProps` y `defineEmits` son **macros de compiladores (compiler macros)** solo utilizables dentro de `<script setup>`. No necesitan ser importados, y son eliminados durante el proceso de compilación cuando `<script setup>` sea procesado.

- `defineProps` acepta el mismo valor como la [opción `props`](/api/options-data.html#props), mientras `defineEmits` acepta el mismo valor como la [opción `emits`](/api/options-data.html#emits).

- `defineProps` y `defineEmits` provee inferencia de tipos adecuada basado de las opciones pasadas.

- Las opciones pasadas a `defineProps` y `defineEmits` serán elevadas afuera del `setup` al alcance del módulo. Por lo tanto, las opciones no pueden referir variables locales declaradas en el alcance de setup. Hacerlo resultará un error de compilación. Sin embargo, _puede_ referir a las vinculaciones importadas debido a que son en el el alcance del módulo también.

Si está utilizando TypeScript, es también posible [declarar props y emits utilizando anotaciones de tipo puro](#typescript-only-features).

## `defineExpose`

Los componentes que utilizan `<script setup>` son **cerrados por defecto**, es decir, la instancia pública del componente, que es recuperada mediante _refs_ de plantilla o cadenas de `$parent`, **no** exponerán nada de las vinculaciones declaradas dentro de `<script setup>`.

Par explícitamente exponer propiedades en un componente de `<script setup>`, utiliza el macro de compilador `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Cuando un padre obtiene una instancia de este componente mediante _refs_ de plantilla, la instancia recuperada será de la forma `{ a: number, b: number }` (las _refs_ son automáticamente desenvueltas justo como en instancias normales).

## `useSlots` y `useAttrs`

Los usos de `slots` y `attrs` dentro de `<script setup>` deberían ser relativamente raros, debido a que puede accederlos directamente como `$slots` y `$attrs` en la plantilla. En los raros casos dónde los necesita, utiliza los ayudantes `useSlots` y `useAttrs`, respectivamente:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` y `useAttrs` son funciones actuales de tiempo de ejecución que retornan los equivalentes de `setupContext.slots` y `setupContext.attrs`. También pueden ser utilizadas en funciones normales de la API de composición.

## Uso junto a `<script>` normal

`<script setup>` puede ser utilizado junto a `<script>` normal, Un `<script>` normal puede ser necesito en casos dónde necesite:

- Declarar opciones que no puedan ser expresadas en `<script setup>`, por ejemplo `inheritAttrs` o opciones personalizadas habilitadas mediante _plugins_.
- Declarar exportaciones nombradas.
- Ejecutar efectos secundarios o crear objetos que deben ejecutarse solo una vez.

```vue
<script>
// <script> normal, ejecutado en el alcance del módulo (solo una vez)
runSideEffectOnce()

// declarar opciones adicionales
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// ejecutado en el alcance de setup() (para cada instancia)
</script>
```

:::warning
La función `render` no es soportada en este escenario. Por favor utilice un `<script>` normal junto con la opción `setup` en su lugar.
:::

## `await` de nivel superior

`await` de nivel superior puede ser utilizada en `<script setup>`. El código resultante será compilado como `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

Además, la expresión esperada (awaited) será automáticamente compilada en un formato que preserve el contexto de la instancia del componente actual después de `await`.

:::warning Note
`async setup()` debe ser utilizada en combinación con `Suspense`, lo que es todavía una característica experimental. Planeamos finalizar y documentarlo en una futura versión, pero si tiene curiosidad ahora, puede referirse a sus [pruebas](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) para ver cómo funcione.
:::

## Características de solo TypeScript

### Declaraciones solo tipados de props/emit

Las _props_ y _emits_ pueden también ser declaradas utilizando la sintaxis de puro tipo (pure-type) mediante pasar un argumento de tipo literal a `defineProps` o `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` o `defineEmits` solo pueden utilizar tanto declaración de tiempo de ejecución COMO declaración de tipo. Utilizar ambos al mismo tiempo puede resultar un error de compilación.

- Cuando se utiliza declaración de tipo, la declaración equivalente de tiempo de ejecución es automáticamente generada de analísis estática para eliminar la necesidad de declaración duplicada y todavía asegurar el comportamiento correcto de tiempo de ejecución.

  - En modo de desarrollo, el compilador tratará de inferir validación de tiempo de ejecución correspondiente desde los tipos. Por ejemplo, aquí `foo: String` es inferido del tipo `foo: string`. Si el tipo es una referencia a un tipo importado, el resultado inferido será `foo: null` (igual al tipo `any`) debido a que el compilador no tiene información de los archivos externos.

  En modo de producción, el compilador generará la declaración de formato de matriz para reducir tamaño de la compilación (las props aquí serán compiladas a `['foo', 'bar']`)

  - El código emitido es todavía TypeScript con tipo válido, lo que puede ser procesado más por otras herramientas.

- Por ahora, el argumento de declaración de tipo debe ser uno de los siguientes para aseguarse de la analísis estática correcta:

  - Un tipo literal
  - Una referencia a un interfaz o un tipo literal en el mismo archivo

  En la actualidad tipos complejos y importar tipos desde otros archivos no son soportados. Es teóricamente posible soportar importaciones de tipos en el futuro.

### Default props values when using type declaration

One drawback of the type-only `defineProps` declaration is that it doesn't have a way to provide default values for the props. To resolve this problem, a `withDefaults` compiler macro is also provided:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the default values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

## Restriction: No Src Imports

Due to the difference in module execution semantics, code inside `<script setup>` relies on the context of an SFC. When moved into external `.js` or `.ts` files, it may lead to confusion for both developers and tools. Therefore, **`<script setup>`** cannot be used with the `src` attribute.
