/**
 * Identidad del sitio: lo que se ve en la barra superior de TODAS las páginas.
 *
 * Vive en su propia sección del CMS (`site.brand`) y no dentro de la home porque
 * no pertenece a una página: el mismo logo está en el navbar de `/`, `/about`,
 * `/management`, `/mailbox` y del propio panel.
 *
 * El logo se IMPORTA, no se escribe como ruta a mano: un `src` escrito a mano lo
 * resuelve el navegador contra la URL de la página, así que el mismo camino
 * funcionaba en la home y daba 404 en las demás. Vite le pone un hash al nombre
 * en la compilación, que es justo lo que se guarda como valor por defecto.
 *
 * Si alguien lo cambia desde el panel, aquí manda lo guardado en la base de datos
 * y este archivo deja de importar para nada (ver `getContent`).
 */
import logo from "@/assets/logo/logo-alcalde.png";

export const SITE_BRAND = {
  logo: logo.src,
};