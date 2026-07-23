# VALDIVIA — Diseño del sitio (todo para levantarlo)

Paquete de **diseño** para el webmaster. Dominio: **valdiviasec.com** · Contacto: info@valdiviasec.com

Aquí está **todo lo necesario para levantar el sitio en temas de diseño**: sistema de diseño (tokens + fuentes), assets (logos, favicons, OG), y los mockups de cada página/sección como referencia visual.

> Los **mockups/** son la dirección visual autoritativa. Constrúyelo cerca de ellos usando `design-tokens.css` y las fuentes de `fuentes/`.

---

## 📁 Contenido
```
design-tokens.css        sistema de diseño: variables CSS (color/tipografía/radios) + @font-face + clases base
paleta.(svg|png)         paleta de marca (HEX + tokens)
fuentes/                 Space Grotesk + JetBrains Mono (.ttf, OFL) + licencia
favicons/                favicon.svg · .ico · PNG 16/32/48/180/192/512 · site.webmanifest
og-image.(svg|png)       imagen de preview social (Open Graph, 1200×630)
logos/                   isotipo (color/mono) + lockups (normal / negativo)
headers/                 barra de navegación — normal (oscuro) y negativo (claro)
mockups/                 8 tableros de diseño (SVG + PNG @2x)
```

## 🎨 Mockups (dirección de diseño)
| # | Tablero | Define |
|---|---|---|
| 01 | paleta | colores (tokens/HEX) + escala tipográfica |
| 02 | logos | logo normal (oscuro) y negativo (claro) |
| 03 | header | barra de nav normal + negativo |
| 04 | homepage | hero + stats + inicio de "latest research" |
| 05 | listing | patrón de listado de artículos (cards + filtros) |
| 06 | card-firma | ficha de research (CVE) + firma de mail (claro/oscuro) |
| 07 | article | patrón de artículo / writeup |
| 08 | secciones | servicios + contacto (CTA) + footer |

## 🔤 Tipografía
- **Space Grotesk** — Display 700 (titulares/wordmark), Medium 500 (subtítulos), Regular 400 (body).
- **JetBrains Mono** — voz técnica, labels, URLs, código, prompts `$ …`.
- OFL (libres). Cárgalas con el `@font-face` de `design-tokens.css`.

## 🖼️ Logos — normal vs negativo
- **normal** = wordmark hueso, para fondos **oscuros**. **negativo** = wordmark obsidiana, para fondos **claros**.
- El **isotipo** (squircle terracota + V) es igual en ambos. `isotipo-mono.svg` = una sola tinta.

## 🔖 `<head>` sugerido
```html
<link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicons/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/favicons/favicon-180.png">
<link rel="manifest" href="/favicons/site.webmanifest">
<meta property="og:image" content="/og-image-1200x630.png">
<meta name="theme-color" content="#0A0A0A">
```

## ✅ Reglas de marca
- Un solo acento (terracota). Fondo obsidiana. Texto hueso.
- Terracota `#C4522A` **solo** en texto grande/bold; en texto pequeño usar `#D97A55`.
- Voz técnica en mono (`$ comando_`). Fondo = greca escalonada (~6–10% opacidad).
- Tagline: **We find what's underneath.** ("underneath" en terracota).

## 🌐 Estructura de páginas sugerida
`/` Home · `/research` listado · `/research/<slug>` artículo · `/cves` · `/ctf` · `/talks` · `/contact`
