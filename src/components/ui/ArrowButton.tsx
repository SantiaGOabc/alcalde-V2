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
    'grid shrink-0 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-lg transition-all duration-200 hover:bg-black/45 active:scale-95 disabled:pointer-events-none disabled:opacity-40';

const SIZES = {
    carousel: 'size-9 lg:size-10',
    modal: 'size-11 p-3 lg:size-12',
} as const;

/**
 * Flecha de carrusel/lightbox compartida. Reemplaza al `ArrowButton` que
 * tenía el proyecto origen, con las clases del tema de este proyecto.
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
