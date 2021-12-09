# Los Mecanismos de Renderización y Optimizaciones

> No se requiere leer esta página con el propósito de aprender bien cómo utilizar Vue, pero proporciona más información, si tendría la curiosidad de saber cómo funciona la renderización bajo el capó.

## El DOM Virtual

Ahora que sabemos cómo los observadores actualizan los componentes, ¡podría preguntarse de qué manera estos cambios se reflejan en el DOM eventualmente! Probablemente ya ha oido del DOM virtual anteriormente, muchos frameworks, incluso Vue, utilizan este paradigma para aseguar que nuestras interfaces reflejen los cambios que estamos actualizando en JavaScript, efectivamente

<div class="reactivecontent">
  <common-codepen-snippet title="¿Cómo funciona el DOM Virtual?" slug="KKNJKbw" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

Hacemos una copia del DOM en JavaScript llamada el DOM virtual, hacemos esto porque tocar al DOM con JavaScript es costoso computacionalmente. Mientras hacer actualizaciones en JavaScript es económico, encontrar los nodos DOM requeridos y actualizarlos con JavaScript es costoso. Por eso hacemos las llamadas por lotes y cambiamos el DOM de una sola vez.

El DOM virtual es un objeto JavaScript ligero, creado por una función _render_. Toma tres argumentos: el elemento, un objeto con datos, _props_, atributos y más, y una matriz. La matriz es el lugar dónde pasamos los hijos, los cuales también tienen los tres argumentos, y luego ellos pueden poseer hijos y así sucesivamente, hasta que construyamos un árbol completo de elementos.

Si necesitamos actualizar los elementos de una lista, lo hacemos en JavaScript, utilizando la reactividad mencionada anteriormente. Entonces hacemos todos los cambios a la copia JavaScript, el DOM virtual, y obtenemos una diferencia entre este y el DOM real. Solo entonces hagamos nuestras actualizaciones contra los que hayan cambiado. ¡El DOM virtual nos permite realizar actualizaciones eficientes a nuestras interfaces de usuarios!
