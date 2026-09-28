/** Una imagen dentro de un lightbox: la src ya viene optimizada. */
export interface ImagenGaleria {
    src: string;
    titulo?: string;
}

/**
 * Encuadre de una foto dentro de su recorte. Se declara en las constantes y
 * `ajusteImagen` (@utils) lo traduce a un `object-position` CSS.
 * Compartido por About y Management: los retratos usan "rostro" y las fotos de
 * ciudad "centro".
 */
export type Encuadre = 'rostro' | 'centro';
