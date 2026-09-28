/**
 * Categorías del visor de Gestión.
 *
 * Cómo se agrega una categoría nueva:
 *   1. Añadir su slug a `PILLS` o `DROPDOWN` (define en qué fila de botones
 *      aparece y en qué orden).
 *   2. Añadir su label a `LABELS` y su frase a `SECCIONES`.
 *   3. Usar ese slug en `categoria` de las obras de `obras.ts`.
 * La categoría aparece sola con todas sus obras; no hay que registrarla en
 * ningún otro lado.
 *
 * Si una obra usa un slug que NO está en ninguna de las dos listas, el visor
 * la reconoce igual y la muestra en el desplegable con el nombre capitalizado,
 * para que nunca quede obra invisible por olvidarse un paso.
 */

/** Categorías que salen como botones sueltos, en este orden. */
export const PILLS_GESTION = ['espacio-publico', 'ciudad-jardin', 'destacados'] as const;

/** Categorías que viven dentro del desplegable "Más categorías", en este orden. */
export const DROPDOWN_GESTION = [
    'infraestructura-vial',
    'espacio-publico-verde',
    'medio-ambiente',
    'salud',
    'deporte',
    'progreso',
] as const;

/** Orden global: primero las pills, después las del desplegable. */
export const CATEGORIAS_GESTION: readonly string[] = [...PILLS_GESTION, ...DROPDOWN_GESTION];

/** Nombre visible de cada categoría. */
export const LABELS_CATEGORIA: Record<string, string> = {
    'espacio-publico': 'Espacio público',
    'ciudad-jardin': 'Ciudad Jardín',
    destacados: 'Destacados',
    'infraestructura-vial': 'Infraestructura vial',
    'espacio-publico-verde': 'Espacio verde',
    'medio-ambiente': 'Medio ambiente',
    salud: 'Salud',
    deporte: 'Deporte',
    progreso: 'Progreso',
};

/** Frase que encabeza la tarjeta de la obra, distinta según la categoría. */
export const SECCION_CATEGORIA: Record<string, string> = {
    'espacio-publico': 'Espacios de encuentro para la gente',
    'ciudad-jardin': 'Una ciudad con más verde y sombra',
    destacados: 'Hitos que marcaron época',
    'infraestructura-vial': 'Cochabamba conectada',
    'espacio-publico-verde': 'Parques y Areas verdes recuperadas',
    'medio-ambiente': 'Cuidar los espejos de agua de la ciudad',
    salud: 'Salud de calidad para todos',
    deporte: 'Deporte y comunidad',
    progreso: 'Cochabamba a la vanguardia del progreso',
};

/**
 * Estados posibles de una obra. La clave es la que se escribe en
 * `estado` dentro de `obras.ts`; el valor es la etiqueta visible.
 * Agregar un estado nuevo = agregar una fila acá, nada más.
 */
export const ESTADOS_GESTION: Record<string, string> = {
    'en-ejecucion': 'En ejecución',
    concluido: 'Concluido',
    'en-planificacion': 'En planificación',
};
