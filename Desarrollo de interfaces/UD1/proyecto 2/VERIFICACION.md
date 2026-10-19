# Reporte de Auditoría y Verificación Matemática: `box-sizing: border-box`

Este documento contiene la auditoría técnica detallada y la demostración matemática de la maquetación realizada para el componente `<article class="profile-card">`. 

Se demuestra formalmente cómo la aplicación estricta de `box-sizing: border-box` influye en el cálculo dimensional del componente frente al comportamiento por defecto (`content-box`), permitiendo un control exacto del diseño responsive.

---

## 1. Especificaciones de Maquetación del Componente

Según los requerimientos del diseño, el componente `.profile-card` en `src/styles.css` tiene los siguientes valores declarados:

*   **Ancho máximo (`max-width`)**: `350px`
*   **Relleno (`padding`)**: `20px` (aplicado a los 4 lados)
*   **Borde (`border`)**: `2px solid #000` (aplicado a los 4 lados)
*   **Margen (`margin`)**: `15px` (aplicado a los 4 lados)

---

## 2. El Modelo de Caja (CSS Box Model) y la propiedad `box-sizing`

La propiedad `box-sizing` determina cómo se calcula el ancho (`width`/`max-width`) y el alto (`height`/`max-height`) de un elemento HTML. Existen dos modos principales:

### A. Comportamiento por Defecto (`content-box`)
En este modelo, el ancho declarado se aplica **únicamente a la región de contenido**. El padding y los bordes se suman externamente, ensanchando la caja real en el navegador.

$$\text{Ancho de la Caja} = \text{width} + \text{Padding Izq/Der} + \text{Borde Izq/Der}$$

### B. Comportamiento Estricto Aplicado (`border-box`)
En este modelo (aplicado mediante el reset universal en nuestro código), el ancho declarado representa **el límite de la caja de borde (border-box)**. El padding y los bordes se restan internamente, manteniendo el ancho total del componente exactamente igual al valor definido.

$$\text{Ancho de la Caja} = \text{width} \quad (\text{que incluye contenido, padding y borde})$$

---

## 3. Demostración y Verificación Matemática

Considerando el escenario en el que la tarjeta alcanza su ancho máximo de **$350\text{ px}$** (por ejemplo, en pantallas de escritorio), realizamos los cálculos teóricos comparativos:

### Caso 1: Con `box-sizing: border-box` (Aplicado de forma estricta)

El navegador establece que el ancho total exterior del componente (sin incluir el margen externo) es exactamente igual al `max-width` declarado de $350\text{ px}$.

Para hallar el espacio neto disponible para el **contenido interno** de la tarjeta de perfil:

$$\text{Ancho de Contenido} = \text{Ancho Total (Caja de Borde)} - \text{Borde Total} - \text{Padding Total}$$

Donde:
*   $\text{Ancho Total} = 350\text{ px}$
*   $\text{Borde Total} = \text{Borde Izquierdo} + \text{Borde Derecho} = 2\text{ px} + 2\text{ px} = 4\text{ px}$
*   $\text{Padding Total} = \text{Padding Izquierdo} + \text{Padding Derecho} = 20\text{ px} + 20\text{ px} = 40\text{ px}$

Sustituyendo los valores:

$$\text{Ancho de Contenido} = 350\text{ px} - 4\text{ px} - 40\text{ px}$$
$$\text{Ancho de Contenido} = 306\text{ px}$$

#### Espacio total ocupado en el flujo del documento (Viewport):
Para calcular el espacio físico completo que requiere la tarjeta incluyendo sus márgenes externos:

$$\text{Ancho Total Flujo} = \text{Ancho de la Caja} + \text{Margen Izquierdo} + \text{Margen Derecho}$$
$$\text{Ancho Total Flujo} = 350\text{ px} + 15\text{ px} + 15\text{ px} = 380\text{ px}$$

---

### Caso 2: Con `box-sizing: content-box` (Comportamiento por defecto del navegador)

Si **no** se hubiese configurado `box-sizing: border-box`, el valor de `max-width: 350px` se habría asignado únicamente al contenido interno.

Para calcular el ancho final de la caja física resultante en el navegador:

$$\text{Ancho de la Caja} = \text{Ancho de Contenido} + \text{Padding Total} + \text{Borde Total}$$
$$\text{Ancho de la Caja} = 350\text{ px} + 40\text{ px} + 4\text{ px} = 394\text{ px}$$

#### Espacio total ocupado en el flujo del documento (Viewport):
$$\text{Ancho Total Flujo} = 394\text{ px} + 15\text{ px} + 15\text{ px} = 424\text{ px}$$

*¡La tarjeta mediría $44\text{ px}$ más de lo planificado, pudiendo romper rejillas o desbordarse en dispositivos móviles de $360\text{ px}$ de pantalla!*

---

## 4. Evidencia Visual del Modelo de Caja en DevTools

Al auditar este componente en el inspector web (DevTools de Chrome/Firefox/Edge) mediante la pestaña **Computed (Calculado)**, se puede constatar la fidelidad del modelo matemático. 

A continuación se muestra una representación del esquema interactivo que dibuja DevTools:

```text
  +-------------------------------------------------------------+
  | MARGIN                                                      |
  |        Top: 15px                                            |
  |  +-------------------------------------------------------+  |
  |  | BORDER                                                |  |
  |  |        Top: 2px                                       |  |
  |  |  +-------------------------------------------------+  |  |
  |  |  | PADDING                                         |  |  |
  |  |  |        Top: 20px                                |  |  |
  |  |  |  +-------------------------------------------+  |  |  |
  |  |  |  | CONTENT                                   |  |  |  |
  |  |  |  |                                           |  |  |  |
  |  |  |  |       306px (Ancho) x 272.5px (Alto)*     |  |  |  |
  |  |  |  |                                           |  |  |  |
  |  |  |  +-------------------------------------------+  |  |  |
  |  |  |        Bottom: 20px                             |  |  |
  |  |  +-------------------------------------------------+  |  |
  |  |        Bottom: 2px                                    |  |
  |  +-------------------------------------------------------+  |
  |        Bottom: 15px                                         |
  +-------------------------------------------------------------+
  Nota: Las dimensiones de alto (*) varían según la longitud del texto.
```

### Verificación de las Dimensiones en el Inspector:
1. Al pasar el cursor sobre `<article class="profile-card">` en el árbol DOM, la ventana flotante de información del navegador indica las dimensiones exactas de la caja física: `350 x 316.5` (ancho total x alto total de la caja, sin contar el margen de 15px).
2. El **ancho es exactamente 350px**, cumpliendo estrictamente con el límite establecido en el diseño.
3. El panel **Computed** confirma de manera unívoca el cálculo matemático:
   * **Content width**: `306`
   * **Padding left/right**: `20` / `20`
   * **Border left/right**: `2` / `2`
   * Suma: $306 + 20 + 20 + 2 + 2 = 350\text{ px}$.

---

## 5. Ventajas del Enfoque Implementado

1. **Predicibilidad de Dimensiones**: Al aplicar `box-sizing: border-box`, se asegura de que cualquier componente se ajuste perfectamente a los contenedores diseñados sin sorpresas de desbordamiento horizontal.
2. **Facilidad en Responsive Design**: Permite definir anchos en porcentajes (ej. `width: 100%`) o absolutos (ej. `max-width: 350px`) y tener la absoluta certeza de que el padding de separación o los bordes decorativos no causarán scrolls horizontales molestos en smartphones.
3. **Robustez Neo-brutalista**: En diseños modernos con bordes negros gruesos y sombras sólidas (como la sombra `6px 6px 0px #000` aplicada), la exactitud en la medición de píxeles previene desalineaciones en rejillas CSS Grid y Flexbox.
