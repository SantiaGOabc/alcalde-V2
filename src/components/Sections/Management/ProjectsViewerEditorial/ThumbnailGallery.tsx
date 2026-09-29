import type { ObraImagen } from '@types';

export interface ThumbnailGalleryProps {
    imagenes: ObraImagen[];
    indice: number;
    onCambiar: (indice: number) => void;
}

export type MiniGaleriaProps = ThumbnailGalleryProps;

/** Thumbnail strip component for the current project gallery. */
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
        <div className="gestion-mini">
            <button
                type="button"
                onClick={anterior}
                aria-label="Imagen anterior de esta obra"
                className="gestion-mini-flecha"
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

            <div className="gestion-mini-tira">
                {imagenes.map((item, i) => (
                    <button
                        key={item.src}
                        type="button"
                        onClick={() => onCambiar(i)}
                        aria-label={item.titulo ?? `Ver imagen ${i + 1} de ${total}`}
                        aria-pressed={i === indice}
                        className={`gestion-mini-item ${
                            i === indice ? 'gestion-mini-item--activa' : ''
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
                                className="grid place-items-center bg-black/45"
                                aria-hidden="true"
                            >
                                <span className="grid size-5 place-items-center rounded-full bg-white/95 text-gray-900 shadow">
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

            <span className="gestion-mini-contador" aria-live="polite">
                {indice + 1} / {total}
            </span>

            <button
                type="button"
                onClick={siguiente}
                aria-label="Imagen siguiente de esta obra"
                className="gestion-mini-flecha"
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
