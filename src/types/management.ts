import type { ImagenGaleria } from './gallery';

/**
 * Tipos del visor de obras de Gestión.
 *
 * El agrupado final (categoría → obras) NO se escribe a mano: lo arma
 * `ProyectosVisor.component.astro` en SSR a partir de `OBRAS_GESTION`, así que
 * añadir una obra nueva en las constantes la hace aparecer sola en su
 * categoría, y añadirle fotos a `imagenes` las agrega solas a la mini galería
 * y al lightbox. Acá solo viven las formas que consume la isla.
 */

/** Un ítem de la galería de una obra: foto o video. */
export interface ObraImagen extends ImagenGaleria {
    tipo: 'foto' | 'video';
    /** Miniatura: la foto en 220px o el poster del video. */
    thumb: string;
    /** Poster del video; solo cuando `tipo === 'video'`. */
    poster?: string;
    /** Texto alternativo. Si falta, la tarjeta usa el título de la obra. */
    alt?: string;
    /** `object-position` derivado del `encuadre` de esta imagen en concreto,
     *  para que un retrato y una foto de ciudad puedan convivir en la misma
     *  galería sin pelearse el recorte. */
    objectPosition?: string;
}

/** Una obra de la gestión, ya con sus imágenes optimizadas en SSR. */
export interface ObraVisor {
    id: string;
    titulo: string;
    descripcion: string;
    /** Slug de la categoría. Debe coincidir con una clave de CATEGORIAS_GESTION. */
    categoria: string;
    /** Estado de la obra, con su clave de ESTADOS_GESTION. */
    estado?: string;
    /** Etiqueta corta del área, p. ej. "Medio ambiente". Si falta, se usa la
     *  frase de la categoría. */
    area?: string;
    /** Portada optimizada. Ausente = la tarjeta muestra iniciales. */
    imagenSrc?: string;
    /** `object-position` derivado de `encuadre` en las constantes. */
    objectPosition?: string;
    /** Galería de la obra. Vacía = solo se ve la portada. */
    imagenes: ObraImagen[];
}

/** Una categoría con sus obras, ya agrupada y en el orden de pills + dropdown. */
export interface CategoriaObra {
    id: string;
    label: string;
    /** Frase que encabeza la tarjeta de la obra dentro de esta categoría. */
    seccion: string;
    obras: ObraVisor[];
}
