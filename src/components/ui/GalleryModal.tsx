import { useEffect, useRef } from 'react';
import type { ImagenGaleria } from '@types';

/** Deslizador en px a partir del cual un toque cuenta como arrastre. */
const UMBRAL_SWIPE = 50;

export interface GalleryModalProps {
    imagenes: ImagenGaleria[];
    indice: number;
    onIndice: (i: number) => void;
    onCerrar: () => void;
}

export type GaleriaModalProps = GalleryModalProps;

/**
 * Image gallery lightbox component.
 */
export default function GalleryModal({
    imagenes,
    indice,
    onIndice,
    onCerrar,
}: GalleryModalProps) {
    const total = imagenes.length;
    const touchX = useRef<number | null>(null);

    const segura = total === 0 ? 0 : (((indice % total) + total) % total);
    const actual = imagenes[segura];

    const anterior = () => onIndice((segura - 1 + total) % total);
    const siguiente = () => onIndice((segura + 1) % total);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCerrar();
            else if (e.key === 'ArrowLeft') anterior();
            else if (e.key === 'ArrowRight') siguiente();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    if (!actual) return null;

    return (
        <div
            className='galeria-modal'
            role='dialog'
            aria-modal='true'
            aria-label='Galería de imágenes'
            onClick={onCerrar}
            onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (dx > UMBRAL_SWIPE) anterior();
                else if (dx < -UMBRAL_SWIPE) siguiente();
            }}
        >
            <button
                type='button'
                className='galeria-modal-cerrar'
                onClick={(e) => {
                    e.stopPropagation();
                    onCerrar();
                }}
                aria-label='Cerrar galería'
                title='Cerrar galería'
            >
                <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    aria-hidden='true'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18 18 6M6 6l12 12'
                    />
                </svg>
            </button>

            {total > 1 && (
                <button
                    type='button'
                    className='galeria-modal-flecha galeria-modal-flecha--prev'
                    onClick={(e) => {
                        e.stopPropagation();
                        anterior();
                    }}
                    aria-label='Imagen anterior'
                    title='Imagen anterior'
                >
                    <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        aria-hidden='true'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m15 18-6-6 6-6'
                        />
                    </svg>
                </button>
            )}

            <figure className='galeria-modal-figure' onClick={(e) => e.stopPropagation()}>
                <img
                    key={actual.src}
                    className='galeria-modal-img'
                    src={actual.src}
                    alt={actual.titulo ?? 'Ampliación'}
                    decoding='async'
                />
                {actual.titulo && (
                    <figcaption className='galeria-modal-pie'>
                        {actual.titulo}
                    </figcaption>
                )}
            </figure>

            {total > 1 && (
                <button
                    type='button'
                    className='galeria-modal-flecha galeria-modal-flecha--next'
                    onClick={(e) => {
                        e.stopPropagation();
                        siguiente();
                    }}
                    aria-label='Imagen siguiente'
                    title='Imagen siguiente'
                >
                    <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        aria-hidden='true'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m9 18 6-6-6-6'
                        />
                    </svg>
                </button>
            )}

            {total > 1 && (
                <p className='galeria-modal-contador' aria-live='polite'>
                    {String(segura + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')}
                </p>
            )}
        </div>
    );
}

export { GalleryModal as GaleriaModal };
