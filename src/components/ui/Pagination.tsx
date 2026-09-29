import Button from './Button';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/** Paginador reutilizable: "11–20 de 134" con botones Anterior / Siguiente. */
export default function Pagination({ page, pageSize, total, onPageChange, isLoading = false }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <p className="text-sm text-slate-500" aria-live="polite">
        <span className="font-bold text-slate-800">{from}–{to}</span> de {total}
      </p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" size="sm" disabled={isLoading || page <= 1} onClick={() => onPageChange(page - 1)}>
          ← Anterior
        </Button>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">{page} / {pageCount}</span>
        <Button type="button" variant="secondary" size="sm" disabled={isLoading || page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Siguiente →
        </Button>
      </div>
    </nav>
  );
}
