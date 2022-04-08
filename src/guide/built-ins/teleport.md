# Teleport

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Lección gratis de Teleport de Vue.js"/>

`<Teleport>` es un componente integrado que nos permita "teletransportar" una parte del template del componente a un nodo DOM que exista afuera de la jeraquía DOM de dicho componente.

## Uso Básico

Algunas veces podríamos encontrarnos el siguiente escenario: una parte del template de un componente pertenece a el lógicamente, pero desde el punto de vista visual, debería mostrarse en otro lugar en el DOM, afuera de la aplicación Vue.

El más común ejemplo de esto es cuando crea un modal de pantalla completa. Idealmente, queremos que el botón del modal y el modal mísmo quede dentro del mismo componente, debido a que ambos son relacionados con el estado abierto / cerrado del modal. Pero este significa que el modal será renderizado junto con el botón, profundamente anidado en la jeraquía DOM de la aplicación. Este puede causar unas problemas engañosas cuando posiciona el modal mediante CSS.

Considera la siguiente estructura HTML.

```vue-html
<div class="outer">
  <h3>Ejemplo de Teleport de Vue</h3>
  <div>
    <MyModal />
  </div>
</div>
```

Y aquí es la implementación de `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Abrir Modal</button>

  <div v-if="open" class="modal">
    <p>¡Hola desde el modal!</p>
    <button @click="open = false">Cerrar</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Abrir Modal</button>

  <div v-if="open" class="modal">
    <p>¡Hola desde el modal!</p>
    <button @click="open = false">Cerrar</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

El componente contiene un `<button>` para disparar la apertura del modal, y un `<div>` con una clase de `.modal`, lo que contendrá el contenido del modal y un botón para cerrarse.

Cuando utiliza este componente dentro de la estructura HTML inicial, hay un número de problemas potenciales:

- `position: fixed` solo posiciona el elemento respecto al viewport cuando no hay elemento ancestro que tenga propiedad `transform`, `perspective` o `filter` establecida. Si, por ejemplo, pretendemos animar el elemento ancestro `<div class="outer">` con una transformación (transform) CSS ¡rompería el layout del modal!

- El `z-index` del modal es obligado por los elementos que lo contengan. Si hay otro elemento que se superpone con `<div class="outer">` y tiene un mayor `z-index`, le cubriría a nuestro modal. 

`<Teleport>` proporciona una manera limpia para solucionar estas problemas, mediante permitirnos salir de la estructura DOM anidada. Dejamos modificar `<MyModal>` para usar `<Teleport>`:

```vue-html{3,8}
<button @click="open = true">Abrir Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>¡Hola desde el modal!</p>
    <button @click="open = false">Cerrar</button>
  </div>
</Teleport>
```

El objetivo `to` de `<Teleport>` espera un string de selector CSS u un nodo DOM actual. Aquí, estamos escencialmente indicando a Vue a "**teletransportar** este fragmento de template **a** la etiqueta **`body`**".

Puedes cliquear el botón abajo e inspeccionar la etiqueta `<body>` mediante el devtools de tu navigador:

<script setup>
let open = $ref(false)
</script>

<div class="demo">
  <button @click="open = true">Abrir Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">¡Hola desde el modal!</p>
        <button @click="open = false">Cerrar</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Puedes combinar `<Teleport>` con [`<Transition>`](./transition) para crear modales animados - ve [Ejemplo aquí](/examples/#modal).

:::tip
El objetivo `to` de teleport debe existir ya en el DOM cuando el componente `<Teleport>` sea montado. Idealmente, este debería ser un elemento afuera de la aplicación Vue entera. Si se apunta a otro elemento renderizado por Vue, debes asegurarte de que el elemento sea montado antes del `<Teleport>`.
:::

## Utilizar con Componentes

`<Teleport>` solo altera la estructura DOM renderizada - no afecta la jeraquía lógica de los componentes. Es decir, si `<Teleport>` contiene un componente, ese componente mantendrá como un hijo lógico del padre componente que contenga el `<Teleport>`. El pasar de props y emisión de eventos continuarán de funcionar del mismo modo.

Este también significa que las inyecciones desde componentes padres funcionan como se espera, y que el componente hijo será anidado bajo el componente padre en el Devtools Vue, en lugar de ser colocado al lugar donde el contenido actual haya sido movido.

## Deshabilitar Teleport

En algunos casos, querríamos deshabilitar `<Teleport>` condicionalmente. Por ejemplo, querríamos renderizar un componente como una superposición para escritorio, pero en línea en el móvil. `<Teleport>` soporta la prop `disabled` que puede alternarse dinámicamente:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Dónde el estado `isMobile` puede actualizarse dinámicamente mediante detectar cambios de media query.

## Múltiples Teleportes en el mismo objetivo

Un caso de uso común podría ser un componente `<Modal>` reutilizable, con la posibilidad de activar múltiples instancias al mismo tiempo. Para este tipo de escenario, múltiples `<Teleport>` pueden montar sus contenidos al mismo elemento de objetivo. El orden será simple añadir - los montados posteriores serán colocados después de los anteriores dentro del elemento de objetivo.

Dado el siguiente uso:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

El resultado renderizado sería:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

---

**Relacionados**

- [Referencia de API de `<Teleport>`](/api/built-in-components.html#teleport)
- [Manejar Teleportes en SSR](/api/ssr.html#handling-teleports)
