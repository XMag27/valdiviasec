---
title: 'Escribiendo posts con Markdown'
description: 'Guía de formato para contribuidores del blog'
pubDate: 'Jul 22 2026'
author: 'ValdiviaSec'
tags: ['guía', 'markdown', 'contribuir']
---

Esta guía te muestra cómo escribir posts para el blog de ValdiviaSec usando Markdown.

## Frontmatter

Cada post necesita un encabezado YAML con:

```yaml
---
title: 'Título del post'
description: 'Breve descripción'
pubDate: 'Jul 22 2026'
author: 'Tu nombre'
tags: ['tag1', 'tag2']
---
```

## Formato básico

Puedes usar **negritas**, *cursivas* y `código inline`.

### Bloques de código

```python
def hello():
    print("¡Hola ValdiviaSec!")
```

### Listas

- Item uno
- Item dos
- Item tres

### Enlaces

[ValdiviaSec](https://valdiviasec.com)

## Cómo publicar

Puedes publicar posts de dos formas:

1. **Vía Git**: Haz un PR al repositorio con tu archivo `.md` en `src/content/blog/`
2. **Vía CMS**: Entra a `valdiviasec.com/admin` y usa el editor visual

¡Cualquier persona puede contribuir!