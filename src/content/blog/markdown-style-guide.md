---
title: 'Escribiendo posts con Markdown'
description: 'Guía de formato para el equipo editorial de ValdiviaSec'
pubDate: 'Jul 22 2026'
author: 'ValdiviaSec'
tags: ['guía', 'markdown', 'editorial']
---

Esta guía muestra cómo escribir posts para el blog de ValdiviaSec usando Markdown.

## Frontmatter

Cada post necesita un encabezado YAML con:

```yaml
---
title: 'Título del post'
description: 'Breve descripción'
pubDate: 'Jul 22 2026'
author: 'Nombre del autor'
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

## Publicación

Las publicaciones son gestionadas por el equipo editorial de ValdiviaSec a través del panel de administración en `/admin`.