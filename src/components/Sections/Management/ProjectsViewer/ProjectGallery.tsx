import type { ObraVisor } from '@types';
import ThumbnailGallery from './ThumbnailGallery';

export interface ProjectGalleryProps {
    obra: ObraVisor;
    imagenIdx: number;
    onCambiarImagen: (indice: number) => void;
    onAbrir: () => void;
}

export type GaleriaObraProps = ProjectGalleryProps;

/** Generates two-letter initials of the project title for fallback placeholder. */
const getInitials = (title: string) =>
    title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');

/** Project media showcase component: main preview with interactive thumbnail strip. */
export default function ProjectGallery({
    obra,
    imagenIdx,
    onCambiarImagen,
    onAbrir,
}: ProjectGalleryProps) {
    const item = obra.imagenes[imagenIdx];
    const objectPosition = item?.objectPosition ?? obra.objectPosition ?? '50% 50%';

    return (
        <div className="gestion-media">
            {item?.tipo === 'video' ? (
                <video
                    key={item.src}
                    controls
                    playsInline
                    preload="none"
                    poster={item.poster ?? item.thumb}
                    src={item.src}
                    className="absolute inset-0 size-full object-cover"
                />
            ) : (
                <button
                    type="button"
                    onClick={onAbrir}
                    disabled={obra.imagenes.length === 0}
                    aria-label={
                        obra.imagenes.length > 0
                            ? `Ver ${obra.titulo} en grande`
                            : undefined
                    }
                    className="block size-full cursor-zoom-in disabled:cursor-default"
                >
                    {item ? (
                        <img
                            key={item.src}
                            src={item.src}
                            alt={item.alt ?? obra.titulo}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover"
                            style={{ objectPosition }}
                        />
                    ) : obra.imagenSrc ? (
                        <img
                            src={obra.imagenSrc}
                            alt={obra.titulo}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover"
                            style={{ objectPosition }}
                        />
                    ) : (
                        <span className="grid size-full place-items-center select-none text-7xl font-black tracking-tight text-white/10 sm:text-8xl">
                            {getInitials(obra.titulo)}
                        </span>
                    )}
                </button>
            )}

            {obra.imagenes.length > 1 && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-gray-950/85 via-gray-950/30 to-transparent"
                />
            )}

            <ThumbnailGallery
                imagenes={obra.imagenes}
                indice={imagenIdx}
                onCambiar={onCambiarImagen}
            />
        </div>
    );
}

export { ProjectGallery as GaleriaObra };
