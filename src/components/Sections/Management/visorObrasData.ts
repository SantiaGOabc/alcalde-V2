import { getImage } from 'astro:assets';
import { imagePosition, youtubePoster } from '@utils';
import {
  CATEGORIAS_GESTION,
  LABELS_CATEGORIA,
  SECCION_CATEGORIA,
} from '@constant';
import type { Obra, ImagenObra } from '@constant';
import type { CategoriaObra, ObraImagen, ObraVisor } from '@types';

/**
 * Preparación SSR de las obras para el visor de Gestión.
 *
 * Vive fuera de los `.astro` a propósito: las dos variantes del visor (la
 * tarjeta violeta de `ProjectsViewer/` y la editorial de bordes rectos de
 * `ProjectsViewerEditorial/`) reciben exactamente los mismos datos, así que
 * optimizar las imágenes y agrupar por categoría se escribe una sola vez.
 *
 * Solo corre en el servidor: usa `astro:assets` para redimensionar.
 */

const ANCHO_PORTADA = 900;
const ANCHO_THUMB = 220;

const optimizar = async (imageURL: string, width: number): Promise<string> => {
  // Las imágenes subidas desde el panel (/media/<id>) ya son locales: se sirven tal cual.
  if (imageURL.startsWith('/')) return imageURL;

  try {
    const { src } = await getImage({
      src: imageURL,
      width,
      inferSize: true,
      quality: 70,
      format: 'webp',
    });
    return src;
  } catch (error) {
    console.warn(
      `[gestion] No se pudo optimizar la imagen, se usa la original: ${imageURL}`,
      error,
    );
    return imageURL;
  }
};

const prepararImagen = async (imagen: ImagenObra): Promise<ObraImagen> => {
  if (imagen.tipo === 'video') {
    const poster = imagen.poster
      ? await optimizar(imagen.poster, ANCHO_PORTADA)
      : undefined;
    // A YouTube link with no poster falls back to YouTube's own thumbnail:
    // without it the thumbnail strip shows an empty box.
    const thumb = imagen.poster
      ? await optimizar(imagen.poster, ANCHO_THUMB)
      : (imagen.thumb ?? youtubePoster(imagen.src) ?? '');
    return {
      tipo: 'video',
      src: imagen.src,
      thumb: thumb || poster || '',
      poster,
      alt: imagen.alt,
      titulo: imagen.alt,
    };
  }

  const [src, thumb] = await Promise.all([
    optimizar(imagen.src, ANCHO_PORTADA),
    optimizar(imagen.src, ANCHO_THUMB),
  ]);

  return {
    tipo: 'foto',
    src,
    thumb,
    alt: imagen.alt,
    titulo: imagen.alt,
    objectPosition: imagePosition(imagen.encuadre),
  };
};

const capitalizar = (texto: string) =>
  texto
    .split('-')
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ');

/**
 * Toma las obras publicadas y devuelve las categorías ya agrupadas, en el orden
 * de pills + dropdown de `categories.ts`, con cada imagen optimizada.
 */
export const prepararCategorias = async (obrasFuente: Obra[]): Promise<CategoriaObra[]> => {
  const obras: ObraVisor[] = await Promise.all(
    obrasFuente.map(async (obra, i) => {
      const galeria = obra.imagenes?.length ? obra.imagenes : [obra.portada];
      const imagenes = await Promise.all(galeria.map(prepararImagen));

      return {
        id: `${obra.categoria}-${i}`,
        titulo: obra.titulo,
        descripcion: obra.descripcion,
        categoria: obra.categoria,
        estado: obra.estado,
        area: obra.area,
        imagenSrc: imagenes[0]?.src,
        imagenes,
      };
    }),
  );

  const slugsEnObras = [...new Set(obras.map((o) => o.categoria).filter(Boolean))];
  const slugsOrdenados = [
    ...CATEGORIAS_GESTION.filter((id) => slugsEnObras.includes(id)),
    ...slugsEnObras.filter((id) => !CATEGORIAS_GESTION.includes(id)),
  ];

  return slugsOrdenados.map((id) => ({
    id,
    label: LABELS_CATEGORIA[id] ?? capitalizar(id),
    seccion: SECCION_CATEGORIA[id] ?? LABELS_CATEGORIA[id] ?? capitalizar(id),
    obras: obras.filter((o) => o.categoria === id),
  }));
};
