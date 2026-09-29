import { createPortal } from 'react-dom';
import { ESTADOS_GESTION } from '@constant';
import { useProyectosVisor } from '@/hooks';
import type { CategoriaObra } from '@types';
import GalleryModal from '@/components/ui/GalleryModal';
import CategorySelector from './CategorySelector';
import ProjectGallery from './ProjectGallery';

export interface ProjectsViewerProps {
    categorias: CategoriaObra[];
}

export type ProyectosVisorProps = ProjectsViewerProps;

const getCurrentIndex = (idx: number, total: number) =>
    total === 0 ? 1 : (((idx % total) + total) % total) + 1;

const pad = (n: number) => String(n).padStart(2, '0');

/** Flecha de la ficha: el trazo apunta a la izquierda o a la derecha. */
function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-4"
        >
            <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
        </svg>
    );
}

/** Visor de obras: índice de áreas a la izquierda y la ficha de la obra a la derecha. */
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
            <p className="gestion-vacio">
                Todavía no hay obras publicadas para mostrar.
            </p>
        );
    }

    const estado = obra.estado ? ESTADOS_GESTION[obra.estado] : undefined;
    const numeroActual = getCurrentIndex(obraIdx, total);
    const imagenesGaleria = obra.imagenes.map((i) => ({
        src: i.src,
        titulo: i.titulo,
    }));

    return (
        <div className="gestion-visor">
            <CategorySelector
                categorias={categorias}
                activa={categoria.id}
                onCambiar={cambiarCategoria}
            />

            <article
                key={obra.id}
                id="obra-panel"
                role="tabpanel"
                aria-label={`Obras: ${categoria.label}`}
                className="gestion-obra"
            >
                <ProjectGallery
                    obra={obra}
                    imagenIdx={imagenIdx}
                    onCambiarImagen={cambiarImagen}
                    onAbrir={abrirModal}
                />

                <div className="gestion-obra-texto">
                    <div>
                        <p aria-hidden="true" className="gestion-obra-num">
                            {pad(numeroActual)}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="gestion-seccion">
                                {obra.area ?? categoria.seccion}
                            </span>
                            {estado && (
                                <span className="gestion-estado" data-estado={obra.estado}>
                                    {estado}
                                </span>
                            )}
                        </div>

                        <h3 className="gestion-obra-titulo">{obra.titulo}</h3>

                        <p className="gestion-obra-desc">{obra.descripcion}</p>
                    </div>

                    {total > 1 && (
                        <div className="gestion-avance">
                            <div className="min-w-0">
                                <p aria-live="polite" className="gestion-avance-texto">
                                    <span>{pad(numeroActual)}</span> / {pad(total)}
                                </p>
                                <div className="mt-3 flex items-center gap-1.5">
                                    {categoria.obras.map((o, i) => (
                                        <button
                                            key={o.id}
                                            type="button"
                                            onClick={() => cambiarObra(i)}
                                            aria-label={`Ir a ${o.titulo}`}
                                            aria-current={i === obraIdx}
                                            className={`gestion-punto ${
                                                i === obraIdx ? 'gestion-punto--activo' : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex shrink-0 gap-2">
                                <button
                                    type="button"
                                    onClick={anterior}
                                    aria-label={`Obra anterior en ${categoria.label}`}
                                    className="gestion-flecha"
                                >
                                    <ArrowIcon direction="left" />
                                </button>
                                <button
                                    type="button"
                                    onClick={siguiente}
                                    aria-label={`Obra siguiente en ${categoria.label}`}
                                    className="gestion-flecha"
                                >
                                    <ArrowIcon direction="right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </article>

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
