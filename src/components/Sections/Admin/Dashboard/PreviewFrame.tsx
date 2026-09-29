import { useEffect, useRef, useState } from 'react';
import { PREVIEW_PARAM } from '@/cms/preview';
import { useElementSize } from '@/hooks';

interface PreviewFrameProps {
  /** Ruta pública de la página a mostrar (`/about`). */
  path: string;
  /** Id del bloque que se está editando: al abrir la vista previa se baja hasta él. */
  anchor: string;
  /** Cambia cada vez que hay que recargar la página con el borrador nuevo. */
  reloadToken: number;
}

const DEVICES = {
  desktop: { label: 'Escritorio', width: 1440 },
  mobile: { label: 'Móvil', width: 390 },
} as const;

type Device = keyof typeof DEVICES;

/** Alto del navbar fijo de la página: el bloque no debe quedar tapado por él. */
const NAVBAR_OFFSET = 64;

/**
 * La página real, tal como la ve el visitante. Se renderiza al ancho de un
 * dispositivo (los breakpoints responden como en producción) y se escala para
 * caber exactamente en el recuadro del panel.
 */
export default function PreviewFrame({ path, anchor, reloadToken }: PreviewFrameProps) {
  const [device, setDevice] = useState<Device>('desktop');
  const [stageRef, stage] = useElementSize<HTMLDivElement>();
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Posición a recuperar tras recargar; `null` = primera carga (bajar al bloque).
  const savedScroll = useRef<number | null>(null);

  const frameWidth = DEVICES[device].width;
  const scale = stage.width ? Math.min(1, stage.width / frameWidth) : 1;
  const src = `${path}?${PREVIEW_PARAM}`;

  const scrollToAnchor = (frameWindow: Window) => {
    const block = frameWindow.document.getElementById(anchor);
    if (!block) return;
    frameWindow.scrollTo(0, block.getBoundingClientRect().top + frameWindow.scrollY - NAVBAR_OFFSET);
  };

  const handleLoad = () => {
    const frameWindow = frameRef.current?.contentWindow;
    if (!frameWindow) return;

    if (savedScroll.current === null) scrollToAnchor(frameWindow);
    else frameWindow.scrollTo(0, savedScroll.current);
  };

  // Recargar conservando la posición: quien edita no pierde su lugar en la página.
  useEffect(() => {
    const frameWindow = frameRef.current?.contentWindow;
    if (reloadToken === 0 || !frameWindow) return;

    savedScroll.current = frameWindow.scrollY > 0 ? frameWindow.scrollY : null;
    frameWindow.location.reload();
  }, [reloadToken]);

  const tabClass = (value: Device) =>
    `rounded-md px-3 py-1 text-xs font-bold transition-colors ${
      device === value ? 'bg-(--brand-primary) text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1" role="group" aria-label="Dispositivo">
          {(Object.keys(DEVICES) as Device[]).map((value) => (
            <button key={value} type="button" className={tabClass(value)} onClick={() => setDevice(value)}>
              {DEVICES[value].label}
            </button>
          ))}
        </div>
        <a href={path} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-500 hover:text-(--brand-primary)">
          Abrir página ↗
        </a>
      </div>

      <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
        <iframe
          ref={frameRef}
          title="Vista previa de la página"
          src={src}
          onLoad={handleLoad}
          className="absolute top-0 border-0 bg-white"
          style={{
            width: frameWidth,
            height: stage.height / scale,
            // El origen es la esquina superior izquierda: así `left` es la posición
            // visual real y el frame queda centrado sin huecos a los lados.
            left: (stage.width - frameWidth * scale) / 2,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
}
