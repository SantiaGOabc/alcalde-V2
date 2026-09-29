interface ArrowButtonProps {
    direction: 'left' | 'right';
    onClick: () => void;
    /** `carousel` = botón sobre el contenido; `modal` = botón del lightbox. */
    variant?: 'carousel' | 'modal';
    className?: string;
    'aria-label'?: string;
    title?: string;
}

const BASE =
    'grid shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-colors duration-200 hover:border-(--brand-primary) hover:bg-(--brand-primary) hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-40';

const SIZES = {
    carousel: 'size-10 sm:size-12 lg:size-14',
    modal: 'size-11 p-3 lg:size-12',
} as const;

/**
 * Flecha de carrusel/lightbox compartida. El tamaño lo elige la variante, no el
 * componente: la tarjeta violeta la monta sobre el fondo de la sección con
 * `absolute` y le pasa sus propias clases de posición.
 */
export default function ArrowButton({
    direction,
    onClick,
    variant = 'carousel',
    className = '',
    'aria-label': ariaLabel = direction === 'left' ? 'Anterior' : 'Siguiente',
    title,
}: ArrowButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            title={title ?? ariaLabel}
            className={`${BASE} ${SIZES[variant]} ${className}`}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4 lg:size-5"
            >
                {direction === 'left' ? (
                    <path d="m15 18-6-6 6-6" />
                ) : (
                    <path d="m9 18 6-6-6-6" />
                )}
            </svg>
        </button>
    );
}
