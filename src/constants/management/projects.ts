/**
 * Obras de la gestión municipal.
 *
 * ── Cómo agregar una obra ──────────────────────────────────────────────
 * Añadir un objeto a este arreglo. No hay que tocar ningún otro archivo:
 * el visor agrupa por `categoria`, la mete en la categoría correspondiente
 * y genera su tarjeta. Si la categoría no existe todavía en
 * `categorias.ts`, aparece igual en el desplegable.
 *
 * ── Cómo agregar imágenes a una obra ───────────────────────────────────
 * Añadir entradas al arreglo `imagenes` de la obra. Cada entrada nueva suma
 * una miniatura a la tira inferior y una imagen más al lightbox, sin tocar
 * código. Para cambiar la foto grande de la tarjeta, cambiar `portada`.
 *
 * ── Sobre `imagenes` vs `portada` ──────────────────────────────────────
 * `portada` es la foto que se ve grande en la tarjeta. `imagenes` es la
 * galería que se recorre. Si `imagenes` está vacía, la tarjeta usa sola la
 * portada. Si no, la portada se usa como poster/fallback.
 *
 * Las fotos salen del deploy actual (manfredreyesvilla.netlify.app), igual
 * que el resto del contenido del sitio. Cuando haya un CMS o una API que las
 * sirva, este arreglo pasa a ser la respuesta transformada y nada más cambia.
 */

import type { Encuadre } from '@types';

export interface ImagenObra {
    tipo?: 'foto' | 'video';
    src: string;
    alt: string;
    encuadre?: Encuadre;
    poster?: string;
    thumb?: string;
}
export interface Obra {
    /** Slug de la categoría (ver categorias.ts). */
    categoria: string;
    titulo: string;
    descripcion: string;
    /** Clave de ESTADOS_GESTION, p. ej. "concluido". */
    estado?: string;
    /** Etiqueta corta del área, p. ej. "Medio ambiente". */
    area?: string;
    /** Foto grande de la tarjeta. */
    portada: ImagenObra;
    /** Galería de la obra: miniatura en la tira + imagen en el lightbox. */
    imagenes?: ImagenObra[];
}

const FOTO = 'https://manfredreyesvilla.netlify.app/_astro/';

export const OBRAS_GESTION: Obra[] = [
    {
        categoria: 'puentes',
        titulo: 'Puente Cala Cala',
        descripcion:
            'Pionero en Bolivia: en 1993 el primer paso a desnivel de la ciudad ordenó el tránsito hacia el norte y cambió la forma de cruzar Cochabamba.',
        estado: 'concluido',
        area: 'Puentes',
        portada: {
            src: `${FOTO}trabajos_plaza_de_las_banderas_931_2wD2Rc.webp`,
            alt: 'Puente Cala Cala - Primer paso a desnivel',
            encuadre: 'centro',
        },
        imagenes: [
            {
                tipo: 'foto',
                src: `${FOTO}trabajos_plaza_de_las_banderas_931_2wD2Rc.webp`,
                alt: 'Vista del Puente Cala Cala',
            },
        ],
    },
    {
        categoria: 'puentes',
        titulo: 'Distribuidor y Puente Muyurina',
        descripcion:
            'Pasaje a desnivel que liberó el cruce de la Av. Ayacucho y conectó los barrios del este con el centro de la ciudad.',
        estado: 'concluido',
        area: 'Puentes',
        portada: {
            src: `${FOTO}parque_vial_5wRQF.webp`,
            alt: 'Distribuidor Muyurina',
            encuadre: 'centro',
        },
        imagenes: [
            {
                tipo: 'foto',
                src: `${FOTO}parque_vial_5wRQF.webp`,
                alt: 'Distribuidor Muyurina',
            },
        ],
    },
    {
        categoria: 'espacio-publico',
        titulo: 'Complejo Recreacional Coña Coña - Playa Turquesa',
        descripcion:
            'Espacio recreativo y de turismo para las familias, con playa artificial, plaza de comidas y áreas verdes.',
        estado: 'concluido',
        area: 'Espacio público',
        portada: {
            src: `${FOTO}playa_turquesa_cona_cona.jfif_Z1uMk5q.webp`,
            alt: 'Complejo Recreacional Coña Coña - Playa Turquesa',
            encuadre: 'centro',
        },
        imagenes: [
            {
                tipo: 'foto',
                src: `${FOTO}playa_turquesa_cona_cona.jfif_Z1uMk5q.webp`,
                alt: 'La playa artificial de Playa Turquesa',
            },
            {
                tipo: 'video',
                src: 'https://xfkfvabjxgfwjktaxhcs.supabase.co/storage/v1/object/public/media/videos/01_PLAYA_TURQUESA.mp4',
                poster: `${FOTO}playa_turquesa_cona_cona.jfif_Z1uMk5q.webp`,
                alt: 'Video de la Playa Turquesa',
            },
        ],
    },
    {
        categoria: 'medio-ambiente',
        titulo: 'Recuperación de la Laguna Alalay',
        descripcion:
            'Dragado y recuperación del mayor espejo de agua de la ciudad: sendas, forestación y control del deterioro ambiental.',
        estado: 'en-ejecucion',
        area: 'Medio ambiente',
        portada: {
            src: `${FOTO}Laguna_Alalay_el_proyecto_de_recuperacion_ambiental_mas_grande_del_pais.jpg_2hX1Q8.webp`,
            alt: 'Laguna Alalay en proceso de recuperación',
            encuadre: 'centro',
        },
        imagenes: [
            {
                tipo: 'foto',
                src: `${FOTO}Laguna_Alalay_el_proyecto_de_recuperacion_ambiental_mas_grande_del_pais.jpg_2hX1Q8.webp`,
                alt: 'La laguna Alalay recuperada',
            },
            {
                tipo: 'video',
                src: 'https://xfkfvabjxgfwjktaxhcs.supabase.co/storage/v1/object/public/media/videos/02_LAGUNA_ALALAY.mp4',
                poster: `${FOTO}Laguna_Alalay_el_proyecto_de_recuperacion_ambiental_mas_grande_del_pais.jpg_2hX1Q8.webp`,
                alt: 'Video de la Laguna Alalay',
            },
        ],
    },
    {
        categoria: 'espacio-publico',
        titulo: 'Plaza de las Banderas',
        descripcion:
            'Remozado y mejoramiento de la plaza y sus fuentes, dentro del plan de recuperación de espacios de encuentro.',
        estado: 'concluido',
        area: 'Espacio público',
        portada: {
            src: `${FOTO}trabajos_plaza_de_las_banderas_931_2wD2Rc.webp`,
            alt: 'Obras en la Plaza de las Banderas',
            encuadre: 'centro',
        },
        imagenes: [
            {
                src: `${FOTO}trabajos_plaza_de_las_banderas_931_2wD2Rc.webp`,
                alt: 'Los trabajos de la Plaza de las Banderas',
            },
        ],
    },
    {
        categoria: 'ciudad-jardin',
        titulo: 'Parque Vial',
        descripcion:
            'Parque renovado dentro del Plan Maestro de Forestación y de recuperación de áreas verdes de la llajta.',
        estado: 'concluido',
        area: 'Ciudad Jardín',
        portada: {
            src: `${FOTO}parque_vial_5wRQF.webp`,
            alt: 'Parque Vial renovado',
            encuadre: 'centro',
        },
        imagenes: [
            {
                src: `${FOTO}parque_vial_5wRQF.webp`,
                alt: 'El Parque Vial después de la renovación',
            },
        ],
    },
];

/** Cabecera de la página de Gestión. */
export const SECTION_GESTION = {
    title: 'Gestión municipal',
    description:
        'Las obras que transformaron Cochabamba, agrupadas por área para que puedas recorrerlas una por una.',
};

/** Antetítulo del visor, ya dentro de la cabecera de la página. */
export const SECTION_OBRAS_GESTION = {
    /** Título del índice de categorías del visor. */
    areasTitle: 'Áreas de trabajo',
};
