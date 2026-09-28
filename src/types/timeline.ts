import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import type { ImagenGaleria } from './gallery';

/** Una placa del dolly: un hito de trayectoria o un reconocimiento. */
export interface PlacaDolly {
    /** Identificador estable para la key de React (ej. "historia-0"). */
    id: string;
    /** Rango o año del hito, tal como se muestra en la placa (ej. "1993-2000"). */
    anio: string;
    /** Etapa o categoría del hito (ej. "Formación", "Obras"). */
    etapa: string;
    titulo: string;
    descripcion: string;
    /** Resumen corto (1-2 frases) que se pinta en la tarjeta de información. */
    resumen: string;
    /** URL ya optimizada a webp de la foto del hito. */
    imagen: string;
    alt: string;
    /** Encuadre de la foto dentro de la placa 4:5 (ver ajustaImagen). */
    objectPosition: string;
}

/** Un tab del dolly: agrupa las placas de una sección de About. */
export interface TabDolly {
    id: string;
    label: string;
    placas: PlacaDolly[];
    /** Imágenes a tamaño real para el modal de ampliar. */
    galeria: ImagenGaleria[];
}

/** Nodos del escenario 3D que la cámara muta por frame (sin re-renders). */
export interface DollyRefs {
    escenario: RefObject<HTMLDivElement | null>;
    placas: RefObject<(HTMLDivElement | null)[]>;
    relleno: RefObject<HTMLDivElement | null>;
    pulgar: RefObject<HTMLDivElement | null>;
    info: RefObject<HTMLDivElement | null>;
}

/** API del carrusel móvil que expone useTimelineMovil. */
export interface CarruselMovil {
    indice: number;
    pista: RefObject<HTMLDivElement | null>;
    barra: RefObject<HTMLDivElement | null>;
    onScroll: () => void;
    onTapDown: (e: ReactPointerEvent<HTMLElement>) => void;
    onTapUp: (e: ReactPointerEvent<HTMLElement>) => void;
    onTapCancel: () => void;
}
