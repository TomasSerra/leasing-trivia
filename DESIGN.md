# Design

Sistema visual de la trivia de Leasing Argentina. Kiosco PWA, TV touch vertical 9:16.

## Theme

Un solo modo (claro de base), pensado para una TV encendida en un stand con luz ambiente fuerte. No hay dark mode: el dispositivo y el entorno son fijos y conocidos.

Estrategia de color: **dos mundos**.
- **Mundo claro** (inicio + preguntas): fondo `surface` casi blanco, tinte hacia el azul de marca. Máxima legibilidad para leer y decidir rápido. El isotipo aparece como campo tenue de fondo (atmósfera de marca).
- **Mundo pleno** (resultado): drench a sangre completa. Victoria en teal profundo, derrota en azul profundo. Es el momento emocional; el color carga la reacción.

La transición entre mundos (wipe vertical con `clip-path`, ~520ms, ease-out-expo) es el gesto memorable del producto.

## Color

Todos los tokens se declaran una sola vez en `src/index.css` dentro de `@theme` (Tailwind v4) y salen como utilidades (`bg-brand-deep`, `text-ink`, `border-correct`…). **Regla dura: ningún color fuera de esta lista.** Si un color no es un token, no se usa.

### Literales de marca (isotipo + CSS del sitio leasingdeargentina.com.ar)

| Token | Hex | Uso |
|---|---|---|
| `brand-deep` | `#005C9C` | azul principal, drench de derrota, CTA |
| `brand-mid` | `#6197C0` | azul medio |
| `brand-light` | `#98C9ED` | bordes de opciones, pips inactivos |
| `brand-pale` | `#C9E3F5` | pastillas A/B/C, fondos suaves, riel vacío |
| `brand-cyan` | `#049BC2` | acento, relleno del timer, hover |
| `brand-sky` | `#5BCAF4` | acento claro |
| `brand-teal` | `#00B9BF` | teal de marca (decorativo; no lleva texto encima) |
| `brand-slate` | `#504F51` | gris del logotipo |

### Derivados (mismo matiz, elegidos por contraste)

| Token | Hex | Ratio medido |
|---|---|---|
| `surface` | `#F4F8FC` | fondo del mundo claro |
| `ink` | `#0B2F4A` | texto principal — **12.95:1** sobre `surface` |
| `ink-muted` | `#504F51` | texto secundario — **7.63:1** sobre `surface` |
| `teal-deep` | `#00787E` | drench de victoria — **5.27:1** con blanco |

### Feedback (verde/rojo, aprobados por el cliente)

Elegidos para armonizar con el teal de marca y ambos legibles con texto blanco. La señal siempre va acompañada de ícono (✓/✗), nunca sólo color.

| Token | Hex | Ratio con blanco |
|---|---|---|
| `correct` | `#167C43` | **5.25:1** |
| `incorrect` | `#B23227` | **6.22:1** |

`incorrect` cumple doble función: respuesta equivocada y urgencia del timer en los últimos 10s. Es el mismo significado ("esto va mal") y evita sumar un rojo más a la paleta. Contrastes del riel: blanco sobre `brand-cyan` 3.24:1 y sobre `incorrect` 6.22:1 (texto grande, umbral 3:1); `brand-deep` sobre `brand-pale` 5.24:1 e `incorrect` sobre `brand-pale` 4.67:1.

`white on brand-deep` = 6.97:1. Nota: `brand-teal` (#00B9BF) da sólo 2.42:1 con blanco, por eso la victoria usa `teal-deep`, no `brand-teal`.

## Typography

Una sola familia: **Lato** (la tipografía de marca), auto-hosteada en `/public/fonts` (400/700/900, woff2, subset latin, `font-display: swap`) para funcionar sin red. Jerarquía por peso y tamaño, no por familias.

- Display / titulares: Lato Black (900), `letter-spacing: -0.02em a -0.03em`, `text-wrap: balance`.
- Cuerpo y opciones: Lato 700 (opciones) y 400 (descripciones).
- Escalas grandes por contexto TV: titular de inicio ~5.4rem, enunciado ~2.5rem, opciones ~1.7rem.

### Escalado por viewport

`:root { font-size: min(1.25vh, 2.22vw) }`. Toda la UI es rem, así que escala proporcionalmente con la pantalla: 24px a 1080×1920, 48px a 4K. El doble tope (vh y vw) evita desbordes si la ventana no es exactamente 9:16.

## Layout

- Contenedor raíz `h-dvh` con fallback `vh`/`dvh` para WebViews viejos de Android TV.
- Preguntas: enunciado arriba, opciones como fajas altas apiladas (`min-h-13vh`), pastilla de letra + texto. Sin grid; flex column.
- Resultado: encabezado centrado + ilustración según aciertos + botonera fija abajo. Con 0 aciertos, marcador `0 de 0 correctas`, agradecimiento y subtítulo centrados.
- Riel de timer full-bleed en el tope de la pantalla de pregunta.

## Components

- **AnswerTile** — opción táctil. Estados: `idle`, `selected` (acuse ~140ms), `correct` (verde+✓), `incorrect` (rojo+✗), `reveal-correct` (borde verde+✓ cuando el jugador erró). No conoce la partida (ISP).
- **TimerRail** — riel de tiempo de altura fija (2.6rem) con el contador siempre visible: el tiempo es la tensión del juego, no un detalle que aparece al final. Se consume por `transform: scaleX`; en los últimos 10s pasa a `incorrect`. Los segundos van siempre en blanco con sombra para sostener contraste.
- **ProgressPips** — una marca por pregunta; las respondidas muestran verde/rojo, la actual se alarga.
- **StatsButton / StatsDialog** — el disparador es una zona **invisible** de 14vh que cubre la esquina superior derecha del inicio: es para el operador del stand, no para el visitante, así que no ocupa lugar en la composición. Sigue siendo un `<button>` con nombre accesible y anillo de foco. El modal (Radix `Dialog`) muestra partidas por día (hora AR) + total, con estado vacío.
- **AttractScreen / BrandField / Iso / Logo** — marca y kiosco (ver Marca, más abajo).

## Motion

- Wipe entre mundos (`world-wipe`, clip-path, 520ms, ease-out-expo).
- Entradas de contenido (`content-rise`) por pregunta y en el resultado.
- Pulso del isotipo en la atractora (`attract-pulse`).
- Acuse de tile al tocar (scale 0.99, 140ms) antes del reveal.
- Todo con alternativa `prefers-reduced-motion: reduce`.

## Marca

Los assets son los originales entregados por el cliente, en `public/brand/`:

| Archivo | Uso |
|---|---|
| `logo.svg` | lockup completo (isotipo + logotipo). Sólo sobre fondo claro, a color. |
| `iso.svg` | isotipo con sus cinco degradés. Fuente de `ISO_PATHS_COLOR`. |
| `icon-white.svg` | silueta plana de una tinta. Fuente de `ISO_PATHS_SOLID`. |

Reglas de uso:

- **No existe ninguna otra marca gráfica.** Sólo estos tres.
- `<Logo>` sirve `logo.svg` como `<img>`: conserva el original intacto y no necesita teñirse porque va siempre a color sobre claro.
- `<Iso tone="color">` sobre fondos claros; `<Iso tone="solid">` sobre fondos de color, pintado con `currentColor`.
- Va inline (no `<img>`) porque la variante plana hereda color del contexto y los degradés necesitan IDs únicos por instancia (`useId`) para no colisionar cuando hay varios isotipos en pantalla.
- `<BrandField>` es el campo atmosférico del fondo: la silueta plana a escala enorme y baja opacidad. Usa la plana y no la de degradés porque a esa escala los degradés ensucian y compiten con el texto. Sobre claro va en `brand-deep` al 4-5%; sobre color, en blanco al 8-10%.

La geometría vive en `src/components/brand/isoGeometry.ts`, generada desde los SVG. Si el cliente entrega un isotipo nuevo, ese archivo es el único que cambia.

Los íconos PWA se generan desde estos assets: el regular es el isotipo a color sobre `surface`; el maskable es la silueta blanca sobre `brand-deep` dentro de la zona segura del 80%.
