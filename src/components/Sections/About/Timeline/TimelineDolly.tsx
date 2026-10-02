import { createPortal } from "react-dom";
import {
  useTimelineCamera,
  useTimelineEstado,
  useTimelineMedia,
  useTimelineMovil,
} from "@/hooks";
import type { PlacaDolly, TabDolly } from "@types";
import TimelineTabs from "./TimelineTabs";
import StaticMode from "./StaticMode";
import MobileMode from "./MobileMode";
import DollyStage from "./DollyStage";
import DetailOverlay from "./DetailOverlay";
import GalleryModal from "@/components/ui/GalleryModal";

interface Props {
  tabs: TabDolly[];
}

/** Línea de tiempo: dolly 3D en desktop, carrusel en móvil/tablet y lista
 *  estática cuando el usuario pide menos movimiento. */
export default function TimelineDolly({ tabs }: Props) {
  const { estatico, movil } = useTimelineMedia();
  const estado = useTimelineEstado();

  const tabActual = tabs[estado.pestana] ?? tabs[0];
  const placas: PlacaDolly[] = tabActual?.placas ?? [];
  const n = placas.length;
  const clave = tabActual?.id ?? "";
  const fin = Math.max(1, n - 1);

  // Hooks de comportamiento: solo "despiertan" en el modo que los usa.
  const camara = useTimelineCamera({
    n,
    fin,
    activo: !estatico && !movil && n > 0,
    clave,
    modalAbierta: estado.modal.abierta,
    onAbrirModal: estado.abrirDetalle,
  });
  const carrusel = useTimelineMovil({
    n,
    activo: !estatico && movil && n > 0,
    clave,
    modalAbierta: estado.modal.abierta,
    detalleAbierta: estado.detalle.abierta,
    onAbrirDetalle: estado.abrirDetalle,
  });

  const galeriaUI =
    estado.modal.abierta && tabActual ? (
      <GalleryModal
        imagenes={tabActual.galeria}
        indice={estado.modal.idx}
        onIndice={estado.moverGaleriaA}
        onCerrar={estado.cerrarGaleria}
      />
    ) : null;

  const detalleUI =
    estado.detalle.abierta && placas[estado.detalle.idx] ? (
      <DetailOverlay
        placa={placas[estado.detalle.idx]}
        indice={estado.detalle.idx}
        onCerrar={estado.cerrarDetalle}
        onVerGaleria={estado.verGaleriaDesdeDetalle}
      />
    ) : null;

  // Los overlays se montan en `document.body` para que el `overflow: hidden`
  // de los modos dolly y carrusel no los recorte.
  const overlays =
    estado.montado &&
    createPortal(
      <>
        {detalleUI}
        {galeriaUI}
      </>,
      document.body,
    );

  const tabsUI = (
    <TimelineTabs
      tabs={tabs}
      activa={estado.pestana}
      onCambiar={estado.cambiarPestana}
    />
  );

  // Sin animación (prefers-reduced-motion) o sin JS: lista estática.
  if (estatico) {
    return (
      <StaticMode
        tabs={tabs}
        activa={estado.pestana}
        placas={placas}
        montado={estado.montado}
        detalleUI={detalleUI}
        modalUI={galeriaUI}
        onCambiarTab={estado.cambiarPestana}
        onAbrir={estado.abrirDetalle}
      />
    );
  }

  if (n === 0) {
    return (
      <div className="timeline-dolly">
        {tabsUI}
        <p className="timeline-vacio">
          Aún no hay hitos con foto para mostrar.
        </p>
      </div>
    );
  }

  // Carrusel con scroll-snap (móvil y tablet, en lugar del dolly 3D).
  if (movil) {
    return (
      <MobileMode
        tabs={tabs}
        activa={estado.pestana}
        placas={placas}
        carrusel={carrusel}
        montado={estado.montado}
        detalleUI={detalleUI}
        modalUI={galeriaUI}
        onCambiarTab={estado.cambiarPestana}
        onAbrir={estado.abrirDetalle}
      />
    );
  }

  // Dolly 3D desktop.
  return (
    <div className="timeline-dolly">
      {tabsUI}
      <DollyStage
        placas={placas}
        fin={fin}
        indice={camara.indice}
        nodos={camara.nodos}
        onInicio={camara.onInicio}
        onMueve={camara.onMueve}
        onFin={camara.onFin}
        salto={camara.salto}
        onAbrirDetalle={estado.abrirDetalle}
      />
      <div className="timeline-pistas">
        <p className="timeline-pistas-linea">
          <span className="timeline-mouse" aria-hidden="true" />
          {n > 1
            ? "Rueda o arrastra dentro del recuadro para recorrer la línea"
            : "Arrastra la línea dentro del recuadro para recorrerla"}
        </p>
        <p className="timeline-pistas-limite">
          Fuera del recuadro, el scroll sigue bajando la página
        </p>
      </div>
      {overlays}
    </div>
  );
}
