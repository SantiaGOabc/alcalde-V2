import { SECTION_OBRAS_GESTION } from '@constant';
import type { CategoriaObra } from '@types';

export interface CategorySelectorProps {
    categorias: CategoriaObra[];
    activa: string;
    onCambiar: (id: string) => void;
}

export type SelectorCategoriasProps = CategorySelectorProps;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Índice de áreas de trabajo, a la manera de un índice de libro: numerado, con
 * el total de obras de cada área. En pantallas anchas es una lista vertical fija;
 * en móvil, una tira que se desliza.
 */
export default function CategorySelector({
    categorias,
    activa,
    onCambiar,
}: CategorySelectorProps) {
    return (
        <nav aria-label={SECTION_OBRAS_GESTION.areasTitle} className="gestion-indice">
            <p className="gestion-indice-titulo">{SECTION_OBRAS_GESTION.areasTitle}</p>

            <div
                role="tablist"
                aria-orientation="vertical"
                aria-label={SECTION_OBRAS_GESTION.areasTitle}
                className="gestion-indice-lista"
            >
                {categorias.map((c, i) => (
                    <button
                        key={c.id}
                        id={`obra-tab-${c.id}`}
                        type="button"
                        role="tab"
                        aria-selected={c.id === activa}
                        aria-controls="obra-panel"
                        onClick={() => onCambiar(c.id)}
                        className="gestion-indice-item"
                    >
                        <span className="gestion-indice-num">{pad(i + 1)}</span>
                        <span className="gestion-indice-label">{c.label}</span>
                        <span className="gestion-indice-count">{c.obras.length}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

export { CategorySelector as SelectorCategorias };
