export interface MotivacionItem {
    id: string;
    badge: string;
    titulo: string;
    cita: string;
    descripcion: string;
    imagenSrc: string;
    imagenAlt: string;
    /** Si es la tarjeta destacada de cierre (ancho completo) */
    destacada?: boolean;
}

export const SECTION_MOTIVATIONS = {
    kicker: 'Sobre mí',
    titulo: 'Lo que me mueve',
    descripcion:
        'Más allá de la gestión pública y las obras, existen valores, afectos y convicciones que guían cada uno de mis pasos. Conoce a la persona, sus raíces y su motor.',
};

export const MOTIVACIONES: MotivacionItem[] = [
    {
        id: 'filosofia',
        badge: 'Vocación de Vida',
        titulo: 'Filosofía y Servicio',
        cita: '«El servicio a nuestra gente no es un cargo ni una etapa: es una disciplina de vida guiada por el amor a Cochabamba.»',
        descripcion:
            'Una trayectoria forjada en el trabajo incansable, la planificación estratégica y la convicción de que gobernar significa escuchar a la gente y transformar la realidad con honestidad y firmeza.',
        imagenSrc: 'https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp',
        imagenAlt: 'Manfred Reyes Villa en reflexión',
    },
    {
        id: 'comunidad',
        badge: 'El Corazón Cochala',
        titulo: 'Cochabamba y su Gente',
        cita: '«La verdadera grandeza de nuestra ciudad no reside en sus edificios, sino en la calidez, la fuerza y la alegría de su gente.»',
        descripcion:
            'El contacto directo en cada barrio, plaza y distrito. Caminar junto a los vecinos, sentir sus anhelos y defender con orgullo la identidad y el porvenir de la Llajta.',
        imagenSrc: 'https://manfredreyesvilla.netlify.app/_astro/IMG_2941_ZK7QfD.webp',
        imagenAlt: 'El alcalde compartiendo con la comunidad y escolares',
    },
    {
        id: 'mascotas',
        badge: 'Protección & Empatía',
        titulo: 'Amor por los Animales',
        cita: '«Una sociedad que cuida y respeta a los animales es una sociedad más justa, más humana y más consciente.»',
        descripcion:
            'Un compromiso ético y afectivo: transformación de centros de zoonosis en albergues dignos, campañas masivas de esterilización y la defensa activa de la adopción responsable.',
        imagenSrc: 'https://manfredreyesvilla.netlify.app/_astro/DSC_0807_Z2rxRve.webp',
        imagenAlt: 'Cercanía y protección a los animales',
    },
    {
        id: 'familia',
        badge: 'Pilar Fundamental',
        titulo: 'Mi Familia: El Motor de Mi Vida',
        cita: '«Mi familia es mi mayor orgullo, mi cable a tierra y el refugio donde renuevo cada día la fe y las fuerzas para seguir adelante.»',
        descripcion:
            'El apoyo incondicional de los míos es el cimiento de cada meta alcanzada. En el calor del hogar aprendí los valores de lealtad, humildad y entrega que guían mis decisiones en cada jornada.',
        imagenSrc: 'https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp',
        imagenAlt: 'Fotografía familiar de Manfred Reyes Villa',
        destacada: true,
    },
];
