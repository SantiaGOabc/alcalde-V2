/**
 * Ayudantes de los videos de YouTube.
 *
 * El panel guarda tal cual el link que pegó el administrador, así que un video
 * puede llegar como `watch?v=…`, `youtu.be/…`, `shorts/…` o `live/…`. Dentro de
 * un embed YouTube solo acepta el ID pelado, así que el link hay que desenvolverlo
 * en algún punto. Vive aquí para que el patrón se escriba una vez y lo compartan
 * el reproductor global, el libro y las dos variantes del visor de obras.
 */

/** El ID va al final de la URL, así que se corta en cuanto aparece algo que no es del ID. */
const YOUTUBE_ID =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,20})/;

/** El ID de YouTube de una URL, o `undefined` si la URL no es un video de YouTube. */
export const youtubeId = (src: string): string | undefined => YOUTUBE_ID.exec(src)?.[1];

export const isYoutube = (src: string): boolean => youtubeId(src) !== undefined;

/**
 * La miniatura oficial de YouTube. Es el respaldo cuando el video no trae poster:
 * sin ella la tira de miniaturas sale con un cuadro vacío.
 */
export const youtubePoster = (src: string): string | undefined => {
  const id = youtubeId(src);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
};

/**
 * El embed, en el dominio `nocookie`: no se manda cookies ni se rastrea al
 * visitante hasta que reproduce. `autoplay` solo cuenta porque el embed siempre
 * nace de un clic.
 */
export const youtubeEmbed = (id: string): string =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

/** Permisos que pide el player de YouTube para no perder funciones en el embed. */
export const YOUTUBE_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
