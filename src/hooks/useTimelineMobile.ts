import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { SEPARACION_MOVIL, UMBRAL_TAP } from "@constant";
import { clamp } from "@utils";
import type { CarruselMovil } from "@types";

interface TimelineMobileConfig {
  n: number;
  activo: boolean;
  clave: string;
  modalAbierta: boolean;
  detalleAbierta: boolean;
  onAbrirDetalle: (indice: number) => void;
}

const TAB_KEYS = ["ArrowRight", "ArrowLeft"];

/**
 * Mobile carousel hook with scroll-snap, progress tracking, and tap gesture detection.
 */
export function useTimelineMobile({
  n,
  activo,
  clave,
  modalAbierta,
  detalleAbierta,
  onAbrirDetalle,
}: TimelineMobileConfig): CarruselMovil {
  const [indice, setIndice] = useState(0);
  const pista = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const abajo = useRef({ x: 0, y: 0, movio: true });

  const anchoSlide = (c: HTMLDivElement) =>
    c.children[0] ? c.children[0].clientWidth + SEPARACION_MOVIL : c.clientWidth;

  const onScroll = () => {
    const c = pista.current;
    if (!c) return;
    const slideW = anchoSlide(c);
    const sn = slideW > 0 ? Math.round(c.scrollLeft / slideW) : 0;
    if (sn !== indice && sn >= 0 && sn < n) setIndice(sn);
    const total = Math.max(1, c.scrollWidth - c.clientWidth);
    const fracc = clamp(c.scrollLeft / total);
    if (barra.current) barra.current.style.width = `${fracc * 100}%`;
  };

  const onTapDown = (e: ReactPointerEvent<HTMLElement>) => {
    abajo.current = { x: e.clientX, y: e.clientY, movio: false };
  };

  const onTapUp = (e: ReactPointerEvent<HTMLElement>) => {
    const d = abajo.current;
    if (d.movio) return;
    const dx = Math.abs(e.clientX - d.x);
    const dy = Math.abs(e.clientY - d.y);
    if (dx < UMBRAL_TAP && dy < UMBRAL_TAP) onAbrirDetalle(indice);
  };

  const onTapCancel = () => {
    abajo.current.movio = true;
  };

  useEffect(() => {
    if (!activo) return;

    const onKey = (e: KeyboardEvent) => {
      if (modalAbierta || detalleAbierta) return;
      if (!TAB_KEYS.includes(e.key)) return;
      e.preventDefault();
      const c = pista.current;
      if (!c) return;
      const pasoW = anchoSlide(c) || c.clientWidth;
      c.scrollBy({ left: e.key === "ArrowRight" ? pasoW : -pasoW, behavior: "smooth" });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activo, modalAbierta, detalleAbierta]);

  useEffect(() => {
    pista.current?.scrollTo({ left: 0 });
    setIndice(0);
  }, [clave]);

  return { indice, pista, barra, onScroll, onTapDown, onTapUp, onTapCancel };
}

export { useTimelineMobile as useTimelineMovil };
