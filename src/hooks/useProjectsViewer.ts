import { useCallback, useEffect, useState } from 'react';
import type { CategoriaObra } from '@types';

/**
 * State hook for the Projects Viewer component.
 */
export function useProjectsViewer(categorias: CategoriaObra[]) {
    const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? '');
    const [obraIdx, setObraIdx] = useState(0);
    const [imagenIdx, setImagenIdx] = useState(0);
    const [modalAbierto, setModalAbierto] = useState(false);

    const categoria = categorias.find((c) => c.id === categoriaId) ?? categorias[0];
    const obras = categoria?.obras ?? [];
    const total = obras.length;

    useEffect(() => {
        if (!categorias.some((c) => c.id === categoriaId)) {
            setCategoriaId(categorias[0]?.id ?? '');
            setObraIdx(0);
            setImagenIdx(0);
        }
    }, [categorias, categoriaId]);

    const cambiarCategoria = useCallback((id: string) => {
        setCategoriaId(id);
        setObraIdx(0);
        setImagenIdx(0);
        setModalAbierto(false);
    }, []);

    const obra = obras.length > 0 ? obras[obraIdx % obras.length] : undefined;

    const cambiarObra = useCallback(
        (idx: number) => {
            setObraIdx(idx);
            setImagenIdx(0);
        },
        [],
    );

    const anterior = useCallback(() => {
        if (total < 2) return;
        setObraIdx((i) => (i - 1 + total) % total);
        setImagenIdx(0);
    }, [total]);

    const siguiente = useCallback(() => {
        if (total < 2) return;
        setObraIdx((i) => (i + 1) % total);
        setImagenIdx(0);
    }, [total]);

    const cambiarImagen = useCallback((idx: number) => setImagenIdx(idx), []);
    const abrirModal = useCallback(() => setModalAbierto(true), []);
    const cerrarModal = useCallback(() => setModalAbierto(false), []);

    return {
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
    };
}

export { useProjectsViewer as useProyectosVisor };
