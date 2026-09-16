# AGENTS.md — CafeDeBarrio (Frontend)

Guía de diseño para cualquier agente que trabaje en el frontend de **CafeDeBarrio**. Es corta a propósito: si algo no está aquí, por defecto elige la opción más simple y neutra, no la más creativa.

## Filosofía

Flat design, minimal, limpio, **light**. Cero ruido visual. Cada elemento debe justificar su existencia; si dudas entre agregar algo o no, no lo agregues.

## Paleta de colores

Blanco y negro de forma sofisticada. **No usar toda la escala de Tailwind** (100, 200, 300... 950). Usar solo estos tokens, siempre:

| Uso                                  | Token Tailwind              |
| ------------------------------------ | --------------------------- |
| Fondo base                           | `white`                     |
| Fondo secundario / secciones sutiles | `neutral-50`                |
| Bordes / divisores                   | `neutral-200`               |
| Texto secundario / muted             | `neutral-500`               |
| Texto principal                      | `neutral-900`               |
| Acento (CTA, hover, estados activos) | `orange-500` / `orange-500` |

El acento ámbar se usa **poco y solo donde aporta valor**: botones primarios, enlaces activos, algún ícono puntual. Nunca como color de fondo grande ni decorativo.

No introducir grises intermedios (`neutral-300/400/600/700/800`) salvo necesidad real y justificada.

## Tipografía

- Fuente única: **Inter Tight**.
- Un solo peso: `font-normal` (400).
- Prohibido `font-bold`, `font-semibold`, `italic`. La jerarquía se logra con tamaño (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`...) y color (`neutral-900` vs `neutral-500`), no con peso ni estilo.

## Efectos

- **Sin sombras** (`shadow-*` prohibido).
- **Sin animaciones ni transiciones** (`transition-*`, `animate-*`, `duration-*` prohibidos).
- Sin gradientes.

## Bordes

- No usar bordes por defecto. Ni muchos ni muy pocos: solo cuando sea muy muy necesario (ej. divisor inferior del header con `border-b border-neutral-200`).
- En casos como la barra de búsqueda del header no colocar borde: diferenciar con fondo `neutral-50`, sin línea.
- `rounded-2xl` en todo (cards, botones, inputs, imágenes). No mezclar radios distintos.

## Uso de tokens Tailwind

- Solo tokens del sistema (`p-4`, `gap-6`, `text-sm`, etc). Prohibido arbitrary values (`text-[15px]`, `p-[13px]`, `w-[327px]`...).
- Excepción única: `max-w-[...]` puede usar valor arbitrario cuando el token estándar no encaja.
- **Optimizar el uso de tokens, no repetirlos por elemento.** Si varios hijos de un contenedor necesitan el mismo espaciado entre sí, usa `gap` en el padre en vez de `margin`/`padding` individual en cada hijo. Prefiere `flex`/`grid` + `gap` sobre márgenes manuales siempre que sea posible.
- Evita clases redundantes o duplicadas entre padre e hijo que resuelvan lo mismo dos veces.

## Resumen mental rápido

Blanco/negro (paleta corta) → un solo ámbar de acento, poco → Inter Tight 400 sin variantes → sin sombra, sin animación → `rounded-2xl` en todo → tokens estándar, `gap` antes que márgenes sueltos.
