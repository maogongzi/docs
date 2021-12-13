# Soporte para TypeScript

> [Vue CLI](https://cli.vuejs.org) provee soporte integrado para herramientas de TypeScript.

## Declaración Oficial en Paquetes NPM

Un sistema de tipos estático ayuda a prevenir muchos errores potenciales en tiempo de ejecución a medida que crecen las aplicaciones, razón por la cual Vue 3 está escrito en TypeScript. Esto significa que no necesita ninguna herramienta adicional para utilizar TypeScript con Vue, debido a que posee soporte de primera clase para su uso.

## Configuración Recomendada

```js
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    // esto habilita la inferencia estricta para las propiedades de datos en `this`
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  }
}
```

Note que tiene que incluir `strict: true` (o al menos `noImplicitThis: true` que es parte de la bandera `strict`) para apalancar la revisión de tipos de `this` en métodos de componente, de lo contrario es siempre tratado como tipo `any`.

Vea [documentación de opciones del compilador de TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para más detalles.

## Configuración de Webpack

Si está utilizando una configuración personalizada de Webpack, se requiere configurar `ts-loader` para analizar bloques `<script lang="ts">` en archivos `.vue`:

```js{10}
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
      ...
```

## Herramientas de Desarrollo

### Creación de Proyecto

[Vue CLI](https://github.com/vuejs/vue-cli) puede generar nuevos proyectos que utilicen TypeScript. Para empezar:

```bash
# 1. Instale Vue CLI, si aún no está instalado
npm install --global @vue/cli

# 2. Cree un nuevo proyecto, luego elija la opción "Seleccionar características manualmente (Manually select features)"
vue create my-project-name

# Si ya tiene un proyecto Vue CLI sin TypeScript, por favor añada un plugin apropiado de Vue CLI:
vue add typescript
```

Asegúrese de que la parte `script` del componente tiene TypeScript como lenguaje:

```html
<script lang="ts">
  ...
</script>
```

O, si quiere combinar TypeScript con una [función `render` de JSX](/guide/render-function.html#jsx):

```html
<script lang="tsx">
  ...
</script>
```

### Soporte para Editores de Código

Para desarrollar aplicaciones Vue con TypeScript, recomendamos fuertemente utilizar [Visual Studio Code](https://code.visualstudio.com/), que provee soporte genial integrado para TypeScript. Si está utilizando [componentes de un solo archivo](./single-file-component.html) (SFCs), obtenga la asombrosa [extención Volar](https://github.com/johnsoncodehk/volar), que provee inferencia de TypeScript dentro de SFCs y muchas otras características geniales.

[WebStorm](https://www.jetbrains.com/webstorm/) también provee soporte integrado para ambos, TypeScript y Vue.

## Definir Componentes Vue

Para dejar que TypeScript infiera apropiadamente los tipos dentro de opciones de componentes Vue, necesita definir componentes con el método global `defineComponent`:

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  // inferencia de tipos habilitada
})
```

Si está utilizando [componentes de un solo archivo](./single-file-component.html), entonces sería escrito típicamente como lo siguiente:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // inferencia de tipos habilitada
})
</script>
```

## Utilizando con la API de Opciones

TypeScript debería ser capaz de inferir la mayoría de los tipos sin definirlos explícitamente. Por ejemplo, si tiene un componente con una propiedad numérica `count`, tendrá un error si intenta llamar un método específico de cadenas de caracteres en ella:

```ts
const Component = defineComponent({
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const result = this.count.split('') // => La propiedad 'split' no existe en el tipo 'number'
  }
})
```

Si tiene un tipo o interfaz compleja, puede realizar un _cast_ utilizando [aserción de tipos](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions):


```ts
interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  data() {
    return {
      book: {
        title: 'Guía de Vue 3',
        author: 'Equipo Vue',
        year: 2020
      } as Book
    }
  }
})
```

### Aumentar Tipos para `globalProperties`

Vue 3 proporciona un [objeto `globalProperties`](../api/application-config.html#globalproperties) que puede ser utilizado para agregar una propiedad global que puede ser accesado en cualquiera instancia de componente. Por ejemplo, un [plugin](./plugins.html#writing-a-plugin) podría querer inyectar un objeto global o función compartido.

```ts
// Definición por el usuario
import axios from 'axios'

const app = Vue.createApp({})
app.config.globalProperties.$http = axios

// Plugin para validar algunos datos
export default {
  install(app, options) {
    app.config.globalProperties.$validate = (data: object, rule: object) => {
      // comprobar si el objeto cumple con ciertas reglas
    }
  }
}
```

Para informar a TypeScript estas nuevas propiedades, podemos utilizar [aumentación de módulos](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

En el ejemplo arriba, podríamos agregar la siguiente declaración de tipo:

```ts
import axios from 'axios'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $http: typeof axios
    $validate: (data: object, rule: object) => boolean
  }
}
```

Podemos poner esta declaración de tipo en el mismo archivo, o en un archivo `*.d.ts` para todo el proyecto (por ejemplo, en la carpeta `src/typings` que está cargada automáticamente por TypeScript). Para autores de librerías/plugins, este archivo debe ser especificado en la propiedad `types` en `package.json`.

::: warning
Asegúrase de que el archivo de declaración es un módulo de TypeScript para aprovechar la aumentación de módulos, necesitará asegurar que hay al menos un `import` o `export` de nivel superior en su archivo, incluso si es solo `export {}`.

[En TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html), cualquier archivo que contiene un `import` o `export` de nivel superior es considerado un 'módulo'. Si la declaración de tipo es hecha afuera de un módulo, sobrescribirá los tipos originales en vez de aumentarlos.
:::

Para más información sobre el tipo `ComponentCustomProperties`, vea su [definición en `@vue/runtime-core`](https://github.com/vuejs/vue-next/blob/2587f36fe311359e2e34f40e8e47d2eebfab7f42/packages/runtime-core/src/componentOptions.ts#L64-L80) y [pruebas unitarias de TypeScript](https://github.com/vuejs/vue-next/blob/master/test-dts/componentTypeExtensions.test-d.tsx) para aprender más.

### Anotar Tipos de Dato de Retorno

Debido a la naturaleza circular de los archivos de declaración de Vue, TypeScript puede tener dificultades infiriendo los tipos de valores calculados. Por esta razón, puede tener que anotar el tipo de dato de retorno de propiedades calculadas.

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // necesita una anotación
    greeting(): string {
      return this.message + '!'
    },

    // en un valor calculado con un establecedor, el captador necesita ser anotado
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

### Anotar Propiedades

Vue realiza una validación en tiempo de ejecución en propiedades con un `type` definido. Para proporcionar estos tipos a TypeScript, necesitamos hacer _cast_ al constructor con `PropType`:

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  props: {
    name: String,
    id: [Number, String],
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    book: {
      type: Object as PropType<Book>,
      required: true
    },
    metadata: {
      type: null // metadata es tipado como _any_
    }
  }
})
```

::: warning
Debido a  una [limitación de diseño](https://github.com/microsoft/TypeScript/issues/38845) en TypeScript cuando se trata de inferencia de tipo de expresiones de función, tiene que ser cuidadoso con valores `validator` y `default` para objetos y matrices: 
:::

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

const Component = defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Asegúrese de utilizar funciones de flecha
      default: () => ({
        title: 'Expresión de Función de Flecha'
      }),
      validator: (book: Book) => !!book.title
    },
    bookB: {
      type: Object as PropType<Book>,
      // O proporciona una parámetro explícito de _this_
      default(this: void) {
        return {
          title: 'Expresión de Función'
        }
      },
      validator(this: void, book: Book) {
        return !!book.title
      }
    }
  }
})
```

### Anotar los Emitidos

Podemos anotar un _payload_ para el evento emitido, también, todos los eventos emitidos non declarados lanzarán un error de tipo cuando sean llamados:

```ts
const Component = defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // realizar validación en tiempo de ejecución
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // ¡error de tipo!
      })

      this.$emit('non-declared-event') // ¡error de tipo!
    }
  }
})
```

## Utilizar con la API de Composición

En función `setup()`, no necesita pasar un tipo al parámetro `props`, debido a que inferirá tipos de la opción `props` del componente.

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const result = props.message.split('') // correcto, 'message' es tipado como una cadena de caracteres
    const filtered = props.message.filter(p => p.value) // se lanzará un error:: Property 'filter' does not exist on type 'string'
  }
})
```

### Tipar las `refs`

Las `refs` inferirán el tipo del valor inicial:

```ts
import { defineComponent, ref } from 'vue'

const Component = defineComponent({
  setup() {
    const year = ref(2020)

    const result = year.value.split('') // => La propiedad 'split' no existe en tipo 'number'
  }
})
```

Algunas veces necesitaríamos especificar tipos complejos para el valor interno de una _ref_. Podemos hacerlo mediante pasar un argumento genérico cuando se llame la _ref_ para sobreescribir la inferencia por defecto:

```ts
const year = ref<string | number>('2020') // el tipo de _year_: Ref<string | number>

year.value = 2020 // ¡ya!
```

::: tip Note
Si el tipo del genérico es incógnito, es recomendado fundir `ref` a `Ref<T>`.
:::

### Tipar las Refs de Plantillas

Algunas veces tendría que anotar una _ref_ de plantilla para un componente secundario para llamar su método público. Por ejemplo, tenemos un componente secundario llamado `MyModal` con un método que abre el modal:

```ts
import { defineComponent, ref } from 'vue'

const MyModal = defineComponent({
  setup() {
    const isContentShown = ref(false)
    const open = () => (isContentShown.value = true)

    return {
      isContentShown,
      open
    }
  }
})
```

Queremos llamar este método mediante una _ref_ de plantilla desde el componente padre:

```ts
import { defineComponent, ref } from 'vue'

const MyModal = defineComponent({
  setup() {
    const isContentShown = ref(false)
    const open = () => (isContentShown.value = true)

    return {
      isContentShown,
      open
    }
  }
})

const app = defineComponent({
  components: {
    MyModal
  },
  template: `
    <button @click="openModal">Abrir desde el padre</button>
    <my-modal ref="modal" />
  `,
  setup() {
    const modal = ref()
    const openModal = () => {
      modal.value.open()
    }

    return { modal, openModal }
  }
})
```

Mientras este funcionará, no hay información de tipo sobre `MyModal` y sus métodos disponibles. Para arreglarlo, debería utilizar `InstanceType` cuando cree una _ref_:

```ts
setup() {
  const modal = ref<InstanceType<typeof MyModal>>()
  const openModal = () => {
    modal.value?.open()
  }

  return { modal, openModal }
}
```

Por favor tenga en cuenta que debería también utilizar [encadenamiento opcional (optional chaining)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) o cualquier otra manera para verificar que `modal.value` no esté `undefined`.

### Tipar `reactive`

Cuando se tipe una propiedad `reactive`, podemos utilizar interfaces:

```ts
import { defineComponent, reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const book = reactive<Book>({ title: 'Guía de Vue 3' })
    // or
    const book: Book = reactive({ title: 'Guía de Vue 3' })
    // or
    const book = reactive({ title: 'Guía de Vue 3' }) as Book
  }
})
```

### Tipar `computed`

Los valores de _computed_ automáticamente inferirán el tipo del valor retornado.

```ts
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CounterButton',
  setup() {
    let count = ref(0)

    // de solo lectura
    const doubleCount = computed(() => count.value * 2)

    const result = doubleCount.value.split('') // => La propiedad 'split' no existe en el tipo 'number'
  }
})
```

### Tipar manejadores de Eventos

Cuando se trate de eventos DOM nativos, sería útil tipar el argumento que pasemos al manejador correctamente. Echemos un vistazo a este ejemplo:

```vue
<template>
  <input type="text" @change="handleChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    // `evt` será tipado como `any`
    const handleChange = evt => {
      console.log(evt.target.value) // TS va a lanzar un error aquí
    }

    return { handleChange }
  }
})
</script>
```

Como puede ver, sin anotar el argumento `evt` correctamente, TypeScript lanzará un error cuando tratemos de acceder el valor del elemento `<input>`. La solución es fundir el objeto del evento con un tipo correcto:

```ts
const handleChange = (evt: Event) => {
  console.log((evt.target as HTMLInputElement).value)
}
```
