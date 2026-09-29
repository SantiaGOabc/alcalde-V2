import { SECTION_PHRASES_CONTENT } from "../home/home";

export interface PasionImagen {
  src: string;
  alt: string;
}

export interface PasionDetalle {
  titulo: string;
  texto: string;
}

export interface Pasion {
  /** Ancla de la página (`#animales`); la usan el índice lateral y los "me gusta" de la intro. */
  id: string;
  kicker: string;
  titulo: string;
  /** Es la misma frase que la home muestra como resumen: aquí se despliega. */
  frase: string;
  historia: string[];
  detalles: PasionDetalle[];
  /** Dos fotos: la principal y una secundaria que se superpone en el collage. */
  imagenes: [PasionImagen, PasionImagen];
}

export const SECTION_ABOUT_PASSIONS = {
  kicker: "Lo que me apasiona",
  titulo: "Las cosas que le dan sentido a mi vida",
  descripcion:
    "En el inicio adelanté cuatro frases sobre lo que me importa. Aquí las cuento con más calma.",
};

// Las fotos y frases salen de las constantes de la home para que ambas páginas se
// mantengan alineadas; cada campo se puede editar por separado desde el panel.
export const SECTION_ABOUT_PASIONES: Pasion[] = [
  {
    id: "trabajo",
    kicker: "El trabajo honesto",
    titulo: "Trabajar es mi manera de querer a mi ciudad",
    frase: SECTION_PHRASES_CONTENT.philosophy.phrase,
    historia: [
      "Aprendí que gobernar no consiste en dar discursos, sino en resolver. La planificación estratégica y el trabajo incansable son mi forma de responderle a la gente.",
      "Creo que la honestidad y la firmeza no se declaran: se demuestran todos los días, obra por obra.",
    ],
    detalles: [
      { titulo: "Cómo trabajo", texto: "Con planificación estratégica, constancia y la convicción de que gobernar es escuchar." },
      { titulo: "Lo que me guía", texto: "Honestidad, firmeza y capacidad." },
    ],
    imagenes: [
      { src: SECTION_PHRASES_CONTENT.philosophy.imageURL, alt: "Manfred Reyes Villa" },
      { src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0790_1zq6uG.webp", alt: "El alcalde en una obra" },
    ],
  },
  {
    id: "familia",
    kicker: "Mi refugio",
    titulo: "Mi familia, el motor de mi vida",
    frase: SECTION_PHRASES_CONTENT.family.phrase,
    historia: [
      "Mi familia es mi mayor orgullo y el refugio donde renuevo cada día la fe y las fuerzas para seguir adelante.",
      "En el calor del hogar aprendí los valores que guían mis decisiones: la lealtad, la humildad y la entrega.",
    ],
    detalles: [
      { titulo: "Lo que me enseñaron", texto: "Lealtad, humildad y entrega." },
      { titulo: "Lo que representan", texto: "El cimiento de cada meta alcanzada." },
    ],
    imagenes: [
      { src: SECTION_PHRASES_CONTENT.family.imageURL, alt: "El alcalde compartiendo con escolares" },
      { src: "https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp", alt: "Fotografía familiar de Manfred Reyes Villa" },
    ],
  },
  {
    id: "animales",
    kicker: "Los que no piden palabras",
    titulo: "Mi cariño por los animales",
    frase: SECTION_PHRASES_CONTENT.pets.phrase,
    historia: [
      "Creo que una sociedad que cuida y respeta a los animales es una sociedad más justa, más humana y más consciente.",
      "Por eso este cariño se volvió acción: centros de zoonosis convertidos en albergues dignos, campañas masivas de esterilización y la defensa de la adopción responsable.",
    ],
    detalles: [
      { titulo: "Albergues dignos", texto: "Centros de zoonosis transformados en espacios de cuidado." },
      { titulo: "Esterilización", texto: "Campañas masivas para proteger a más animales." },
      { titulo: "Adopción responsable", texto: "Una causa que defiendo de forma activa." },
      { titulo: "Atención veterinaria", texto: "Clínica veterinaria y Centro de Adiestramiento Canino." },
    ],
    imagenes: [
      { src: SECTION_PHRASES_CONTENT.pets.imageURL, alt: "Cercanía y protección a los animales" },
      { src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0807_Z2rxRve.webp", alt: "Manfred Reyes Villa" },
    ],
  },
  {
    id: "gente",
    kicker: "El corazón cochala",
    titulo: "Cochabamba y su gente",
    frase: SECTION_PHRASES_CONTENT.community.phrase,
    historia: [
      "La verdadera grandeza de nuestra ciudad no reside en sus edificios, sino en la calidez, la fuerza y la alegría de su gente.",
      "Me gusta el contacto directo: caminar cada barrio, plaza y distrito, sentir los anhelos de los vecinos y defender con orgullo la identidad y el porvenir de la Llajta.",
    ],
    detalles: [
      { titulo: "Dónde me encuentran", texto: "En cada barrio, plaza y distrito." },
      { titulo: "Lo que defiendo", texto: "La identidad y el porvenir de la Llajta." },
    ],
    imagenes: [
      { src: SECTION_PHRASES_CONTENT.community.imageURL, alt: "Espacios públicos recuperados en el centro de la ciudad" },
      { src: "https://manfredreyesvilla.netlify.app/_astro/IMG_5929_ZxWrmu.webp", alt: "Plaza de las Banderas recuperada" },
    ],
  },
];
