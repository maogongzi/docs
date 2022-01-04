# API del Alcance de Efectos <Badge text="3.2+" />

:::info
El alcance de efectos es una API avanzada principalmente destinada a autores de librerías. Para más detalles sobre cómo apalancar esta API, por favor consulte su [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondiente.
:::

## `effectScope`

Crea un objeto de alcance de efecto que puede capturar los efectos reactivos (p. e.j. _computed_ y observadores) creados dentro de sí para que estos efectos pueden ser eliminados juntos.

**Tipar:**

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // undefined si el alcance es inactivo
  stop(): void
}
```

**Ejemplo:**

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Cuenta: ', doubled.value))
})

// para eliminar todos efectos en el alcance
scope.stop()
```

## `getCurrentScope`

Retorna el [alcance de efecto](#effectscope) activo actual si hay uno.

**Tipar:**

```ts
function getCurrentScope(): EffectScope | undefined
```

## `onScopeDispose`

Registra un callback de eliminación en el [alcance de efecto](#effectscope) activo actual. El callback será invocado cuando el alcance de efecto asociado sea detenido.

Este método puede ser utilizado como una sustitución _non-component-coupled_ de `onUnmounted` en funciones de composición reutilizables, debido a que la función `setup()` de cada componente Vue es también invocado en un alcance de efecto.

**Tipar:**

```ts
function onScopeDispose(fn: () => void): void
```
