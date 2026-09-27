export type ObserveTarget = Element | Element[] | NodeListOf<Element>;

export interface ObserveVisibilityOptions {
    /** Margen adicional al viewport. Por defecto dispara un poco antes de entrar. */
    rootMargin?: string;
    /** Porcentaje visible necesario para disparar. */
    threshold?: number;
    /** Dejar de observar el elemento después de la primera entrada. */
    once?: boolean;
}

export interface RevealOptions extends ObserveVisibilityOptions {
    /** Elementos a observar. Por defecto, todos los `[data-reveal]` del documento. */
    targets?: ObserveTarget | null;
    /** Clase que se añade al elemento cuando entra en el viewport. */
    visibleClass?: string;
    /** Callback adicional por cada elemento revelado. */
    onReveal?: (element: Element) => void;
}