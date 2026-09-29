import { createPortal } from 'react-dom';
import { ESTADOS_GESTION } from '@constant';
import { useProyectosVisor } from '@/hooks';
import type { CategoriaObra } from '@types';
import ArrowButton from '@/components/ui/ArrowButton';
import GalleryModal from '@/components/ui/GalleryModal';
import SelectorCategorias from './SelectorCategorias';
import ThumbnailGallery from './GaleriaMedia';

export interface ProjectsViewerProps {
    categorias: CategoriaObra[];
}

export type ProyectosVisorProps = ProjectsViewerProps;

const pad = (n: number) => String(n).padStart(2, '0');

/** Iniciales para cuando una obra todavía no tiene foto. */
const getInitials = (title: string) =>
    title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');

/**
 * Visor de obras: selector por pastillas arriba y la ficha de la obra en una
 * tarjeta violeta de esquinas redondeadas, con la tira de miniaturas flotando
 * sobre la foto y las flechas al costado.
 *
 * Es la variante que se renderiza hoy. La editorial de bordes rectos sigue
 * viva en `../ProjectsViewerEditorial`, y ambas reciben los mismos datos de
 * `../visorObrasData`.
 */
export default function ProjectsViewer({ categorias }: ProjectsViewerProps) {
    const {
        categoria,
        obra,
        obraIdx,
        imagenIdx,
        modalAbierto,
        total,
        cambiarCategoria,
        cambiarObra,
        anterior,
        siguiente,
        cambiarImagen,
        abrirModal,
        cerrarModal,
    } = useProyectosVisor(categorias);

    if (!categoria || !obra) {
        return (
            <p className="gestion-card-vacio">
                Todavía no hay obras publicadas para mostrar.
            </p>
        );
    }

    const estado = obra.estado ? ESTADOS_GESTION[obra.estado] : undefined;
    const item = obra.imagenes[imagenIdx];
    const esVideo = item?.tipo === 'video';
    const imagenesGaleria = obra.imagenes.map((i) => ({
        src: i.src,
        titulo: i.titulo,
    }));

    return (
        <div className="gestion-card-visor">
            <SelectorCategorias
                categorias={categorias}
                activa={categoria.id}
                onCambiar={cambiarCategoria}
            />

            <div className="gestion-card-carrusel">
                {total > 1 && (
                    <ArrowButton
                        direction="left"
                        variant="carousel"
                        onClick={anterior}
                        aria-label={`Obra anterior en ${categoria.label}`}
                        className="gestion-card-flecha gestion-card-flecha--prev"
                    />
                )}

                <div
                    id="obra-panel"
                    role="tabpanel"
                    aria-label={`Obras: ${categoria.label}`}
                >
                    <article key={obra.id} className="gestion-card">
                        <div className="gestion-card-media">
                            {esVideo && item ? (
                                <video
                                    key={item.src}
                                    controls
                                    playsInline
                                    preload="none"
                                    poster={item.poster ?? item.thumb}
                                    src={item.src}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={abrirModal}
                                    disabled={imagenesGaleria.length === 0}
                                    aria-label={`Ver ${obra.titulo} en grande`}
                                    className="gestion-card-foto"
                                >
                                    {item ? (
                                        <img
                                            key={item.src}
                                            src={item.src}
                                            alt={item.alt ?? obra.titulo}
                                            loading="lazy"
                                            decoding="async"
                                            style={{
                                                objectPosition:
                                                    item.objectPosition ??
                                                    obra.objectPosition ??
                                                    '50% 50%',
                                            }}
                                        />
                                    ) : obra.imagenSrc ? (
                                        <img
                                            src={obra.imagenSrc}
                                            alt={obra.titulo}
                                            loading="lazy"
                                            decoding="async"
                                            style={{
                                                objectPosition:
                                                    obra.objectPosition ?? '50% 50%',
                                            }}
                                        />
                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className="gestion-card-iniciales"
                                        >
                                            {getInitials(obra.titulo)}
                                        </span>
                                    )}
                                </button>
                            )}

                            {obra.imagenes.length > 1 && (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className="gestion-card-velo"
                                    />
                                    <ThumbnailGallery
                                        imagenes={obra.imagenes}
                                        indice={imagenIdx}
                                        onCambiar={cambiarImagen}
                                    />
                                </>
                            )}
                        </div>

                        <div className="gestion-card-texto">
                            <div>
                                <div className="gestion-card-cabecera">
                                    <p className="gestion-card-kicker">
                                        {obra.area ?? categoria.seccion}
                                    </p>
                                    {estado && (
                                        <p
                                            className="gestion-card-estado"
                                            data-estado={obra.estado}
                                        >
                                            {estado}
                                        </p>
                                    )}
                                </div>

                                <h3 className="gestion-card-titulo">
                                    {obra.titulo}
                                </h3>

                                <p className="gestion-card-desc">
                                    {obra.descripcion}
                                </p>
                            </div>

                            {total > 1 && (
                                <div className="gestion-card-pie">
                                    <p
                                        aria-live="polite"
                                        className="gestion-card-contador"
                                    >
                                        Obra <strong>{pad(obraIdx + 1)}</strong>{' '}
                                        de {pad(total)}
                                    </p>

                                    <div className="gestion-card-puntos">
                                        {categoria.obras.map((o, i) => (
                                            <button
                                                key={o.id}
                                                type="button"
                                                onClick={() => cambiarObra(i)}
                                                aria-label={`Ir a ${o.titulo}`}
                                                aria-current={i === obraIdx}
                                                className={`gestion-card-punto ${
                                                    i === obraIdx
                                                        ? 'gestion-card-punto--activo'
                                                        : ''
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                </div>

                {total > 1 && (
                    <ArrowButton
                        direction="right"
                        variant="carousel"
                        onClick={siguiente}
                        aria-label={`Obra siguiente en ${categoria.label}`}
                        className="gestion-card-flecha gestion-card-flecha--next"
                    />
                )}
            </div>

            {modalAbierto &&
                imagenesGaleria.length > 0 &&
                createPortal(
                    <GalleryModal
                        imagenes={imagenesGaleria}
                        indice={imagenIdx}
                        onIndice={cambiarImagen}
                        onCerrar={cerrarModal}
                    />,
                    document.body,
                )}
        </div>
    );
}

export { ProjectsViewer as ProyectosVisor };
