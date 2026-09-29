/* ==========================================================================
   Imágenes
   --------------------------------------------------------------------------
   Este archivo tiene dos cosas que no se parecen entre sí, y por eso están
   separadas:

   1. `getImages`, que trae imágenes de una API (el CMS, el panel).
   2. Los ayudantes de RUTA, que escriben la dirección de un archivo que ya
      está en `public/`.

   Lo segundo existe porque las fotos del sitio viven en `public/` y desde ahí
   no se importan: se escriben como ruta y el navegador las pide. El problema
   de escribirlas a mano es que la misma ruta se repite en varios archivos y un
   cambio de carpeta se rompe en todos a la vez. Con un ayudante por carpeta, la
   ruta se escribe una vez y el resto del código nombra la foto, no su
   dirección.
   ========================================================================== */

/**
 * Convierte una ruta de `public/` en la dirección que se escribe en el HTML.
 *
 * Todo lo que devuelve es relativo a la raíz del sitio con una barra delante
 * (`/alcalde/cinta.jpg`), que es lo único que funciona igual en la home, en
 * `/about`, en `/management` y en el subdirectorio donde caiga cada sección.
 *
 * Hace tres cosas, y las tres son para que nadie tenga que acordarse:
 *
 * - Quita las barras del principio y junta las dobles: `alcalde//cinta.jpg` y
 *   `/alcalde/cinta.jpg` dan lo mismo que `alcalde/cinta.jpg`.
 * - Codifica lo que rompe una URL dentro de un `src`: el espacio, la almohadilla
 *   y la interrogación. Con eso un archivo se puede llamar "LOGO ALCALDE.png" y
 *   seguir escribiendo su nombre con espacios.
 * - Deja intactas las letras con tilde y eñes (`/alcalde/niños.webp`). Codificarlas
 *   también funciona, pero no hace falta: los navegadores y el servidor las
 *   aceptan tal cual, y dejarlo igual hace que la ruta que se lee en el código
 *   sea la misma que la que se ve en el archivo del proyecto.
 */
export const file = (ruta: string): string =>
  `/${ruta
    .replace(/^\/+/, "")
    .replace(/\/{2,}/g, "/")
    .replace(/ /g, "%20")
    .replace(/#/g, "%23")
    .replace(/\?/g, "%3F")}`;

/* --------------------------------------------------------------------------
   Un ayudante por carpeta de `public/`
   --------------------------------------------------------------------------
   Cada uno apunta a una carpeta que existe de verdad. Los nombres van CON su
   extensión porque en `public/` hay fotos de cuatro formatos (`.jpg`, `.jpeg`,
   `.JPG` y `.webp`): fijar una extensión en el código obligaría a renombrar los
   archivos, y renombrar un archivo es romper la web si algo lo sigue apuntando
   por su ruta.

   Añadir una foto es dejarla en su carpeta y escribir su nombre. Si aparece una
   carpeta nueva, se añade un ayudante aquí, al lado de los que ya están.
   -------------------------------------------------------------------------- */

/**
 * Fotos sueltas en la raíz de `public/`.
 *
 * Son las panorámicas de la ciudad y de los espacios transformados: la fuente
 * del hero, de las frases y del antes y después. Van en la raíz y no en una
 * carpeta propia porque así estaban en el sitio anterior.
 *
 *     raiz("cocha.jpg")            → /cocha.jpg
 *     raiz("playaTurquesa.JPG")    → /playaTurquesa.JPG
 */
export const raiz = (archivo: string): string => file(archivo);

/**
 * Los recursos gráficos de la home.
 *
 * Ahora mismo son las mismas fotos de la raíz —la home no tiene carpeta propia
 * todavía—, así que este ayudante es un alias de `raiz`. Está aquí para que, el
 * día que la home reciba una carpeta `home/`, el cambio sea cambiar este
 * ayudante y no tocar todas las secciones que lo llaman.
 */
export const home = raiz;

/**
 * Fotos del antes y después de cada obra.
 *
 * Los dos lados van a la misma raíz, y se separan en dos ayudantes solo porque
 * en el contenido se usan emparejados: el antes de una obra y su después son la
 * misma entrada comparada, y nombrarlos igual deja claro de qué par se habla.
 */
export const antes = (archivo: string): string => raiz(archivo);

/** El después de una obra. Ver `antes`. */
export const ahora = (archivo: string): string => raiz(archivo);

/** Fotos del alcalde y de la obra en la calle: `public/alcalde/`. */
export const alcalde = (archivo: string): string => file(`alcalde/${archivo}`);

/** Premios y placas de reconocimiento: `public/premios/`. */
export const premio = (archivo: string): string => file(`premios/${archivo}`);

/** @deprecated El nombre en inglés de `premio`. Se conserva por compatibilidad. */
export const awards = premio;

/** Tapa y material del libro digital: `public/book/`. */
export const book = (archivo: string): string => file(`book/${archivo}`);

/* --------------------------------------------------------------------------
   Carpetas que todavía no existen
   --------------------------------------------------------------------------
   Los ayudantes siguientes están escritos, y funcionan, pero no apuntan a nada
   porque los archivos aún no están en `public/`. Se dejan aquí, documentados
   como lo que son, para que añadirlos sea copiar el archivo a la carpeta: si
   aparece un video o una foto de proyecto, el ayudante que lo nombra ya está
   escrito y probado. Mientras tanto, los videos y las obras llegan por URL
   (Cloudinary y el CMS), que es lo que usan hoy.
   -------------------------------------------------------------------------- */

/** Videos locales: `public/videos/`. */
export const video = (archivo: string): string => file(`videos/${archivo}`);

/** Fotos de proyectos: `public/proyectos/`. */
export const proy = (archivo: string): string => file(`proyectos/${archivo}`);

/** Fotos del antes de un proyecto: `public/proyectos/antes/`. */
export const proyAntes = (archivo: string): string =>
  file(`proyectos/antes/${archivo}`);

/**
 * Imágenes de la API del CMS.
 *
 * Devuelve un array vacío si la API falla, a propósito: una imagen que no llega
 * no puede tumbar la página que la pide, y el sitio se dibuja igual.
 */
export const getImages = async (apiURL: string) => {
  try {
    const images = await fetch(apiURL).then((res) => res.json());
    return images;
  } catch (error) {
    return [];
  }
};
