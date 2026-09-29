import type { ObraImagen } from '@types';

export interface ThumbnailGalleryProps {
    imagenes: ObraImagen[];
    indice: number;
    onCambiar: (indice: number) => void;
}

export type MiniGaleriaProps = ThumbnailGalleryProps;

/**
 * Tira de miniaturas que flota sobre la foto de la obra. La miniatura activa se
 * marca con un aro lila en vez de un borde, para que se lea sobre el violeta.
 */
export default function ThumbnailGallery({
    imagenes,
    indice,
    onCambiar,
}: ThumbnailGalleryProps) {
    const total = imagenes.length;
    if (total <= 1) return null;

    const anterior = () => onCambiar((indice - 1 + total) % total);
    const siguiente = () => onCambiar((indice + 1) % total);

    return (
        <div className="gestion-card-mini">
            <button
                type="button"
                onClick={anterior}
                aria-label="Foto o video anterior de esta obra"
                className="gestion-card-mini-flecha"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-3.5"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>

            <div className="gestion-card-mini-tira">
                {imagenes.map((item, i) => (
                    <button
                        key={item.src || i}
                        type="button"
                        onClick={() => onCambiar(i)}
                        aria-label={item.titulo ?? `Ver ítem ${i + 1} de ${total}`}
                        aria-pressed={i === indice}
                        className={`gestion-card-mini-item ${
                            i === indice
                                ? 'gestion-card-mini-item--activa'
                                : 'gestion-card-mini-item--inactiva'
                        }`}
                    >
                        <img
                            src={item.thumb}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="block size-full object-cover"
                        />
                        {item.tipo === 'video' && (
                            <span
                                className="absolute inset-0 grid place-items-center bg-black/40"
                                aria-hidden="true"
                            >
                                <span className="gestion-card-mini-play">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-2.5"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </span>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <span aria-live="polite" className="gestion-card-mini-contador">
                {indice + 1} / {total}
            </span>

            <button
                type="button"
                onClick={siguiente}
                aria-label="Foto o video siguiente de esta obra"
                className="gestion-card-mini-flecha"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-3.5"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}

export { ThumbnailGallery as MiniGaleria };
