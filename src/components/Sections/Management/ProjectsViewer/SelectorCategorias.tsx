import { useEffect, useRef, useState } from 'react';
import { PILLS_GESTION, SECTION_OBRAS_GESTION } from '@constant';
import type { CategoriaObra } from '@types';

export interface CategorySelectorProps {
    categorias: CategoriaObra[];
    activa: string;
    onCambiar: (id: string) => void;
}

export type SelectorCategoriasProps = CategorySelectorProps;

type CategoriaOpcion = Pick<CategoriaObra, 'id' | 'label'>;

/** Las primeras categorías salen como pastillas sueltas; el resto, en el desplegable. */
const esPastilla = (id: string) =>
    (PILLS_GESTION as readonly string[]).includes(id);

const clasePastilla = (activa: boolean) =>
    `gestion-card-pastilla ${
        activa
            ? 'gestion-card-pastilla--activa'
            : 'gestion-card-pastilla--inactiva'
    }`;

/**
 * Selector de áreas de trabajo: las primeras en pastillas redondas y el resto
 * dentro del desplegable "Más categorías". El botón del desplegable se rotula
 * con la categoría activa si esa vive ahí, para que siempre se sepa dónde se
 * está.
 */
export default function SelectorCategorias({
    categorias,
    activa,
    onCambiar,
}: CategorySelectorProps) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const contenedorRef = useRef<HTMLDivElement>(null);

    const pastillas: CategoriaOpcion[] = categorias.filter((c) => esPastilla(c.id));
    const resto: CategoriaOpcion[] = categorias.filter((c) => !esPastilla(c.id));
    const activaEnResto = resto.some((c) => c.id === activa);
    const activaLabel = categorias.find((c) => c.id === activa)?.label ?? '';

    useEffect(() => {
        if (!menuAbierto) return;

        const alClickFuera = (evento: MouseEvent) => {
            if (!contenedorRef.current?.contains(evento.target as Node)) {
                setMenuAbierto(false);
            }
        };
        const alEsc = (evento: KeyboardEvent) => {
            if (evento.key === 'Escape') setMenuAbierto(false);
        };

        document.addEventListener('mousedown', alClickFuera);
        document.addEventListener('keydown', alEsc);
        return () => {
            document.removeEventListener('mousedown', alClickFuera);
            document.removeEventListener('keydown', alEsc);
        };
    }, [menuAbierto]);

    const seleccionar = (id: string) => {
        onCambiar(id);
        setMenuAbierto(false);
    };

    return (
        <div
            role="tablist"
            aria-label={SECTION_OBRAS_GESTION.areasTitle}
            className="gestion-card-pastillas"
        >
            {pastillas.map((c) => (
                <button
                    key={c.id}
                    id={`obra-tab-${c.id}`}
                    type="button"
                    role="tab"
                    aria-selected={c.id === activa}
                    aria-controls="obra-panel"
                    onClick={() => seleccionar(c.id)}
                    className={clasePastilla(c.id === activa)}
                >
                    {c.label}
                </button>
            ))}

            {resto.length > 0 && (
                <div ref={contenedorRef} className="gestion-card-mas">
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={menuAbierto}
                        onClick={() => setMenuAbierto((v) => !v)}
                        className={`${clasePastilla(activaEnResto)} gestion-card-pastilla--mas`}
                    >
                        <span className="truncate">
                            {activaEnResto ? activaLabel : 'Más categorías'}
                        </span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className={`size-3.5 shrink-0 transition-transform duration-300 ease-out ${
                                menuAbierto ? 'rotate-180' : ''
                            }`}
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    {menuAbierto && (
                        <div className="gestion-card-menu">
                            <div
                                role="menu"
                                aria-label="Más categorías de obras"
                                className="gestion-card-menu-panel"
                            >
                                <div className="gestion-card-menu-cabecera">
                                    <span className="gestion-card-menu-titulo">
                                        Todas las categorías
                                    </span>
                                    <span className="gestion-card-menu-conteo">
                                        {resto.length} disponibles
                                    </span>
                                </div>

                                <div className="gestion-card-menu-cuadro">
                                    {resto.map((c) => {
                                        const estaActiva = c.id === activa;
                                        return (
                                            <button
                                                key={c.id}
                                                id={`obra-tab-${c.id}`}
                                                type="button"
                                                role="menuitemradio"
                                                aria-checked={estaActiva}
                                                onClick={() => seleccionar(c.id)}
                                                className={`gestion-card-menu-item ${
                                                    estaActiva
                                                        ? 'gestion-card-menu-item--activo'
                                                        : 'gestion-card-menu-item--inactivo'
                                                }`}
                                            >
                                                <span className="line-clamp-1">
                                                    {c.label}
                                                </span>
                                                {estaActiva && (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                        className="gestion-card-menu-check size-3"
                                                    >
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <span
                                aria-hidden="true"
                                className="gestion-card-menu-pico"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export { SelectorCategorias as SelectorAreas };
