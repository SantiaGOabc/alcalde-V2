import type { Encuadre } from "@types";
import { alcalde, premio } from "@utils";

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

// Estas fotos son los valores por defecto: el CMS puede sobreescribirlas una por
// una desde el panel. Para cambiar una, se cambia su línea de aquí.
export const SECTION_ABOUT_HITOS: Hito[] = [
  // ── Pestaña "Trayectoria" ─────────────────────────────────────────────
  {
    tipo: "historia",
    anio: "1993-2000",
    etapa: "Gestión municipal",
    titulo: "Alcalde de Cochabamba por cuatro periodos consecutivos",
    descripcion:
      "Es burgomaestre de Cochabamba durante cuatro periodos seguidos. En paralelo preside la Asociación de Gobiernos Municipales Autónomos de Bolivia, integra la Unión Internacional de Autoridades Locales (IULA) y representa a la Red Latinoamericana de Asociaciones Municipales ante la WACLAC, con base en Ginebra, Suiza.",
    imageURL: alcalde("cinta.jpg"),
    imageAlt: "Reconocimiento a la gestión municipal",
    encuadre: "rostro",
  },
  {
    tipo: "historia",
    anio: "2005",
    etapa: "Gestión regional",
    titulo: "Primer Prefecto electo de Cochabamba",
    descripcion:
      "Es el primer Prefecto del departamento de Cochabamba elegido democráticamente por voto directo de la ciudadanía.",
    imageURL: alcalde("prefecto.jpg"),
    imageAlt: "Entrega de un premio",
    encuadre: "rostro",
  },
  {
    tipo: "historia",
    anio: "2021",
    etapa: "Gestión municipal",
    titulo: "Alcalde de Cochabamba por quinta vez",
    descripcion:
      "Se re-postula a la Alcaldía en las elecciones subnacionales de 2021 representando a la agrupación política SÚMATE y es elegido Alcalde por quinta vez con el 55,63 % de los votos.",
    imageURL: alcalde("IMG_2941.jpg"),
    imageAlt: "Premio a la gestión municipal",
    encuadre: "centro",
  },
  {
    tipo: "historia",
    anio: "Hoy",
    etapa: "Compromiso",
    titulo: "Trabajar por Cochabamba",
    descripcion:
      "Llega a la silla edil como político con experiencia, trayectoria y grandes ideas, con el firme compromiso de trabajar por Cochabamba, siempre con honestidad, firmeza y capacidad.",
    imageURL: alcalde("cinta.jpg"),
    imageAlt: "Corte de cinta de una obra",
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
    imageURL: premio("premio1.JPG"),
    imageAlt: "Supervisión en obra",
    encuadre: "centro",
  },
  {
    tipo: "reconocimiento",
    anio: "2026",
    etapa: "Reconocimiento",
    titulo: "Embajador de Ciudades Sostenibles",
    descripcion:
      'Es distinguido como "Embajador de la Organización Mundial de Ciudades Sostenibles 2026" en París, Francia.',
    imageURL: premio("premio2.JPG"),
    imageAlt: "Manfred Reyes Villa",
    encuadre: "rostro",
  },
  {
    tipo: "reconocimiento",
    anio: "2021-2026",
    etapa: "Reconocimiento",
    titulo: "Cochabamba, ciudad sostenible",
    descripcion:
      "Una ciudad que recupera sus espejos de agua, sus parques y sus espacios públicos para devolverlos a la gente.",
    imageURL: premio("premio3.jpeg"),
    imageAlt: "Módulo educativo de la gestión",
    encuadre: "centro",
  },
];
