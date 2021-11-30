# Manejar Casos Extremos

> Esta página asume que usted ya ha leído [Básicos de Componentes](component-basics.md). Léalo primero si usted es nuevo con componentes.

:::tip Note
Todas las funciones en esta página documentan el manejo de casos extremos, es decir, situaciones inusuales que a veces requieren doblar un poco las reglas de Vue. Sin embargo, tenga en cuenta que todas ellas tienen desventajas o situaciones en las que podrían ser peligrosas. Estos se anotan en cada caso, así que téngalos en cuenta cuando decida utilizar cada funcionalidad.
:::

## Controlar las actualizaciones

Gracias al sistema de reactividad de Vue, siemple sabe el tiempo adecuado para actualizar (si lo utiliza correctamente). Sin embargo, hay casos extremos, cuando querría forzar una actualización, a pesar de que no hay dato reactivo que haya cambiado. Además, hay otros casos cuando querría prevenir actualizaciones innecesarios.

### Forzar una actualización

Si le encuentra que necesita forzar una actualización en Vue, en el 99.99% de los casos, ha cometido un error en alguna parte. Por ejemplo, podría depender un estado que no sea rastreado por el sistema de reactividad de Vue, p. ej. con propiedades de `data` agregados después de la creación del componente.

Sin embargo, si ha excluido el caso arriba y le encuentra en esta situación extremadamente rara de tener que forzar una actualización manualmente, puede hacerlo con [`$forceUpdate`](../api/instance-methods.html#forceupdate).

### Componentes estáticos de bajo costo con `v-once`

Renderizar elementos HTML planos es muy rápido en Vue, pero en algunas veces podría tener un componente que contenga **muchos** contenidos estáticos. En estos casos, puede aseguarse de que solo se evaule una vez y se almancene en caché agregando la directiva `v-once` al elemento raíz, como esto:

```js
app.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Condiciones de Servicio</h1>
      ... muchos contenidos estáticos ...
    </div>
  `
})
```

:::tip
Una vez más, intente no abusar de este patrón. Si bien es conveniente en aquellos casos raros en los que tiene que generar una gran cantidad de contenido estático, simplemente no es necesario a menos que realmente note una renderización lenta, además, podría causar mucha confusión más adelante. Por ejemplo, imagine a otro desarrollador que no está familiarizado con v-once o simplemente no lo ve en el template. Pueden pasar horas tratando de averiguar por qué el template no se actualiza correctamente.
:::
