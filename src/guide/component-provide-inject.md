# Provide / inject

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

Usualmente, cuando necesitamos pasar dato desde el componente padre al secundario, utilizamos [_props_](component-props.md). Imagine que en una estructura dónde tiene unos componentes anidados profundamente y en el componente secundario anidado profundamente solo necesita algo del componente padre. En este caso, todavía necesita pasar la _prop_ a lo largo de la cadena entera de componentes, lo cual podría ser molesto.

Para estos casos, podemos utilizar la pareja de `provide` y `inject`. Los componentes padres pueden servir de proveedores de dependencias para todos los componentes secundarios, sin tener en cuenta la profundidad de la jerarquía de componentes. Esta característica funciona en dos partes: el componente padre tiene una opción `provide` para proveer dato y el componente secundario tiene una opción `inject` para utilizar el dato.

![La esquema de _provide/_inject_](/images/components_provide.png)

Por ejemplo, si tenemos una jerarquía como esto:

```
Root
└─ TodoList
   ├─ TodoItem
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Si queremos pasar la longitud de la matriz _todo-items_ directamente a `TodoListStatistics`, podríamos pasar la _prop_ abajo a lo largo de la jerarquía: `TodoList` -> `TodoListFooter` -> `TodoListStatistics`. Con el enfoque de `provide/inject`, podemos hacerlo directamente:

```js
const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe'
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- rest of the template -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > Injected property: John Doe
  }
})
```

Sin embargo, este no funciona si tratamos de proporcionar unas propiedades de la instancia de componente aquí:

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    todoLength: this.todos.length // esto resultará un error `Cannot read property 'length' of undefined`
  },
  template: `
    ...
  `
})
```

Para acceder las propiedades de la instancia de componente, necesitamos convertir `provide` a una función que retorna un objeto:

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  },
  template: `
    ...
  `
})
```

Este nos permite que sigamos desarrollando el componente con más seguridad, sin temor a que podamos cambiar/remover algo de lo que un componente secundario dependa. El interfaz entre estos componentes permanece definido claramente, justo como las _props_.

En realidad, puede pensar la inyección de dependencia como un tipo de "_props_ a largo plazo(long-range props)", excepto:

- Los componentes padres no necesitan saber cuales descendientes van utilizando las propiedades que proporcionen
- Los componentes secundarios no necesitan saber de dónde vienen las propiedades inyectadas

## Trabajar con reactividad

En el ejemplo arriba, si cambiamos la lista de `todos`, este cambio no va a reflejarse en la propiedad inyectada `todoLength`. Es porque `provide/inject` _no_ son reactivas por defecto. Podemos cambiar este comportamiento mediante pasar una propiedad `ref` u un objeto `reactive` a `provide`. En nuesto caso, si quisiéramos reaccionar a cambios en el componente ancestro, podríamos necesitar asignar una propiedad `computed` de API de Composición a nuestra propiedad proporcionada `todoLength`:

```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})

app.component('todo-list-statistics', {
  inject: ['todoLength'],
  created() {
    console.log(`Injected property: ${this.todoLength.value}`) // > Propiedad Inyectada: 5
  }
})
```

En este caso, cualquier cambio a `todos.length` va a reflejarse correctamente en los componentes, dónde `todoLength` está inyectada. Lea más sobre `computed` en la sección de [_Computed_ y _Watch_](reactivity-computed-watchers.html#computed-values) y _provide/inject_ `reactive` en la sección de [API de Composición](composition-api-provide-inject.html#reactivity).
