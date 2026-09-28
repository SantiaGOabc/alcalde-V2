import type { RefObject } from "react";
import type { PlacaDolly } from "@types";

interface TimelineAxisProps {
  placas: PlacaDolly[];
  fin: number;
  relleno: RefObject<HTMLDivElement | null>;
  pulgar: RefObject<HTMLDivElement | null>;
  onSalto: (i: number) => void;
}

/** Vertical timeline axis component with year markers and draggable thumb. */
export default function TimelineAxis({
  placas,
  fin,
  relleno,
  pulgar,
  onSalto,
}: TimelineAxisProps) {
  return (
    <div className="timeline-eje" aria-hidden="true">
      <div className="timeline-eje-relleno" ref={relleno} />
      <div ref={pulgar} className="timeline-eje-pulgar" />
      {placas.map((placa, i) => (
        <button
          key={placa.id}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="timeline-eje-marca"
          style={{ top: `${(i / fin) * 100}%` }}
          onClick={() => onSalto(i)}
        >
          <span className="timeline-eje-punto" />
          <span className="timeline-eje-anio">{placa.anio}</span>
        </button>
      ))}
    </div>
  );
}

export { TimelineAxis as EjeMarcas };
