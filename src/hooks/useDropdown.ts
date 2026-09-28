import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Desplegable genérico: abre y cierra, se cierra con `Escape` o al hacer clic
 * fuera, y expone el ref del contenedor para que el consumidor sepa si el clic
 * fue por dentro o por fuera.
 *
 * Se usa en `SelectorCategorias` (el desplegable de "Más categorías") y sirve
 * para cualquier menú o popover que aparezca en el proyecto.
 */
export function useDropdown<T extends HTMLElement = HTMLDivElement>() {
    const [abierto, setAbierto] = useState(false);
    const ref = useRef<T>(null);

    const alternar = () => setAbierto((v) => !v);
    const abrir = () => setAbierto(true);
    const cerrar = () => setAbierto(false);

    useEffect(() => {
        if (!abierto) return;

        const alClickFuera = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setAbierto(false);
        };
        const alEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAbierto(false);
        };

        document.addEventListener('mousedown', alClickFuera);
        document.addEventListener('keydown', alEsc);

        return () => {
            document.removeEventListener('mousedown', alClickFuera);
            document.removeEventListener('keydown', alEsc);
        };
    }, [abierto]);

    return {
        abierto,
        ref: ref as RefObject<T | null>,
        alternar,
        abrir,
        cerrar,
    };
}
