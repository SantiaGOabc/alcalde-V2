# Explicación y detalles del proyecto

Este documento explica qué hace el proyecto y qué contiene cada archivo de código.

## Resumen general

El proyecto es una **web de campaña / sitio oficial de Manfred Reyes Villa (candidato a la Alcaldía de Cochabamba)** construida con **Astro 7** + **React 19** + **Tailwind CSS 4** + **TypeScript** en modo estricto.

Principales características técnicas:

- **Islas React:** solo el formulario del buzón ciudadano es una isla React (`client:visible`); el resto es estático (HTML generado en build).
- **Imágenes optimizadas:** el componente `Image` de `astro:assets` procesa las imágenes remotas apuntando a un dominio permitido en `astro.config.mjs`.
- **Animaciones con CSS puro + IntersectionObserver:** el hero usa un carrusel con `@keyframes` encadenados sin JS, y las frases forman un slider vertical "sticky" que se desplaza horizontalmente según el progreso del scroll.
- **Patrón de barril (barrel):** `index.ts` en cada carpeta vuelve a exportar los módulos para importar con un alias corto (`@components`, `@constant`, `@utils`, `@types`, `@icons`, etc.).
- **Configuración centralizada:** todo el contenido de la página está en constantes (`src/constants`), separado de los componentes.
- **Aún en desarrollo:** hay archivos vacíos (placeholders) y `TODO`s que indican trabajo pendiente (p. ej. traer imágenes/video desde un CMS, crear un componente de video).

---

## Archivos de raíz

### `package.json`
Define el proyecto como módulo ESM y declara los scripts y dependencias.

- Scripts: `dev` (`astro dev --force`), `build` (`astro build`), `preview` (`astro preview`), `astro` (CLI).
- Dependencias de runtime: `astro`, `@astrojs/react`, `react`, `react-dom`, `@tailwindcss/vite`.
- Dependencias de desarrollo: `@astrojs/check`, `typescript`, `tailwindcss`, `autoprefixer`, `postcss`.
- Requiere **Node >= 22.12.0**.
- `allowScripts: { esbuild: true }`: permite el postinstall de esbuild (necesario para el build).

### `astro.config.mjs`
Configuración de Astro:

- `image.remotePatterns`: permite optimizar imágenes desde el dominio `https://manfredreyesvilla.netlify.app` en la ruta `/_astro/**`.
- `vite.plugins: [tailwindcss()]`: integra Tailwind CSS 4 vía el plugin de Vite.
- `integrations: [react()]`: habilita los componentes React.

### `tsconfig.json`
Configura TypeScript estricto basado en `astro/tsconfigs/strict`. Define los **alias de importación**:

- `@/*` → `./src/*`
- `@icons` → `./src/assets/icons/index.ts`
- `@components` → `./src/components/index.ts`
- `@constant` → `./src/constants/index.ts`
- `@layouts/*`, `@pages/*`, `@styles/*`
- `@utils` → `./src/utils/index.ts`
- `@types` → `./src/types/index.ts`

### `global.css`
Hoja de estilos global importada por `MainLayout`:

- Importa `tailwindcss`.
- Define variables CSS de marca: `--button-primary: #472D82` (púrpura) y `--button-outiline`.
- En `@layer base` pone estilos base: sin padding/margin en `html, body`, `overflow-x: clip`, y padding responsive para `nav` y `section` (1.5rem / 3rem / 6rem según breakpoint). El comentario explica por qué se meten en `@layer base` (para no pisotear las utilidades `py-*`/`px-*`).
- En `@layer components` define `.button-primary` y `.button-outline` con `@apply`.

### `README.md`
Plantilla sin personalizar del starter de Astro ("Astro Starter Kit: Basics"). No describe este proyecto.

### `tmp-probe.mjs`
Script de prueba temporal: compila `global.css` con el compilador de Tailwind y escribe `tmp-tailwind-probe.css` para verificar cómo se procesan las clases. Se puede considerar basura temporal.

### `.gitignore`
Archivo de ignorados de git (no se detalla). Habría que verificar dentro si se ignoran `dist`, `node_modules`, `.astro`, etc.

---

## `src/` — código fuente

### `src/constants/` — contenido y datos del sitio

Todo el contenido editable (textos, URLs, enlaces) vive aquí, separado de los componentes.

- **`src/constants/index.ts`**: barril que re-exporta todo desde `home/home.ts`, `global/navbar.ts` y `global/footer.ts`.
- **`src/constants/global/navbar.ts`**: exporta `NAVBAR`, el array de rutas de la navegación principal: `Inicio (/)`, `Sobre mí (/about)`, `Gestión (/management)`, `Buzón ciudadano (/mailbox)`.
- **`src/constants/global/footer.ts`**: exporta `SOCIAL_ICONS`, array con las redes sociales (X, Facebook, Threads, Instagram, TikTok): `name`, `href` (URL) y `svg` (los trazos/path del ícono como string HTML que se inyecta con `set:html`).
- **`src/constants/home/home.ts`**: exporta todo el contenido de la home:
  - `CONTENT_HERO_HOME`: título y descripción del hero + `images` (array de URLs de imágenes remotas que rotan en el carrusel). Tiene un `TODO` indicando que deberían venir del CMS.
  - `SECTION_BIOGRAPHY_CONTENT`: título, descripción, dos botones ("Más sobre mí" → `/about`, "Gestión completa" → `/management`) y los datos del `video` (poster, type `video/mp4`, url en Cloudinary). Hay `TODO` para añadir un poster real.
  - `SECTION_PHRASES_CONTENT`: objeto con 4 frases (`philosophy`, `family`, `pets`, `community`), cada una con su `phrase` (texto) y `imageURL`.
  - `SECTION_BEFORE_AFTER_CONTENT`: datos del slider antes/después: `title`, `description`, `transitionPhrase` ("Pioneros en ...") y dos arrays `before`/`after` con 4 entradas (title, imageURL, imageFit) — 3 comparaciones: los mismos lugares (Laguna Coña Coña, Plaza de las banderas, Laguna Alalay) en "antes" y "después".
  - `SECTION_BOOK_CONTENT`: datos de la sección del libro: `title` ("Cocha, la mejor ciudad"), `eyebrow`, `description`, `imageURL`, `imageAlt`, `button` ("Abrir libro").

### `src/components/` — componentes UI

- **`src/components/index.ts`**: barril que exporta todos los componentes con alias:
  - Globales: `Link`, `Tipography`, `Hero`, `Navbar`, `Footer`.
  - Sección: `Section`.
  - Secciones de la home: `Home`, `About`, `BiographyVideo`, `Phrase`, `BeforeAfter`, `Book`.
  - UI: `Button`, `Input`.

#### `src/components/global/`

- **`Link.astro`**: envoltorio de `<a>`. Recibe `href` y `isExternal` (por defecto `false`). Si es externo agrega `target="_blank" rel="noopener noreferrer"`; si no, `target="_self" rel="opener noreferrer"`. Permite pasar cualquier atributo HTML adicional.
- **`Tipography.astro`**: componente de tipografía. Propiedades `as` (h1–h6, p, span, small — por defecto `p`), `variant` (h1, h2, h3, body, body-sm, muted) y `color` (primary, secondary, muted, inherit). Combina las clases de variante + color + las propias del usuario.
- **`Section.astro`**: envoltorio de `<section>` con variantes de color: `primary` (gris/claro), `secondary` (blanco), `accent` (púrpura con texto blanco). Acepta `variant`, `className`/`class` y atributos extra.
- **`Hero.astro`**: sección hero a pantalla completa (min-svh). Props: `title`, `description`, `images[]`, `id`. Si hay imágenes, las renderiza apiladas en `.hero-media` con `Image` (1920×1080, primera `eager`, resto `lazy`); por cada `src` se expone `--i` (índice) para el retraso de la animación. Muestra un velo oscuro (`.hero-veil`) y el texto (eyebrow + h1). El CSS de la animación está en `src/styles/home.css`.
- **`Navbar.astro`**: barra de navegación **fija** en la parte superior. Muestra el logo "M.R.V" y los enlaces de `NAVBAR`, marcando `aria-current="page"` en la ruta actual (`Astro.url.pathname`). Lleva un `<script>` que en el cliente cambia el fondo según el scroll: transparente al inicio, y con `bg-(--home-accent)`, sombra y `backdrop-blur` al hacer scroll (`window.scrollY > 16`). Importa `src/styles/home.css`.
- **`Footer.astro`**: pie de página sobre fondo `--home-accent`. Incluye: una línea decorativa superior, la navegación de `NAVBAR` (con animación de subrayado al hover), los íconos sociales de `SOCIAL_ICONS` (SVG inyectado con `set:html`, enlaces `_blank`), y el copyright con el año actual (`new Date().getFullYear()`).

#### `src/components/Sections/`

- **`About/About.astro`**: sección simple que muestra un `title` (h2) y una `description`, con un `<slot />` para contenido extra.
- **`Home/Home.astro`**: **componente que arma la página de inicio de un solo golpe** (la página `index.astro` solo lo importa). Dentro:
  - Envuelve todo en `MainLayout` con title "Inicio".
  - Renderiza `Hero`, `BiographyVideo`, el slider de frases, `BeforeAfter` y `Book`.
  - Para las frases usa `Object.entries(SECTION_PHRASES_CONTENT)` y calcula, por posición: variante (pares `secondary`, impares `primary`), `lead` para la primera y `reverse` en las impares.
  - Un `<script>` vincula `bindScrollProgress` al `.phrase-slider` para animar el slider horizontal con el scroll.
- **`Home/Phrase.astro`**: una "tarjeta" de frase del slider. Props: `phrase`, `imageURL`, `reverse`, `variant`, `lead` (primera frase) e `index` (posición). Estructura: texto en `blockquote/cite` a un lado y una foto circular (`figure`) al otro, con clases `phrase-item*` que el CSS de `home.css` usa para el efecto sticky/horizontal. La imagen circular se posiciona con `-translate-x-1/2` y `rounded-full`.
- **`Home/BiographyVideo.astro`**: sección "¿Quién soy?" de dos columnas (texto izquierda, video derecha). Props: `title`, `description`, `buttons` (tupla de 2: primario y secundario con sus URLs) y `video` (poster, type, url). Renderiza dos CTA (`Link` con clases `home-cta home-cta--primary/--ghost`) y un `<video controls playsinline preload="metadata">`. Tiene un `TODO`: falta crear un componente de video para reutilizar aquí y en el libro.
- **`Home/BeforeAfter.astro`**: **el componente más complejo**. Implementa un slider de comparación antes/después con navegación entre varias comparaciones:
  - Recibe `before[]` y `after[]` y las combina en pares (`comparisons`), insertando una diapositiva "interlude" (la `transitionPhrase`) entre el índice 1 y 2.
  - Cada diapositiva de comparación muestra la imagen "antes" y la imagen "después" en una capa recortada con `clip-path`, un divisor vertical con flecha, y etiquetas "Antes · …" / "Después · …".
  - El `<input type="range">` transparente (accesible, con `aria-label` y `aria-valuetext`) controla el divisor.
  - Un `<script>` el cliente: maneja los botones anterior/siguiente (`data-previous-slide`/`data-next-slide`), el contador `01 / N` (`data-slide-counter`), actualiza `clip-path`/`left` al mover el range, y añade animaciones (`animateDividerCue` para el divisor, `animateMayorSlide` para la primera comparación con animación de entrada). Respeta `prefers-reduced-motion` y observa la visibilidad con `observeVisibility`.
- **`Home/Book.astro`**: sección que promociona el "libro digital" de Cochabamba. Los datos vienen de `SECTION_BOOK_CONTENT`. Dispone texto (eyebrow + título + descripción) y un botón `Button` ("Abrir libro"), junto a una maqueta de libro: fondo en bloque púrpura, `figure` con la imagen y gradiente oscuro, cabecera "Manfred Reyes Villa / Cochabamba" y pie con "Una ciudad en movimiento" y "Cocha, la mejor ciudad".

#### `src/components/Sections/MailBox/` (buzón ciudadano)

- **`MailBox.astro`**: sección centrada que renderiza la isla React `<MailBoxForm client:visible />` (se hidrata solo cuando el usuario la ve en pantalla).
- **`MailBoxForm.tsx`**: formulario de contacto en React ("Buzón Ciudadano"):
  - Estado local con `useState`: `form` (`nombre`, `correo`, `mensaje`) y `estado` (`idle | enviando | listo`).
  - `enviar`: frena el submit por defecto, pone estado `enviando` (simula un envío con `setTimeout` de 1s), luego `listo` y tras 3s limpia el formulario y vuelve a `idle`. **No hay un endpoint real; es una simulación**.
  - Botón "Cancelar" limpia el form; botón de envío se deshabilita mientras `enviando`.
  - Muestra un mensaje de éxito animado (`animate-pulse`) cuando `estado === 'listo'`.

#### `src/components/ui/`

- **`Button.astro`**: botón con variantes `primary` (azul), `ghost` (gris) e `inverse` (blanco, para fondos oscuros), prop `text` y `className`. Clases base: redondeado, padding, `focus-visible` ring.
- **`input.astro`**: envoltorio de `<input>` que agrega una clase base (`block w-full ...`) y combina con `class:list`.
- **`modal.astro`**: **vacío** (placeholder). Archivo sin contenido, aún sin implementar.

### `src/layouts/`

- **`MainLayout.astro`**: layout principal de las páginas públicas. Recibe `title`. Emite el HTML: `<html lang="es">`, `head` con charset, viewport, favicon (`/favicon.svg`), meta description "Alcaldía V2" y `<title>`. El `body` es flex-col min-h-screen: `<Navbar>`, `<main class="flex-1">` con el `<slot />`, y `<Footer>`. Importa `global.css`.
- **`cms.astro`**: **vacío** (placeholder). Pensado para un layout del CMS/panel de administración.

### `src/pages/` — rutas de la aplicación

- **`index.astro`**: página de inicio (`/`). Solo importa y renderiza `<Home />`.
- **`about.astro`**: página "Sobre mí" (`/about`). Usa `MainLayout` (title "Sobre") y la sección `About` con título "Nuestro Equipo" y descripción "Conoce al equipo detrás de este proyecto".
- **`management.astro`**: página "Gestión" (`/management`). Usa `MainLayout` (title "Gestión") y un `Hero` (importado de `../global/hero.astro`, nota: ruta en minúsculas que **no coincide** con el archivo real `Hero.astro` en `components/global` — probablemente un bug a revisar) con título "Panel de Gestión".
- **`mailbox.astro`**: página "Buzón ciudadano" (`/mailbox`). Usa `MainLayout` (title "Formulario"), la sección `MailBox` e importa `../styles/mailbox.css`.

### `src/styles/` — hojas de estilo

- **`home.css`**: la más completa. Importa `@reference "tailwindcss"` para usar `@apply` en CSS puro:
  - **Design tokens** para la home: `--home-accent: #0a5cff`, `--home-accent-strong`, `--home-ink`, `--hero-step: 7s`.
  - **Hero carrusel**: `.hero-media` y `.hero-media__layer` con la animación `hero-crossfade` encadenada (cada capa se retrasa `--i * 7s`, duración total `--hero-count * 7s`), más el velo `.hero-veil` (negro al 35%). Respeta `prefers-reduced-motion` (muestra solo la primera capa).
  - **Slider de frases**: `.phrase-slider` reserva `items * 100svh` de alto; `.phrase-item` es `sticky top-0` y se desplaza en X usando `--local` (clamp del progreso). `.phrase-item--lead` es el caso especial de la primera frase (su texto sale a la derecha y su foto a la izquierda). Todo esto se activa solo cuando existe `[data-scroll-progress]` (marcado por JS), así que sin JS se ven secciones normales.
  - **CTA home**: `.home-cta`, `--primary`, `--ghost` y sus estados hover/active/focus.
- **`about.css`**: **vacío**.
- **`admin.css`**: **vacío** (para el panel de administración).
- **`mailbox.css`**: mínimo, solo un `@layer components {}` vacío.
- **`management.css`**: **vacío**.

### `src/assets/` — recursos estáticos

- **`astro.svg`**: logo/ícono SVG por defecto del starter de Astro.
- **`background.svg`**: fondo decorativo SVG con formas orgánicas y gradientes (azul/violeta y rojo/rosa), importable como imagen de fondo.
- **`icons/index.ts`**: barril que exporta `ArrowLeft` y `ArrowRight`.
- **`icons/arrowLeft.astro`**: ícono SVG de flecha izquierda (tamaño `size-5`, usa `currentColor`).
- **`icons/arrowRight.astro`**: ícono SVG de flecha derecha.

### `src/hooks/`

- **`useFetch.ts`**: **vacío** (placeholder). Se espera un hook de React para fetch/traer datos del CMS.

### `src/types/` — tipos TypeScript

- **`index.ts`**: barril que exporta desde `intersectionObserver`.
- **`intersectionObserver.ts`**: tipos relacionados con la visibilidad:
  - `ObserveTarget`: `Element | Element[] | NodeListOf<Element>`.
  - `ObserveVisibilityOptions`: `rootMargin`, `threshold`, `once`.
  - `RevealOptions`: opciones de `initRevealOnScroll` (`targets`, `visibleClass`, `onReveal`).

### `src/utils/` — utilidades

- **`index.ts`**: barril que exporta todo lo de `selectorDOM`, `images`, `intersectionObserver` y `scroll`.
- **`selectorDOM.ts`**: atajos de consulta al DOM:
  - `$` → `document.querySelector`.
  - `$$` → `document.querySelectorAll`.
  - `getElementById` → `document.getElementById`.
- **`images.ts`**: `getImages(apiURL)` — hace `fetch(apiURL)`, devuelve el JSON; si falla, devuelve `[]`. Pensado para consumir imágenes de un CMS.
- **`intersectionObserver.ts`**: utilidades de animación al entrar al viewport:
  - `observeVisibility(targets, onVisible, options)`: observa elementos y ejecuta el callback al entrar. Con `prefers-reduced-motion` o sin soporte de `IntersectionObserver`, ejecuta de inmediato (para no dejar contenido oculto).
  - `initRevealOnScroll(options)`: para elementos `[data-reveal]`; les agrega una clase `is-in` al entrar, marca `data-js-reveal` en el HTML (para que el CSS oculte solo si hay JS) y resejecuta en `astro:page-load` (View Transitions).
- **`scroll.ts`**: `bindScrollProgress({target, property, start, end})` — escribe en una custom property de CSS (`--progress` por defecto) el progreso 0→1 de un bloque según el scroll vertical (para sliders horizontales). Usa `requestAnimationFrame`, solo escucha scroll mientras el bloque es visible, marca `data-scroll-progress` y respeta `prefers-reduced-motion`.

### `src/pages` extras y carpetas generadas (no de código)

- **`public/favicon.ico`** y **`public/favicon.svg`**: favicons que se sirven tal cual en `/`.
- **`.astro/`**: carpeta generada por Astro en dev/build (`dev.json`, `settings.json`, `types.d.ts`). No se edita a mano.

---

## Notas / pendientes encontrados

1. **`management.astro` importa `../global/hero.astro`** con ruta a un archivo en minúsculas que no existe en `src/components/global/` (el real es `Hero.astro`). Verificar extensión/caso (en Windows no falla por el caso, pero la ruta `global/` no coincide con la carpeta real `components/global/` → muy probablemente no compila). 
2. **`modal.astro`, `cms.astro`, `useFetch.ts`, `about.css`, `admin.css`, `management.css`** están vacíos (placeholders o trabajo pendiente).
3. **`MailBoxForm.tsx` simula el envío** con `setTimeout`; no envía nada a un backend.
4. **TODO en `home.ts`**: las imágenes del hero deberían venir del CMS vía `getImages()`.
5. **TODO en `BiographyVideo.astro`**: crear un componente de video reutilizable.
6. **`tmp-probe.mjs`** es un script de prueba temporal que escribe `tmp-tailwind-probe.css`.
7. **`README.md`** sigue siendo la plantilla por defecto de Astro.
8. **`SECCIÓN `Book.astro`**: el botón "Abrir libro" no tiene `onClick`/`href` — solo es visual.
9. **`BeforeAfter.astro`**: solo se muestra si `slides.length > 0`; la diapositiva "interlude" entra si hay comparaciones en el índice 1.