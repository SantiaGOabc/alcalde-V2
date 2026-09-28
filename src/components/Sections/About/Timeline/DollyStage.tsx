import type { PointerEvent as ReactPointerEvent } from "react";
import { DESPLAZAMIENTO_X_INICIAL, PASO_Z } from "@constant";
import type { DollyRefs, PlacaDolly } from "@types";
import TimelineAxis from "./TimelineAxis";
import PlacardInfo from "./PlacardInfo";

interface DollyStageProps {
  placas: PlacaDolly[];
  fin: number;
  indice: number;
  nodos: DollyRefs;
  onInicio: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onMueve: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onFin: () => void;
  salto: (i: number) => void;
  onAbrirDetalle: (i: number) => void;
}

/** Desktop 3D camera timeline stage view with markers axis and placard. */
export default function DollyStage({
  placas,
  fin,
  indice,
  nodos,
  onInicio,
  onMueve,
  onFin,
  salto,
  onAbrirDetalle,
}: DollyStageProps) {
  return (
    <div className="timeline-galeria" aria-label="Línea de tiempo interactiva">
      <div
        className="timeline-escenario"
        ref={nodos.escenario}
        onPointerDown={onInicio}
        onPointerMove={onMueve}
        onPointerUp={onFin}
        onPointerCancel={onFin}
      >
        <div className="timeline-zona" aria-hidden="true" />

        {placas.map((placa, i) => {
          const lado = i % 2 === 0 ? -1 : 1;
          return (
            <div
              key={placa.id}
              ref={(el) => {
                nodos.placas.current[i] = el;
              }}
              className="timeline-placa"
              style={{
                transform: `translate(-50%, -50%) translate3d(${lado * DESPLAZAMIENTO_X_INICIAL}px, 0px, ${i * -PASO_Z}px)`,
              }}
            >
              <img
                src={placa.imagen}
                alt={placa.alt}
                draggable={false}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: placa.objectPosition }}
              />
              <span className="timeline-placa-anio">{placa.anio}</span>
            </div>
          );
        })}

        <TimelineAxis
          placas={placas}
          fin={fin}
          relleno={nodos.relleno}
          pulgar={nodos.pulgar}
          onSalto={salto}
        />
      </div>

      {placas[indice] ? (
        <PlacardInfo
          placa={placas[indice]}
          derecha={indice % 2 === 0}
          infoRef={nodos.info}
          onClick={() => onAbrirDetalle(indice)}
        />
      ) : null}
    </div>
  );
}

export { DollyStage as DollyEscenario };
