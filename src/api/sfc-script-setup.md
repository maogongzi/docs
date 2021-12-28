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

Note how the components can be used as variables in a ternary expression.

### Recursive Components

An SFC can implicitly refer to itself via its filename. E.g. a file named `FooBar.vue` can refer to itself as `<FooBar/>` in its template.

Note this has lower priority than imported components. If you have a named import that conflicts with the component's inferred name, you can alias the import:

```js
import { FooBar as FooBarChild } from './components'
```

### Namespaced Components

You can use component tags with dots like `<Foo.Bar>` to refer to components nested under object properties. This is useful when you import multiple components from a single file:

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

## Using Custom Directives

Globally registered custom directives just work as expected, and local ones can be used directly in the template, much like we explained above for components. 

But there's one restriction to be aware of: You must name local custom directives according to the following schema: `vNameOfDirective` in order for them to be directly usable in the template.

```html
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // do something with the element
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```
```html
<script setup>
  // imports also work, and can be renamed to fit the required naming schema
  import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## `defineProps` and `defineEmits`

To declare `props` and `emits` in `<script setup>`, you must use the `defineProps` and `defineEmits` APIs, which provide full type inference support and are automatically available inside `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` and `defineEmits` are **compiler macros** only usable inside `<script setup>`. They do not need to be imported, and are compiled away when `<script setup>` is processed.

- `defineProps` accepts the same value as the [`props` option](/api/options-data.html#props), while `defineEmits` accepts the same value as the [`emits` option](/api/options-data.html#emits).

- `defineProps` and `defineEmits` provide proper type inference based on the options passed.

- The options passed to `defineProps` and `defineEmits` will be hoisted out of setup into module scope. Therefore, the options cannot reference local variables declared in setup scope. Doing so will result in a compile error. However, it _can_ reference imported bindings since they are in the module scope as well.

If you are using TypeScript, it is also possible to [declare props and emits using pure type annotations](#typescript-only-features).

## `defineExpose`

Components using `<script setup>` are **closed by default** - i.e. the public instance of the component, which is retrieved via template refs or `$parent` chains, will **not** expose any of the bindings declared inside `<script setup>`.

To explicitly expose properties in a `<script setup>` component, use the `defineExpose` compiler macro:

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

When a parent gets an instance of this component via template refs, the retrieved instance will be of the shape `{ a: number, b: number }` (refs are automatically unwrapped just like on normal instances).

## `useSlots` and `useAttrs`

Usage of `slots` and `attrs` inside `<script setup>` should be relatively rare, since you can access them directly as `$slots` and `$attrs` in the template. In the rare case where you do need them, use the `useSlots` and `useAttrs` helpers respectively:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` and `useAttrs` are actual runtime functions that return the equivalent of `setupContext.slots` and `setupContext.attrs`. They can be used in normal composition API functions as well.

## Usage alongside normal `<script>`

`<script setup>` can be used alongside normal `<script>`. A normal `<script>` may be needed in cases where you need to:

- Declare options that cannot be expressed in `<script setup>`, for example `inheritAttrs` or custom options enabled via plugins.
- Declaring named exports.
- Run side effects or create objects that should only execute once.

```vue
<script>
// normal <script>, executed in module scope (only once)
runSideEffectOnce()

// declare additional options
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executed in setup() scope (for each instance)
</script>
```

:::warning
`render` function is not supported in this scenario. Please use one normal `<script>` with `setup` option instead.
:::

## Top-level `await`

Top-level `await` can be used inside `<script setup>`. The resulting code will be compiled as `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

In addition, the awaited expression will be automatically compiled in a format that preserves the current component instance context after the `await`.

:::warning Note
`async setup()` must be used in combination with `Suspense`, which is currently still an experimental feature. We plan to finalize and document it in a future release - but if you are curious now, you can refer to its [tests](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) to see how it works.
:::

## TypeScript-only Features

### Type-only props/emit declarations

Props and emits can also be declared using pure-type syntax by passing a literal type argument to `defineProps` or `defineEmits`:

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

- `defineProps` or `defineEmits` can only use either runtime declaration OR type declaration. Using both at the same time will result in a compile error.

- When using type declaration, the equivalent runtime declaration is automatically generated from static analysis to remove the need for double declaration and still ensure correct runtime behavior.

  - In dev mode, the compiler will try to infer corresponding runtime validation from the types. For example here `foo: String` is inferred from the `foo: string` type. If the type is a reference to an imported type, the inferred result will be `foo: null` (equal to `any` type) since the compiler does not have information of external files.

  - In prod mode, the compiler will generate the array format declaration to reduce bundle size (the props here will be compiled into `['foo', 'bar']`)

  - The emitted code is still TypeScript with valid typing, which can be further processed by other tools.

- As of now, the type declaration argument must be one of the following to ensure correct static analysis:

  - A type literal
  - A reference to an interface or a type literal in the same file

  Currently complex types and type imports from other files are not supported. It is theoretically possible to support type imports in the future.

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
