import { createPortal } from 'react-dom';
import { ESTADOS_GESTION } from '@constant';
import { useProyectosVisor } from '@/hooks';
import type { CategoriaObra } from '@types';
import GalleryModal from '@/components/ui/GalleryModal';
import ArrowButton from '@/components/ui/ArrowButton';
import CategorySelector from './CategorySelector';
import ProjectGallery from './ProjectGallery';

export interface ProjectsViewerProps {
    categorias: CategoriaObra[];
}

export type ProyectosVisorProps = ProjectsViewerProps;

const getCurrentIndex = (idx: number, total: number) =>
    total === 0 ? 1 : (((idx % total) + total) % total) + 1;

/** Projects showcase island with category pills, image slider, and modal lightbox. */
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

            <div className="gestion-marco">
                {total > 1 && (
                    <ArrowButton
                        direction="left"
                        onClick={anterior}
                        aria-label={`Obra anterior en ${categoria.label}`}
                        className="absolute top-1/2 left-0 z-20 -translate-y-1/2"
                    />
                )}

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
                        <div className="space-y-3.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="gestion-seccion">
                                    {obra.area ?? categoria.seccion}
                                </span>
                                {estado && (
                                    <span className="gestion-estado">{estado}</span>
                                )}
                            </div>

                            <h3 className="gestion-obra-titulo">{obra.titulo}</h3>

                            <p className="gestion-obra-desc">{obra.descripcion}</p>
                        </div>

                        {total > 1 && (
                            <div className="gestion-avance">
                                <p aria-live="polite" className="gestion-avance-texto">
                                    Obra <span>{getCurrentIndex(obraIdx, total)}</span> de{' '}
                                    {total}
                                </p>

                                <div className="flex items-center gap-1.5">
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
                        )}
                    </div>
                </article>

                {total > 1 && (
                    <ArrowButton
                        direction="right"
                        onClick={siguiente}
                        aria-label={`Obra siguiente en ${categoria.label}`}
                        className="absolute top-1/2 right-0 z-20 -translate-y-1/2"
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
