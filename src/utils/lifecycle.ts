/**
 * Inicialización de página compatible con la navegación SPA (`<ClientRouter />`).
 *
 * Con ClientRouter el navegador no recarga: Astro reemplaza el `<body>` y los
 * `<script>` de módulo solo se ejecutan la primera vez. Por eso todo lo que se
 * enlaza al DOM (oyentes, observers) debe pasar por aquí:
 *
 *   onPageLoad(() => {
 *     const stop = bindAlgo();
 *     return stop; // opcional: se llama al salir de la página
 *   });
 *
 * `setup` corre una vez por cada `<body>` (al llegar a la página, ya sea la carga
 * inicial o una navegación) y su limpieza corre justo antes de que Astro cambie
 * de página, así los oyentes globales (`window`, `document`) no se acumulan.
 */
export const onPageLoad = (setup: () => void | (() => void)): void => {
  let initializedFor: HTMLElement | null = null;
  let cleanup: void | (() => void);

  const teardown = () => {
    if (typeof cleanup === 'function') cleanup();
    cleanup = undefined;
  };

  const init = () => {
    // Un mismo <body> nunca se inicializa dos veces (el script y `astro:page-load` pueden coincidir).
    if (initializedFor === document.body) return;
    initializedFor = document.body;
    teardown();
    cleanup = setup();
  };

  init();
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', teardown);
};
