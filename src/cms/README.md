# CMS: cómo se relaciona el código con lo que se edita en el panel

**Regla de oro:** la *estructura* de cada sección vive en el código (`src/constants`);
la base de datos solo guarda *valores*. Nunca hay que migrar la base para cambiar una estructura.

```
constants/…            → estructura + valores por defecto (una sola fuente de verdad)
cms/sections.ts        → registro: qué constants son editables (clave, página, etiqueta)
cms/sections.ts        → CMS_IMAGE_FIELDS: qué claves de esa sección son imágenes
site_content (DB)      → solo los valores que alguien editó desde el panel
getContent(clave)      → lee la DB y la reconcilia con los constants actuales
```

## Qué pasa cuando cambia el código

`getContent` pasa lo guardado por `reconcile()` (`cms/shape.ts`) contra los `constants` actuales:

| Cambio en el código | Resultado con contenido ya editado |
|---|---|
| **Quitar un campo** (p. ej. el `kicker`) | Se descarta al leer: desaparece del sitio **y del panel**. Se limpia de la base la próxima vez que se guarde la sección. |
| **Añadir un campo** | Toma su valor por defecto hasta que alguien lo edite. |
| **Cambiar el tipo de un campo** (texto → número, texto → objeto) | Ese campo vuelve a su valor por defecto; el resto se conserva. |
| **Cambiar un texto por defecto** | Solo afecta a lo no editado; lo editado en el panel manda. |
| **Renombrar un campo** | Equivale a quitar uno y añadir otro: el valor editado del nombre viejo no se traslada. |

El panel **se genera solo** a partir de la estructura: no hay formularios por sección que actualizar.

## Recetas

**Quitar el kicker de "Sobre mí"** → borra `kicker` en `constants/about/intro.ts` y su uso en el componente. Nada más.
TypeScript avisa si algún componente sigue leyéndolo (`getContent` está tipado con `CmsContent<clave>`).

**Añadir un campo** → agrégalo al constant (con su valor por defecto) y úsalo en el componente.

**Añadir un campo de imagen** → el valor sigue siendo una URL de texto (así lo guarda,
valida y pinta la base de datos sin cambiar nada), pero el panel ofrece subida de archivo
y miniatura en vez de un campo de texto. Se declara en `CMS_IMAGE_FIELDS`:

```ts
export const CMS_IMAGE_FIELDS: Partial<Record<CmsKey, readonly string[]>> = {
  'site.brand': ['logo'], // ← el campo `logo` de esa sección
};
```

`ContentField` lo reconoce por el **nombre** de la clave a cualquier profundidad, así que
también funciona dentro de una lista (`hero.images.src`). No se decide por el valor: un
campo recién vacío seguiría pareciendo un texto cualquiera. Y solo afecta a las secciones
que se nombren aquí; las demás siguen mostrando un campo de texto para sus imágenes.

**Cambiar la estructura de un componente** → cambia el constant y el componente en el mismo commit;
`npm run check` (astro check) marca cualquier desajuste. No hace falta tocar `db.sql`.

**Volver editable una sección nueva** → añade una entrada en `CMS_SECTIONS` (`cms/sections.ts`),
envuelve su bloque con `id={sectionId('clave')}` en la página (para que la vista previa llegue hasta él)
y léela con `getContent('clave')`.

**Eliminar una sección editable** → bórrala de `CMS_SECTIONS`. Sus filas en `site_content` quedan
huérfanas pero inofensivas (nada las lee); si quieres limpiarlas:
`DELETE FROM site_content WHERE key = 'clave.vieja';`

## Qué NO es un `constant` editable

Las **obras** de Gestión no viven aquí sino en la tabla `works` (crear/publicar/eliminar);
sus `constants` (`OBRAS_GESTION`) son la siembra inicial y el respaldo si no hay base de datos.
Los **mensajes del buzón** tampoco: son datos de usuarios, en `mailbox_messages`.
