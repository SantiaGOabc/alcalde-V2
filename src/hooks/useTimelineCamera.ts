import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ALCANCE,
  ANCHO_OCUPADO,
  ANCHO_PLACA,
  BLOQUEO_CLIC_MS,
  BRILLO_ATENUADO,
  BRILLO_RADIO,
  ENFOQUE_ESTRECHO,
  ENFOQUE_VISIBLE,
  ESPERA_RUEDA,
  GRIS_RADIO,
  INFO_RADIO,
  INFO_UMBRAL,
  MARGEN_EJE,
  PASO,
  PASO_RUEDA,
  PASO_Z,
  RATIO_PLACA,
  RESORTE,
  RESORTE_ARRATRE,
  SEPARACION_LATERAL_MAX,
  SEPARACION_LATERAL_MIN,
  TOP_EJE,
  UMBRAL,
  UMBRAL_ARRATRE,
  UMBRAL_QUIETUD,
  Z_BASE,
  Z_PENDIENTE,
} from "@constant";
import { limita } from "@utils";
import type { DollyRefs } from "@types";

interface Config {
  /** Cantidad de placas de la pestaña activa. */
  n: number;
  /** Última posición (placas - 1), nunca menor a 1. */
  fin: number;
  /** true solo cuando el modo dolly desktop está montado. */
  activo: boolean;
  /** Id de la pestaña activa (re-mide geometría y reinicia al cambiar). */
  clave: string;
  /** true mientras el modal de galería está abierto (silencia el teclado). */
  modalAbierta: boolean;
  /** Abre el detalle de la placa cuando el usuario la toca (sin arrastrar). */
  onAbrirModal: (indice: number) => void;
}

const TECLAS_AVANZAR = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];

/** Cámara 3D del dolly: rueda, teclado y arrastre del eje como índice. */
export function useTimelineCamera({
  n,
  fin,
  activo,
  clave,
  modalAbierta,
  onAbrirModal,
}: Config) {
  const [indice, setIndice] = useState(0);

  // Refs de animación (escritura directa por frame, sin re-renders).
  const pos = useRef(0);
  const objetivo = useRef(0);
  const redondo = useRef(0);
  const arrastre = useRef<{ y: number; movido: boolean } | null>(null);
  const suprimirClick = useRef(false);
  const ultimaRueda = useRef(0);
  const geo = useRef({
    w: ANCHO_PLACA,
    h: ANCHO_PLACA * RATIO_PLACA,
    alt: SEPARACION_LATERAL_MIN,
  });

  const nodos: DollyRefs = {
    escenario: useRef<HTMLDivElement>(null),
    placas: useRef<(HTMLDivElement | null)[]>([]),
    relleno: useRef<HTMLDivElement>(null),
    pulgar: useRef<HTMLDivElement>(null),
    info: useRef<HTMLDivElement>(null),
  };

  // Ubica cada placa en el espacio 3D según la posición de la cámara.
  const pintar = useCallback(() => {
    const nodosPlacas = nodos.placas.current;
    if (nodosPlacas.length > n) nodosPlacas.length = n;
    const p = pos.current;

    for (let i = 0; i < n; i += 1) {
      const nodo = nodosPlacas[i];
      if (!nodo) continue;

      const d = i - p;
      const lado = i % 2 === 0 ? -1 : 1;
      const x = lado * geo.current.w * geo.current.alt;
      const atras = d > 0;
      const opac = atras ? limita(1 - d / ALCANCE) : limita(1 + d / PASO);
      const gris = limita(Math.abs(d) / GRIS_RADIO);
      const brillo = 1 - limita(Math.abs(d) / BRILLO_RADIO) * BRILLO_ATENUADO;

      nodo.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0px, ${d * -PASO_Z}px) rotateY(${lado * 2}deg)`;
      nodo.style.opacity = String(opac);
      nodo.style.filter = `grayscale(${gris}) brightness(${brillo})`;
      nodo.style.zIndex = String(Math.round(Z_BASE - d * Z_PENDIENTE));
      nodo.style.pointerEvents =
        Math.abs(d) < ENFOQUE_ESTRECHO && opac > ENFOQUE_VISIBLE
          ? "auto"
          : "none";
      nodo.setAttribute(
        "aria-hidden",
        String(!(Math.abs(d) < ENFOQUE_ESTRECHO)),
      );
    }

    const frac = limita(p / fin);
    if (nodos.pulgar.current)
      nodos.pulgar.current.style.top = `${frac * 100}%`;
    if (nodos.relleno.current)
      nodos.relleno.current.style.transform = `scaleY(${frac})`;

    // El re-render solo ocurre cuando la cámara se asienta en otra placa.
    const idx = Math.round(p);
    if (idx !== redondo.current) {
      redondo.current = idx;
      setIndice(idx);
    }

    if (nodos.info.current) {
      const dist = Math.abs(p - idx);
      const vis = 1 - limita((dist / INFO_RADIO) ** 2);
      nodos.info.current.style.opacity = String(vis);
      nodos.info.current.style.visibility = vis > INFO_UMBRAL ? "visible" : "hidden";
      nodos.info.current.style.pointerEvents = vis > INFO_UMBRAL ? "auto" : "none";
    }
  }, [n, fin]);

  // Bucle de animación (la cámara se acerca al objetivo).
  useEffect(() => {
    if (!activo) return;
    redondo.current = 0;
    setIndice(0);
    pos.current = 0;
    objetivo.current = 0;

    let raf = 0;
    const animar = () => {
      const p = pos.current;
      const t = objetivo.current;
      pos.current =
        Math.abs(t - p) < UMBRAL_QUIETUD
          ? t
          : p +
            (t - p) * (arrastre.current ? RESORTE_ARRATRE : RESORTE);
      pintar();
      raf = requestAnimationFrame(animar);
    };
    raf = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(raf);
  }, [pintar, activo]);

  // Geometría real de la placa (--placa-w según breakpoint) y separación lateral
  // derivada del espacio libre, para que el dolly ocupe todo el ancho del
  // escenario (ver ANCHO_OCUPADO) sin que las placas se salgan por los lados.
  useEffect(() => {
    const zona = nodos.escenario.current;
    if (!zona) return;

    const medir = () => {
      const s = getComputedStyle(zona);
      const w = parseFloat(s.getPropertyValue("--placa-w")) || ANCHO_PLACA;
      const ancho = zona.clientWidth;
      const libre = ancho ? (ancho * ANCHO_OCUPADO - w) / 2 / w : 0;
      geo.current = {
        w,
        h: w * RATIO_PLACA,
        alt: limita(
          libre,
          SEPARACION_LATERAL_MIN,
          SEPARACION_LATERAL_MAX,
        ),
      };
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(zona);
    return () => ro.disconnect();
  }, [clave]);

  // Avance por pasos (media placa).
  const paso = useCallback(
    (dir: 1 | -1) => {
      if (n <= 1) return;
      objetivo.current = Math.max(
        0,
        Math.min(fin, objetivo.current + dir * PASO_RUEDA),
      );
    },
    [n, fin],
  );

  // Rueda sobre el escenario.
  useEffect(() => {
    const zona = nodos.escenario.current;
    if (!zona) return;

    const onWheel = (e: WheelEvent) => {
      if (n <= 1 || !activo) return;
      e.preventDefault();
      const ahora = performance.now();
      if (ahora - ultimaRueda.current < ESPERA_RUEDA) return;
      ultimaRueda.current = ahora;
      paso(e.deltaY > 0 ? 1 : -1);
    };

    zona.addEventListener("wheel", onWheel, { passive: false });
    return () => zona.removeEventListener("wheel", onWheel);
  }, [n, paso, activo]);

  // Teclado (silenciado cuando hay un overlay abierto).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalAbierta || !activo) return;
      if (TECLAS_AVANZAR.includes(e.key)) {
        e.preventDefault();
        paso(e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paso, modalAbierta, activo]);

  // El escenario (eje incluido) funciona como índice arrastrable.
  const onInicio = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastre.current = { y: e.clientY, movido: false };
    suprimirClick.current = false;
  };

  const onMueve = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dr = arrastre.current;
    const zona = nodos.escenario.current;
    if (!dr || !zona || n <= 1) return;
    if (Math.abs(e.clientY - dr.y) > UMBRAL_ARRATRE) dr.movido = true;
    const rect = zona.getBoundingClientRect();
    const alto = Math.max(1, rect.height - MARGEN_EJE);
    const frac = limita((e.clientY - rect.top - TOP_EJE) / alto);
    objetivo.current = frac * fin;
  };

  const onFin = () => {
    const dr = arrastre.current;
    arrastre.current = null;
    if (!dr || n <= 1) return;

    if (dr.movido) {
      objetivo.current = Math.round(objetivo.current);
      suprimirClick.current = true;
      setTimeout(() => {
        suprimirClick.current = false;
      }, BLOQUEO_CLIC_MS);
    } else if (Math.abs(objetivo.current - indice) < UMBRAL) {
      onAbrirModal(indice);
    }
  };

  const salto = (i: number) => {
    if (suprimirClick.current) {
      suprimirClick.current = false;
      return;
    }
    objetivo.current = i;
  };

  return { indice, nodos, salto, onInicio, onMueve, onFin };
}
