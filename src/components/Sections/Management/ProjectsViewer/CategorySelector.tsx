import { PILLS_GESTION } from '@constant';
import { useDropdown } from '@/hooks';
import type { CategoriaObra } from '@types';

export interface CategorySelectorProps {
    categorias: CategoriaObra[];
    activa: string;
    onCambiar: (id: string) => void;
}

export type SelectorCategoriasProps = CategorySelectorProps;

const PILL_BASE =
    'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors sm:px-5 sm:text-[13px]';

const pillActiva =
    'border-(--gestion-accent) bg-(--gestion-accent) text-white shadow-md shadow-(--gestion-accent)/25';

const pillInactiva =
    'border-gray-300 bg-white text-gray-600 hover:border-(--gestion-accent) hover:text-(--gestion-accent)';

/** Category selector pill tabs with an overflow dropdown menu. */
export default function CategorySelector({
    categorias,
    activa,
    onCambiar,
}: CategorySelectorProps) {
    const { abierto, ref, alternar, cerrar } = useDropdown<HTMLDivElement>();

    const pills = categorias.filter((c) =>
        (PILLS_GESTION as readonly string[]).includes(c.id),
    );
    const resto = categorias.filter(
        (c) => !(PILLS_GESTION as readonly string[]).includes(c.id),
    );

    const activaEnResto = resto.some((c) => c.id === activa);
    const activaLabel = categorias.find((c) => c.id === activa)?.label ?? '';

    const seleccionar = (id: string) => {
        onCambiar(id);
        cerrar();
    };

    return (
        <div
            role="tablist"
            aria-label="Categorías de obras"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
        >
            {pills.map((c) => (
                <button
                    key={c.id}
                    id={`obra-tab-${c.id}`}
                    type="button"
                    role="tab"
                    aria-selected={c.id === activa}
                    aria-controls="obra-panel"
                    onClick={() => seleccionar(c.id)}
                    className={`${PILL_BASE} ${c.id === activa ? pillActiva : pillInactiva}`}
                >
                    {c.label}
                </button>
            ))}

            {resto.length > 0 && (
                <div ref={ref} className="relative">
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={abierto}
                        onClick={alternar}
                        className={`${PILL_BASE} ${
                            activaEnResto ? pillActiva : pillInactiva
                        }`}
                    >
                        <span>{activaEnResto ? activaLabel : 'Más categorías'}</span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className={`size-3.5 shrink-0 transition-transform duration-200 ${
                                abierto ? 'rotate-180' : ''
                            }`}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {abierto && (
                        <div className="gestion-categorias-menu">
                            <div
                                role="menu"
                                aria-label="Más categorías de obras"
                                className="gestion-categorias-panel"
                            >
                                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                                        Todas las categorías
                                    </span>
                                    <span className="text-xs text-gray-400 tabular-nums">
                                        {resto.length}
                                    </span>
                                </div>

                                <div className="gestion-categorias-grid">
                                    {resto.map((c) => {
                                        const seleccionada = c.id === activa;
                                        return (
                                            <button
                                                key={c.id}
                                                id={`obra-tab-${c.id}`}
                                                type="button"
                                                role="menuitemradio"
                                                aria-checked={seleccionada}
                                                onClick={() => seleccionar(c.id)}
                                                className={`gestion-categoria-item ${
                                                    seleccionada
                                                        ? 'gestion-categoria-item--activa'
                                                        : ''
                                                }`}
                                            >
                                                <span className="truncate">{c.label}</span>
                                                {seleccionada && (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                        className="size-3 shrink-0 text-(--gestion-accent)"
                                                    >
                                                        <path d="M20 6 9 17l-5-5" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export { CategorySelector as SelectorCategorias };
