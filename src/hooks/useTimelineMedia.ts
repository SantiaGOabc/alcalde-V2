import { useEffect, useState } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// El dolly 3D necesita espacio lateral para las placas: solo a partir de `lg`
// (1024px), el mismo breakpoint que usa el resto de secciones del sitio.
const ESCRITORIO = "(min-width: 1024px)";

interface MediaTimeline {
  estatico: boolean;
  movil: boolean;
}

/** Detecta prefers-reduced-motion (lista estática) y modo móvil/desktop. */
export function useTimelineMedia(): MediaTimeline {
  const [media, setMedia] = useState<MediaTimeline>({
    estatico: false,
    movil: false,
  });

  useEffect(() => {
    const reduce = window.matchMedia(REDUCED_MOTION);
    const escritorio = window.matchMedia(ESCRITORIO);
    const sincronizar = () =>
      setMedia({ estatico: reduce.matches, movil: !escritorio.matches });

    sincronizar();
    reduce.addEventListener("change", sincronizar);
    escritorio.addEventListener("change", sincronizar);
    return () => {
      reduce.removeEventListener("change", sincronizar);
      escritorio.removeEventListener("change", sincronizar);
    };
  }, []);

  return media;
}
