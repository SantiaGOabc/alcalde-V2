import { useCallback, useEffect, useState } from "react";

interface TimelineLayer {
  abierta: boolean;
  idx: number;
}

interface TimelineUi {
  montado: boolean;
  pestana: number;
  modal: TimelineLayer;
  detalle: TimelineLayer;
}

const CLOSED_LAYER: TimelineLayer = { abierta: false, idx: 0 };
const INITIAL_UI: TimelineUi = {
  montado: false,
  pestana: 0,
  modal: CLOSED_LAYER,
  detalle: CLOSED_LAYER,
};

/**
 * Manages timeline modal layers, tabs, and client-mount state.
 */
export function useTimelineState() {
  const [ui, setUi] = useState<TimelineUi>(INITIAL_UI);

  useEffect(() => setUi((s) => ({ ...s, montado: true })), []);

  const cambiarPestana = useCallback(
    (pestana: number) => setUi((s) => ({ ...s, pestana })),
    [],
  );
  const abrirGaleria = useCallback(
    (idx: number) => setUi((s) => ({ ...s, modal: { abierta: true, idx } })),
    [],
  );
  const cerrarGaleria = useCallback(
    () => setUi((s) => ({ ...s, modal: CLOSED_LAYER })),
    [],
  );
  const moverGaleriaA = useCallback(
    (idx: number) => setUi((s) => ({ ...s, modal: { ...s.modal, idx } })),
    [],
  );
  const abrirDetalle = useCallback(
    (idx: number) => setUi((s) => ({ ...s, detalle: { abierta: true, idx } })),
    [],
  );
  const cerrarDetalle = useCallback(
    () => setUi((s) => ({ ...s, detalle: CLOSED_LAYER })),
    [],
  );
  const verGaleriaDesdeDetalle = useCallback(
    (idx: number) =>
      setUi((s) => ({
        ...s,
        detalle: CLOSED_LAYER,
        modal: { abierta: true, idx },
      })),
    [],
  );

  return {
    ...ui,
    cambiarPestana,
    abrirGaleria,
    cerrarGaleria,
    moverGaleriaA,
    abrirDetalle,
    cerrarDetalle,
    verGaleriaDesdeDetalle,
  };
}

export { useTimelineState as useTimelineEstado };
