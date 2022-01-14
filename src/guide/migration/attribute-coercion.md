---
badges:
  - breaking
---

# Comportamiento de Coacción de Atributos <MigrationBadges :badges="$frontmatter.badges" />

::: info Info
Este es un cambio de API internal de nivel inferior y no afecta la mayor parte de los desarrolladores.
:::

## Visión General

Aquí es una visión general de nivel superior de los cambios:

- Abandona el concepto internal de atributos enumerados y los trata a los atributos como atributos normales que no son booleanos.
- **BREAKING**: Ya no elimina un atributo si su valor es booleano `false`. En su lugar, se va a establecer como attr="false". Para eliminar el atributo, utiliza `null` o `undefined`.

Para más información, !sigue leyendo!

## Sintaxis para 2.x

En 2.x, tuvimos las siguientes estrategias para coaccionar los valores de `v-bind`:

- Para unos pares de atributo/elemento, Vue siempre utiliza el atributo de IDL correspondiente (propiedad): [como `value` de `<input>`, `<select>`, `<progress>`, etc](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L11-L18).

- Para "[atributos booleanos](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L33-L40)" y [xlinks](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L44-L46), Vue los elimina si son "falsos" ([`undefined`, `null` o `false`](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L52-L54)) y de lo contrario los agrega (vea [aquí](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L66-L77) y [aquí](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L81-L85)).

- Para "[atributos enumerados](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L20)" (actualmente `contenteditable`, `draggable` y `spellcheck`), Vue trata de [coaccionar](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L24-L31) los a cadena de caracteres (con tratamiento especial para `contenteditable` por ahora, para corregir [vuejs/vue#9397](https://github.com/vuejs/vue/issues/9397)).

- Para otros atributos, eliminamos valores "falsos" (`undefined`, `null`, o `false`) y establecemos otros valores tal cual (vea [aquí](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L92-L113)).

La siguiente tabla describe cómo Vue coacciona "atributos enumerados" de manera diferente comparada con los atributos normales que no son booleanos.

| Expresión de Vinculación  | `foo` <sup>normal</sup> | `draggable` <sup>enumerado</sup> |
| ------------------- | ----------------------- | --------------------------------- |
| `:attr="null"`      | -                       | `draggable="false"`               |
| `:attr="undefined"` | -                       | -                                 |
| `:attr="true"`      | `foo="true"`            | `draggable="true"`                |
| `:attr="false"`     | -                       | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`               | `draggable="true"`                |
| `attr=""`           | `foo=""`                | `draggable="true"`                |
| `attr="foo"`        | `foo="foo"`             | `draggable="true"`                |
| `attr`              | `foo=""`                | `draggable="true"`                |

Podemos ver desde la tabla arriba, la implementación actual coacciona `true` a `'true'`, pero elimina el atributo si es `false`. Este también conduce a inconsistencia y requiere que los usuarios coaccionen manualmente los valores booleanos a cadena de caracteres en los casos de usuarios muy comunes como atributos de `aria-*` como por ejemplo `aria-selected`, `aria-hidden`, etc.

## Sintaxis para 3.x

Pretendemos abandonar este concepto internal  de "atributos enumerados" y los tratamos como atributos HTML normales que no son booleanos.

- Este resuelve la inconsistencia entre atributos normales que no son booleanos y "atributos enumerados"
- También hace posible utilizar valores en vez de `'true'` and `'false'`, o incluso palabras de clave (keywords) que van a venir, para atributos como `contenteditable`

Para atributos que no son booleanos, Vue dejará eliminarlos si son `false` y los coacciona a `'false'` en su lugar.

- Este resuelve la inconsistencia entre `true` y `false` y lo hace más fácil producir atributos `aria-*`

La siguiente tabla describe el nuevo comportamiento:

| Expresión de Vinculación  | `foo` <sup>normal</sup>    | `draggable` <sup>enumerated</sup> |
| ------------------- | -------------------------- | --------------------------------- |
| `:attr="null"`      | -                          | - <sup>*</sup>                    |
| `:attr="undefined"` | -                          | -                                 |
| `:attr="true"`      | `foo="true"`               | `draggable="true"`                |
| `:attr="false"`     | `foo="false"` <sup>*</sup> | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`                  | `draggable="0"` <sup>*</sup>      |
| `attr=""`           | `foo=""`                   | `draggable=""` <sup>*</sup>       |
| `attr="foo"`        | `foo="foo"`                | `draggable="foo"` <sup>*</sup>    |
| `attr`              | `foo=""`                   | `draggable=""` <sup>*</sup>       |

<small>*: cambiado</small>

La coacción para atributos booleanos permanece inalterada.

## Estrategia para Migración

### Atributos enumerados

La ausencia de un atributo enumerado y `attr="false"` puede producir valores diferentes de atributo IDL (lo que reflejará el estado actual), descrito como el siguiente:

| Atributo enumerado ausente | Atributo IDL & valor                     |
| ---------------------- | ------------------------------------ |
| `contenteditable`      | `contentEditable` &rarr; `'inherit'` |
| `draggable`            | `draggable` &rarr; `false`           |
| `spellcheck`           | `spellcheck` &rarr; `true`           |

Debido a que ya no coaccionamos `null` a `'false'` para "propiedades enumeradas" en 3.x, en el caso de `contenteditable` y `spellcheck`, los desarrolladores necesitarán cambiar estas expresiones de `v-bind` que fueron utlizadas para resolver a `null` para resolver a `false` o `'false'` para mantener el mismo comportamiento como 2.x.

En 2.x, los valores inválidos fueron coaccionados a `'true'` para los atributos enumerados. Este usualmente no es intencionado y probablemente no deben confiar de este a gran escala. En 3.x `true` o `'true'` deben ser especificados explícitamente.

### Coaccionar `false` a `'false'` en vez de eliminar el atributo

En 3.x, `null` o `undefined` debe ser utilizado para explícitamente eliminar un atributo.

### Comparación entre el comportamiento 2.x & 3.x

<table>
  <thead>
    <tr>
      <th>Atributo</th>
      <th><code>v-bind</code> value <sup>2.x</sup></th>
      <th><code>v-bind</code> value <sup>3.x</sup></th>
      <th>Salida de HTML</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">2.x “atributo enumerado”<br><small>i.e. <code>contenteditable</code>, <code>draggable</code> and <code>spellcheck</code>.</small></td>
      <td><code>undefined</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>eliminado</i></td>
    </tr>
    <tr>
      <td>
        <code>true</code>, <code>'true'</code>, <code>''</code>, <code>1</code>,
        <code>'foo'</code>
      </td>
      <td><code>true</code>, <code>'true'</code></td>
      <td><code>"true"</code></td>
    </tr>
    <tr>
      <td><code>null</code>, <code>false</code>, <code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
    <tr>
      <td rowspan="2">Otros atributos que no son booleanos<br><small>eg. <code>aria-checked</code>, <code>tabindex</code>, <code>alt</code>, etc.</small></td>
      <td><code>undefined</code>, <code>null</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>eliminado</i></td>
    </tr>
    <tr>
      <td><code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
  </tbody>
</table>

[Indicadores de compilación de migración:](migration-build.html#compat-configuration)

- `ATTR_FALSE_VALUE`
- `ATTR_ENUMERATED_COERCION`
