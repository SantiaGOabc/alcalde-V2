import { useEffect, type CSSProperties } from 'react';
import { youtubeId } from '@utils';

export interface WorkVideoProps {
  /** La URL tal como la pegó el administrador: un archivo o un link de YouTube. */
  src: string;
  poster?: string;
  titulo?: string;
  /** Clases de la caja que envuelve todo. */
  className?: string;
}

/**
 * Reproductor del video de una obra, para las dos variantes del visor.
 *
 * Un `<video>` solo reproduce un archivo. Un link de YouTube no es un archivo,
 * así que no hay nada que descargar y el reproductor sale en negro; por eso los
 * links de YouTube van por `<lite-youtube>`. El panel guarda el link completo
 * tal cual: el ID solo se desarrolla acá, porque el embed es lo único que lo
 * necesita.
 *
 * `<lite-youtube>` muestra un póster con botón de reproduce y solo baja el
 * player de YouTube cuando el visitante lo pide, que es el punto: el visor
 * sigue siendo barato y Google nunca ve a quien no le dio play.
 *
 * La librería llama `customElements.define` en cuanto se importa y no tiene
 * guarda para servidor, así que se carga desde un efecto: en el servidor la
 * etiqueta es solo markup y el navegador la mejora cuando llega el módulo.
 *
 * Todo va dentro de una caja propia porque el visor estiliza los hijos directos
 * de la galería (`.gestion-media > button` fuerza `position`), y esta caja es
 * la del reproductor, no la de la foto que se amplía.
 */
export default function WorkVideo({
  src,
  poster,
  titulo = 'Video',
  className = 'absolute inset-0 size-full',
}: WorkVideoProps) {
  const id = youtubeId(src);

  useEffect(() => {
    void import('@justinribeiro/lite-youtube');
  }, []);

  if (id) {
    return (
      <div className={className}>
        <lite-youtube
          videoid={id}
          nocookie
          videoplay="Reproducir"
          videotitle={titulo}
          params="rel=0"
          className="absolute inset-0 size-full"
          // El player usa 16/9 por defecto; la caja de medios del visor es 16/10.
          style={{ '--lite-youtube-aspect-ratio': '16 / 10' } as CSSProperties}
        >
          {poster && <img slot="image" src={poster} alt="" loading="lazy" decoding="async" />}
        </lite-youtube>
      </div>
    );
  }

  return (
    <div className={className}>
      <video
        key={src}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        src={src}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
