# Diccionario de estilos · Lirio & Hibisco

---

## 1. Identidad de marca

El nombre "Lirio & Hibisco" une dos flores con carácter opuesto: el lirio,
esbelto y de líneas rectas, y el hibisco, abierto y de pétalos redondeados.
El icono de la app —una acuarela rosa de ambas flores superpuestas— es la
referencia visual de toda la marca: trazo suave, degradados delicados,
sin contornos duros ni colores planos saturados.

De ahí se desprenden tres principios que guían cada decisión de diseño:

- **Cálido antes que frío.** El fondo no es blanco puro (`#FCFAF8`), es un
  hueso cálido, como el papel de acuarela. El blanco (`bg-white`) se reserva
  para superficies que necesitan destacar (tarjetas, barras) sobre ese fondo.
- **Un solo acento, usado con disciplina.** El rosa marca (`#A81245`) es la
  única voz de color fuerte en la interfaz: botones primarios, títulos
  editoriales, iconos activos. No compite con otros tonos saturados; los
  demás colores del sistema son neutros cálidos o estados semánticos
  (error/éxito).
- **Editorial, no corporativo.** La tipografía itálica (Lora) en los
  titulares imita la caligrafía de una etiqueta de invernadero o el pie de
  foto de una revista de jardinería — no una app de productividad. El
  cuerpo de texto, en cambio, usa la fuente del sistema sin adornos: la
  personalidad vive en los titulares, no en cada línea.

En la práctica, esto significa: si una pantalla nueva necesita "sentirse
Lirio & Hibisco", empieza por el fondo cálido, un titular en Lora itálica
color marca, y deja que el rosa aparezca solo en el elemento de acción
principal.

---

## 2. Tipografía

### 2.1 La fuente de marca: Lora Italic

Lora itálica es la firma tipográfica del proyecto. Se usa exclusivamente en
**titulares**, nunca en cuerpo de texto, etiquetas ni contenido de listas.
Está cargada vía `expo-font` en `app/_layout.tsx` bajo el nombre
`Lora-Italic`.

Punto importante: **la fuente ya es itálica en sí misma**. No se combina
`font-['Lora']` con la clase utilitaria `italic` — esa combinación no
produce una itálica real en React Native, solo la fuente base sin inclinar.

| Uso | Clase | Tamaño / interlineado |
|---|---|---|
| Logo / wordmark | `font-['Lora-Italic'] text-[#A81245]` | `text-[32px] leading-[41px]` |
| Título de pantalla | `font-['Lora-Italic'] text-[#A81245]` | `text-[28px] leading-9` |
| Título de header (tab bar) | `font-['Lora-Italic'] text-[#A81245]` | `text-xl` |
| Frase sobre imagen hero | `font-['Lora-Italic'] text-white` | `text-xl leading-7` |

### 2.2 La fuente de trabajo: sistema (sans-serif)

Todo lo demás —títulos de elementos en listas, descripciones, etiquetas de
campo, mensajes, metadatos— usa la fuente por defecto del sistema, sin
declarar familia. La jerarquía se construye con tamaño, peso y color, no con
tipografías distintas.

| Rol | Clase | Cuándo usarla |
|---|---|---|
| Título de elemento en lista | `text-base font-semibold text-[#292724]` | Nombre de post, usuario, item |
| Texto secundario | `text-sm text-[#6E6B68]` | Descripciones, subtítulos |
| Etiqueta de campo | `text-xs font-semibold uppercase text-[#6E6B68]` | Encima de un input |
| Etiqueta de sección | `text-[10px] font-bold uppercase tracking-[0.12em] text-[#A09B95]` | Encabezados discretos que agrupan contenido |

**Regla de decisión rápida:** si el texto es parte de la *voz de marca*
(saluda, presenta, decora) → Lora itálica + rosa. Si el texto es
*información funcional* que el usuario lee para actuar → sistema + neutro.

---

## 3. Paleta de colores (diccionario de tokens)

Cada color tiene un rol único. No se mezclan roles: el beige decorativo,
por ejemplo, nunca sustituye al rosa en un botón, aunque visualmente
"combine".

| Token | Valor | Rol | Se usa en | No se usa en |
|---|---|---|---|---|
| `bg-screen` | `#FCFAF8` | Fondo cálido base | Fondo de toda pantalla | Tarjetas o barras (usan blanco) |
| `bg-surface` | `#FFFFFF` (white) | Superficie elevada | Tarjetas, barras, inputs | Fondo de pantalla completo |
| `brand-primary` | `#A81245` | Acción / marca / acento fuerte | Botones primarios, títulos Lora, iconos activos, tab activo | Fondos grandes, texto de cuerpo |
| `brand-primary-soft` | `#A81245` al 10% opacidad | Estado seleccionado suave | Chips activos, fondos de selección | Botones (demasiado sutil para CTA) |
| `decorative-beige` | `#DCC7A8` | Detalle decorativo | Avatares, swatches | Botones, CTAs — **nunca** un color de acción |
| `icon-well` | `#F4EEE7` | Fondo de icono circular | "Wells" en Settings y pantallas de admin | Fondo de pantalla o tarjeta |
| `border-neutral` | `#EAE6E1` | Borde discreto | Campos, separadores, botones secundarios, tab bar | Texto |
| `text-strong` | `#292724` | Texto principal | Títulos de lista, contenido | Texto decorativo de marca (usa `brand-primary`) |
| `text-secondary` | `#6E6B68` | Texto de apoyo | Descripciones, etiquetas, tab inactivo (variante) | Títulos principales |
| `text-muted` | `#A09B95` | Texto tenue / metadatos | Placeholders, fechas, ids, tab inactivo | Contenido que el usuario debe leer con prioridad |
| `state-error` | `text-red-600` / `bg-red-50` / `border-red-200` | Error | Mensajes y bordes de validación fallida | — |
| `state-success` | `text-green-700` / `bg-green-50` | Éxito | Confirmaciones | — |

### Por qué esta estructura funciona

El sistema tiene, en esencia, **un color de marca y cinco neutros cálidos**
(fondo, superficie, borde, y tres niveles de texto) más dos semánticos de
estado. Esa restricción deliberada es lo que hace que el rosa "brand-primary"
siga sintiéndose especial cada vez que aparece: si hubiera cinco tonos
saturados compitiendo, ninguno destacaría.

El `decorative-beige` y el `icon-well` son casos especiales: existen para dar
calidez a elementos puntuales (un avatar, un ícono envuelto) sin nunca
convertirse en color de acción. Si en algún momento un beige empieza a
usarse en un botón o un estado activo, es señal de que se está rompiendo la
jerarquía de la marca.

---

## 4. De la acuarela al pixel: cómo se traduce el icono

| Elemento del icono | Traducción al sistema de diseño |
|---|---|
| Rosa saturado de los pétalos centrales | `brand-primary` (`#A81245`) |
| Rosa pálido de los pétalos exteriores | `brand-primary-soft` (10% opacidad) |
| Fondo blanco/crema detrás de las flores | `bg-screen` (`#FCFAF8`) |
| Trazo suave, sin bordes duros | Esquinas muy redondeadas (`rounded-2xl`, `rounded-full`) y sombras difusas (`cardShadow`) en vez de bordes marcados |
| Textura orgánica y artesanal | Titulares en itálica (Lora), que rompen la rigidez de una grilla puramente sans-serif |

---

## 5. Ritmo y profundidad (referencia rápida)

Estos tokens no son color ni tipografía, pero son parte de cómo se percibe
la marca como "suave" y "cálida" en vez de "plana":

- **Espaciado por `gap-*`**, nunca `mt-*` acumulado: `gap-6` entre bloques,
  `gap-4` entre campos, `gap-2`/`gap-2.5` dentro de una tarjeta, `gap-1.5`
  entre etiqueta y control.
- **Sombra de tarjeta** (siempre como `style`, no clase):
  `shadowColor: 'rgba(92, 75, 54, 0.10)'`, difusa y cálida (tono marrón, no
  gris ni negro puro) — refuerza la sensación de papel y luz suave.
- **Esquinas redondeadas** consistentes: `rounded-2xl` en tarjetas y
  mensajes, `rounded-full` en botones, chips e inputs de búsqueda.

---

## 6. Cómo usar este documento junto a `ESTILOS.md`

- **`dict_styles.md` (este archivo)** responde "¿por qué este color, esta
  fuente, esta jerarquía?" — para decisiones de diseño nuevas o dudas de
  marca.
- **`ESTILOS.md`** responde "¿qué clase de NativeWind escribo ahora mismo?"
  — para implementación directa, componente por componente.

Si una pantalla nueva no encaja claramente en ningún patrón de `ESTILOS.md`,
vuelve a los principios de la sección 1 de este documento antes de inventar
una clase suelta.
