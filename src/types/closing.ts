/** Banner de cierre con una frase y dos llamados a la acción (Sobre mí, Gestión…). */
export interface ClosingContent {
  phrase: string;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}
