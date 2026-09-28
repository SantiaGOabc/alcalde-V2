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
export const PILLS_GESTION = ['puentes', 'ciudad-jardin', 'destacados'] as const;

/** Categorías que viven dentro del desplegable "Más categorías", en este orden. */
export const DROPDOWN_GESTION = [
    'infraestructura-vial',
    'espacio-publico',
    'medio-ambiente',
    'salud',
    'agua',
    'recreacion',
    'lagunas',
    'futuro-ecologico',
    'progreso',
    'apps',
] as const;

/** Orden global: primero las pills, después las del desplegable. */
export const CATEGORIAS_GESTION: readonly string[] = [...PILLS_GESTION, ...DROPDOWN_GESTION];

/** Nombre visible de cada categoría. */
export const LABELS_CATEGORIA: Record<string, string> = {
    puentes: 'Puentes',
    'ciudad-jardin': 'Áreas verdes',
    destacados: 'Destacados',
    'infraestructura-vial': 'Infraestructura vial',
    'espacio-publico': 'Espacio público',
    'medio-ambiente': 'Medio ambiente',
    salud: 'Salud',
    agua: 'Agua',
    recreacion: 'Recreación',
    lagunas: 'Lagunas',
    'futuro-ecologico': 'Futuro ecológico',
    progreso: 'Progreso',
    apps: 'A.P.P.S',
};

/** Frase que encabeza la tarjeta de la obra, distinta según la categoría. */
export const SECCION_CATEGORIA: Record<string, string> = {
    puentes: 'Pioneros en pasos a desnivel y puentes',
    'ciudad-jardin': 'Ciudad Jardín: áreas verdes y parques',
    destacados: 'Hitos que marcaron época',
    salud: 'Salud de calidad',
    agua: 'Cobertura de agua potable: deuda social',
    recreacion: 'Cochabamba, Ciudad Jardín: recreación y encuentro',
    lagunas: 'Nuestros espejos de agua',
    'futuro-ecologico': 'Un compromiso con el futuro ecológico',
    'infraestructura-vial': 'Cochabamba conectada: infraestructura vial para una ciudad que avanza',
    progreso: 'Cochabamba a la vanguardia del progreso',
    apps: 'Pioneros en alianzas público-privadas',
    'espacio-publico': 'Espacios de encuentro para la gente',
    'medio-ambiente': 'Cuidar los espejos de agua de la ciudad',
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
