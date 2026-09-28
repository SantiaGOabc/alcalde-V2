import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import type { PlacaDolly, TabDolly } from "@types";
import TimelineTabs from "./TimelineTabs";

interface StaticModeProps {
  tabs: TabDolly[];
  activa: number;
  placas: PlacaDolly[];
  montado: boolean;
  detalleUI: ReactNode;
  modalUI: ReactNode;
  onCambiarTab: (i: number) => void;
  onAbrir: (i: number) => void;
}

/** Static timeline mode for prefers-reduced-motion fallback. */
export default function StaticMode({
  tabs,
  activa,
  placas,
  montado,
  detalleUI,
  modalUI,
  onCambiarTab,
  onAbrir,
}: StaticModeProps) {
  return (
    <div className="timeline-dolly">
      <TimelineTabs tabs={tabs} activa={activa} onCambiar={onCambiarTab} />
      <ol className="timeline-estatico">
        {placas.map((placa, i) => (
          <li key={placa.id} onClick={() => onAbrir(i)}>
            <img
              src={placa.imagen}
              alt={placa.alt}
              loading="lazy"
              decoding="async"
            />
            <div>
              <p>{placa.anio}</p>
              <h3>{placa.titulo}</h3>
              <p>{placa.descripcion}</p>
            </div>
          </li>
        ))}
      </ol>
      {montado && createPortal(detalleUI, document.body)}
      {montado && createPortal(modalUI, document.body)}
    </div>
  );
}

export { StaticMode as ModoEstatico };
