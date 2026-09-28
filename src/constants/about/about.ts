import type { Encuadre } from "@types";

export type TipoHito = "historia" | "reconocimiento";

export interface Hito {
  /** Pestaña a la que pertenece. Por defecto "historia". */
  tipo: TipoHito;
  /** Año o rango: "1955", "1993-2000", "Hoy". */
  anio: string;
  /** Etiqueta corta de etapa: "Origen", "Gestión municipal", "Compromiso"... */
  etapa: string;
  titulo: string;
  descripcion: string;
  /**
   * Resumen para la tarjeta de información (1-2 frases). Opcional: si un hito no
   * lo declara, la card toma la primera frase de `descripcion`, así que un
   * reconocimiento nuevo solo necesita `titulo` + `descripcion` para verse bien.
   */
  resumen?: string;
  /** Foto del hito. Solo los hitos con foto se convierten en placa del dolly. */
  imageURL: string;
  imageAlt: string;
  /** Encuadre de la foto: los retratos usan "rostro", las fotos de ciudad "centro". */
  encuadre: Encuadre;
}

export const FILTROS_HITO: { id: TipoHito; label: string }[] = [
  { id: "historia", label: "Trayectoria" },
  { id: "reconocimiento", label: "Reconocimientos" },
];

export const SECTION_ABOUT_INTRO = {
  title: "Sobre mí",
};

/** Cabecera de la galería de línea de tiempo dentro de la sección About. */
export const SECTION_ABOUT_TRAJECTORY = {
  title: "Línea de tiempo",
};

// TODO: ESTAS IMÁGENES VIENEN DEL DEPLOY ACTUAL (manfredreyesvilla.netlify.app),
// igual que el resto de contenido del sitio. Cuando el CMS exponga los hitos
// (getImages() de @utils) este arreglo pasa a ser la respuesta de la API.
export const SECTION_ABOUT_HITOS: Hito[] = [
  // ── Pestaña "Trayectoria" ─────────────────────────────────────────────
  {
    tipo: "historia",
    anio: "1993-2000",
    etapa: "Gestión municipal",
    titulo: "Alcalde de Cochabamba por cuatro periodos consecutivos",
    descripcion:
      "Es burgomaestre de Cochabamba durante cuatro periodos seguidos. En paralelo preside la Asociación de Gobiernos Municipales Autónomos de Bolivia, integra la Unión Internacional de Autoridades Locales (IULA) y representa a la Red Latinoamericana de Asociaciones Municipales ante la WACLAC, con base en Ginebra, Suiza.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp",
    imageAlt: "Manfred Reyes Villa",
    encuadre: "rostro",
  },
  {
    tipo: "historia",
    anio: "2005",
    etapa: "Gestión regional",
    titulo: "Primer Prefecto electo de Cochabamba",
    descripcion:
      "Es el primer Prefecto del departamento de Cochabamba elegido democráticamente por voto directo de la ciudadanía.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0807_Z2rxRve.webp",
    imageAlt: "Alcalde de Cochabamba",
    encuadre: "rostro",
  },
  {
    tipo: "historia",
    anio: "2021",
    etapa: "Gestión municipal",
    titulo: "Alcalde de Cochabamba por quinta vez",
    descripcion:
      "Se re-postula a la Alcaldía en las elecciones subnacionales de 2021 representando a la agrupación política SÚMATE y es elegido Alcalde por quinta vez con el 55,63 % de los votos.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/IMG_2941_ZK7QfD.webp",
    imageAlt: "El alcalde con escolares",
    encuadre: "centro",
  },
  {
    tipo: "historia",
    anio: "Hoy",
    etapa: "Compromiso",
    titulo: "Trabajar por Cochabamba",
    descripcion:
      "Llega a la silla edil como político con experiencia, trayectoria y grandes ideas, con el firme compromiso de trabajar por Cochabamba, siempre con honestidad, firmeza y capacidad.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/IMG_2941_ZaHkvk.webp",
    imageAlt: "Cerca de la gente",
    encuadre: "centro",
  },

  // ── Pestaña "Reconocimientos" ─────────────────────────────────────────
  {
    tipo: "reconocimiento",
    anio: "1993-2000",
    etapa: "Reconocimiento",
    titulo: "Presidente de la Asociación de Gobiernos Municipales de Bolivia",
    descripcion:
      "Es elegido Presidente de la Asociación de Gobiernos Municipales Autónomos de Bolivia durante su gestión como Alcalde de Cochabamba.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0790_1zq6uG.webp",
    imageAlt: "El alcalde en una obra",
    encuadre: "centro",
  },
  {
    tipo: "reconocimiento",
    anio: "2026",
    etapa: "Reconocimiento",
    titulo: "Embajador de Ciudades Sostenibles",
    descripcion:
      'Es distinguido como "Embajador de la Organización Mundial de Ciudades Sostenibles 2026" en París, Francia.',
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/01%20ALCALDE%20FRANCIA%20OK_ZIxvbV.webp",
    imageAlt: "Reconocimiento internacional",
    encuadre: "rostro",
  },
  {
    tipo: "reconocimiento",
    anio: "2021-2026",
    etapa: "Reconocimiento",
    titulo: "Cochabamba, ciudad sostenible",
    descripcion:
      "Una ciudad que recupera sus espejos de agua, sus parques y sus espacios públicos para devolverlos a la gente.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/6P9A8685_21g61j.webp",
    imageAlt: "Cochabamba de ayer",
    encuadre: "centro",
  },
];
