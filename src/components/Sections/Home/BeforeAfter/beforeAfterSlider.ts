/**
 * El carrusel antes/después por dentro: diapositivas, divisor arrastrable y
 * navegación.
 *
 * Vive en un módulo y no en el `<script>` del componente para que el marcado no
 * tenga que cargar con él. Cada tarjeta (`[data-before-after-slider]`) se
 * inicializa por separado, así que puede haber varias en la misma página.
 *
 * Sobre el alcance: la búsqueda parte de la TARJETA, no del escenario. Los
 * controles cuelgan de debajo de las fotos y, buscados solo dentro del
 * escenario, no aparecerían —por eso el escenario tiene su propio atributo y se
 * busca aparte: es lo que se dibuja y lo que se observa, no un contenedor de
 * paso.
 */
import { $$, observeVisibility } from "@utils";

/** Las flechas que cambian de obra, con su sentido. */
const PASOS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const createSlider = (slider: HTMLElement): void => {
  const stage = slider.querySelector(
    "[data-before-after-stage]",
  ) as HTMLElement | null;
  const slides = Array.from(
    slider.querySelectorAll("[data-slide]"),
  ) as HTMLElement[];
  const range = slider.querySelector(
    "[data-comparison-range]",
  ) as HTMLInputElement | null;
  const counter = slider.querySelector(
    "[data-slide-counter]",
  ) as HTMLElement | null;
  const previousButton = slider.querySelector(
    "[data-previous-slide]",
  ) as HTMLButtonElement | null;
  const nextButton = slider.querySelector(
    "[data-next-slide]",
  ) as HTMLButtonElement | null;

  if (
    !stage ||
    !range ||
    !counter ||
    !previousButton ||
    !nextButton ||
    slides.length === 0
  )
    return;

  let activeIndex = 0;

  /** Mueve el divisor al valor del rango. Solo hay divisor en las comparaciones. */
  const updateComparison = () => {
    const value = Number(range.value);
    const activeSlide = slides[activeIndex];
    const afterLayer = activeSlide.querySelector(
      "[data-after-layer]",
    ) as HTMLElement | null;
    const divider = activeSlide.querySelector(
      "[data-divider]",
    ) as HTMLElement | null;

    range.hidden = !afterLayer || !divider;
    if (!afterLayer || !divider) return;

    afterLayer.style.setProperty("clip-path", `inset(0 0 0 ${value}%)`);
    divider.style.setProperty("left", `${value}%`);
    range.setAttribute("aria-valuetext", `${value}% después`);
  };

  /** La pista que insinúa que el divisor se puede arrastrar. */
  const animateDividerCue = () => {
    if (prefersReducedMotion()) return;

    const activeSlide = slides[activeIndex];
    const afterLayer = activeSlide.querySelector(
      "[data-after-layer]",
    ) as HTMLElement | null;
    const divider = activeSlide.querySelector(
      "[data-divider]",
    ) as HTMLElement | null;
    const handle = divider?.querySelector(
      "[data-divider-handle]",
    ) as HTMLElement | null;

    if (!afterLayer || !divider) return;

    afterLayer.getAnimations().forEach((animation) => animation.cancel());
    divider.getAnimations().forEach((animation) => animation.cancel());
    handle?.getAnimations().forEach((animation) => animation.cancel());

    /* Ida y vuelta con descansos en el centro. Antes eran cuatro posiciones en
       línea recta (50 → 38 → 62 → 50): el divisor arrancaba y frenaba de golpe en
       cada extremo. Ahora los `offset` marcan una pausa al principio, al cruzar el
       50% y al volver, y cada tramo lleva su propio cubic-bezier (acelera,
       frena), así que el 50% se lee como el estado en reposo al que la asa
       regresa. */
    const TRAMOS = [
      { offset: 0, x: 50 },
      { offset: 0.18, x: 50 },
      { offset: 0.37, x: 32 },
      { offset: 0.5, x: 50 },
      { offset: 0.63, x: 68 },
      { offset: 0.82, x: 50 },
      { offset: 1, x: 50 },
    ];
    const duration = 2200;
    const easing = "cubic-bezier(0.42, 0, 0.58, 1)";

    afterLayer.animate(
      TRAMOS.map(({ offset, x }) => ({
        offset,
        clipPath: `inset(0 0 0 ${x}%)`,
      })),
      { duration, easing },
    );
    divider.animate(
      TRAMOS.map(({ offset, x }) => ({ offset, left: `${x}%` })),
      { duration, easing },
    );
    /* El asa palpita en los dos extremos: el ojo registra el tirón sin tener que
       mirar el divisor, que es una línea de medio píxel. El escalado va en un hijo
       sin `translate`, porque WAAPI pisa `transform` entero y el centrado del asa
       (que sí usa translate) se perdería. */
    handle?.animate(
      [
        { offset: 0, transform: "scale(1)" },
        { offset: 0.18, transform: "scale(1)" },
        { offset: 0.37, transform: "scale(1.14)" },
        { offset: 0.5, transform: "scale(1)" },
        { offset: 0.63, transform: "scale(1.14)" },
        { offset: 0.82, transform: "scale(1)" },
        { offset: 1, transform: "scale(1)" },
      ],
      { duration, easing },
    );
  };

  /** La entrada de la diapositiva del alcalde: cada mitad entra desde un lado. */
  const animateMayorSlide = () => {
    if (prefersReducedMotion()) return;

    const activeSlide = slides[activeIndex];
    if (!activeSlide.hasAttribute("data-mayor-slide")) return;

    ["[data-mayor-before]", "[data-mayor-after]"].forEach(
      (selector, index) => {
        const panel = activeSlide.querySelector(selector) as HTMLElement | null;
        if (!panel) return;

        panel.getAnimations().forEach((animation) => animation.cancel());
        panel.animate(
          [
            { transform: "translateX(100%)", opacity: 0.7 },
            { transform: "translateX(0)", opacity: 1 },
          ],
          {
            duration: 750,
            delay: index * 120,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
        );
      },
    );
  };

  const animateActiveSlide = () => {
    if (slides[activeIndex].hasAttribute("data-mayor-slide")) {
      animateMayorSlide();
    } else {
      animateDividerCue();
    }
  };

  const showSlide = (index: number) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });
    range.value = "50";
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    updateComparison();
    animateActiveSlide();
  };

  range.addEventListener("input", updateComparison);
  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

  /* Con el foco dentro de la tarjeta, las flechas cambian de obra y el navegador
     no desplaza la página: sin `preventDefault` el scroll se come la pulsación y
     la foto se mueve de sitio mientras la cambiamos. El rango se salta porque
     ahí las flechas ya mueven el divisor. */
  slider.addEventListener("keydown", (event) => {
    const step = PASOS[event.key];
    if (step === undefined || event.target === range) return;

    event.preventDefault();
    showSlide(activeIndex + step);
  });

  updateComparison();

  /* Se observa el escenario, que es lo que aparece en pantalla: la tarjeta
     entera mide más alto al bajar los controles y el umbral se cumpliría más
     tarde del que le toca. */
  observeVisibility(stage, animateActiveSlide, {
    once: false,
    threshold: 0.35,
  });
};

/** Inicializa todas las tarjetas de la página. */
export const initBeforeAfterSliders = (): void => {
  $$("[data-before-after-slider]").forEach((slider) =>
    createSlider(slider as HTMLElement),
  );
};