import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * `<lite-youtube>` es un custom element, así que TypeScript necesita saber que
 * existe antes de poder usarlo como etiqueta JSX. Solo se declaran los
 * atributos que el player lee de verdad, para que un error de tipeo siga
 * marcando error.
 *
 * React 19 resuelve JSX por `React.JSX`, de ahí la ampliación del módulo.
 */
type LiteYoutubeAttributes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  videoid?: string;
  playlistid?: string;
  /** Verbo con el que se arma la etiqueta del botón, p. ej. "Reproducir". */
  videoplay?: string;
  videotitle?: string;
  videoStartAt?: string;
  /** Embeve desde `youtube-nocookie.com` en vez de `youtube.com`. */
  nocookie?: boolean;
  /** Tamaño de la miniatura de YouTube: `hqdefault`, `maxresdefault`, … */
  posterquality?: string;
  posterloading?: 'lazy' | 'eager';
  params?: string;
  short?: boolean;
  autoload?: boolean;
  autopause?: boolean;
  autoplay?: boolean;
  disablenoscript?: boolean;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lite-youtube': LiteYoutubeAttributes;
    }
  }
}

export {};
