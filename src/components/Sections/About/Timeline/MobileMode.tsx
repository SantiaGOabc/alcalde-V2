import { createPortal } from "react-dom";
import type { CSSProperties, ReactNode } from "react";
import type { CarruselMovil, PlacaDolly, TabDolly } from "@types";
import TimelineTabs from "./TimelineTabs";
import CardInfo from "./CardInfo";

interface MobileModeProps {
  tabs: TabDolly[];
  activa: number;
  placas: PlacaDolly[];
  carrusel: CarruselMovil;
  montado: boolean;
  detalleUI: ReactNode;
  modalUI: ReactNode;
  onCambiarTab: (i: number) => void;
  onAbrir: (i: number) => void;
}

/** Mobile and tablet snap-scroll carousel view for the timeline. */
export default function MobileMode({
  tabs,
  activa,
  placas,
  carrusel,
  montado,
  detalleUI,
  modalUI,
  onCambiarTab,
  onAbrir,
}: MobileModeProps) {
  return (
    <div className="timeline-dolly">
      <TimelineTabs tabs={tabs} activa={activa} onCambiar={onCambiarTab} />
      <div className="timeline-movil">
        <div className="timeline-movil-progreso" aria-hidden="true">
          <div className="timeline-movil-progreso-bar" ref={carrusel.barra} />
        </div>
        <div
          className="timeline-movil-pista"
          ref={carrusel.pista}
          tabIndex={0}
          aria-label="Hitos de la línea de tiempo, desliza para recorrer"
          onScroll={carrusel.onScroll}
        >
          {placas.map((placa, i) => (
            <article
              key={placa.id}
              className="timeline-movil-placa"
              style={{ "--obj": placa.objectPosition } as CSSProperties}
              onPointerDown={carrusel.onTapDown}
              onPointerUp={carrusel.onTapUp}
              onPointerCancel={carrusel.onTapCancel}
            >
              <img
                src={placa.imagen}
                alt={placa.alt}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
              <div className="timeline-movil-info">
                <CardInfo
                  placa={placa}
                  variante="movil"
                  onAccion={() => onAbrir(i)}
                />
              </div>
            </article>
          ))}
        </div>
        <p className="timeline-pistas">
          Desliza para recorrer · Toca una foto para leer más
        </p>
      </div>
      {montado && createPortal(detalleUI, document.body)}
      {montado && createPortal(modalUI, document.body)}
    </div>
  );
}

export { MobileMode as ModoMovil };
