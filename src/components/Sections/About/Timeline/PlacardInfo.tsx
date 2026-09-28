import type { RefObject } from "react";
import type { PlacaDolly } from "@types";
import CardInfo from "./CardInfo";

interface PlacardInfoProps {
  placa: PlacaDolly;
  derecha: boolean;
  infoRef: RefObject<HTMLDivElement | null>;
  onClick: () => void;
}

/** Information placard of the focused timeline slide. */
export default function PlacardInfo({
  placa,
  derecha,
  infoRef,
  onClick,
}: PlacardInfoProps) {
  return (
    <div
      ref={infoRef}
      className={`timeline-info ${derecha ? "timeline-info--der" : "timeline-info--izq"}`}
      onClick={onClick}
    >
      <CardInfo placa={placa} variante="dolly" onAccion={onClick} />
    </div>
  );
}

export { PlacardInfo as InfoPlaca };
