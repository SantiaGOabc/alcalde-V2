/**
 * Id HTML de la sección editable `key` (`about.person` → `about-person`).
 * Lo usan las páginas para marcar cada bloque y el panel para llevar la vista
 * previa hasta él: una sola regla, sin ids repetidos a mano en dos sitios.
 */
export const sectionId = (key: string): string => key.replace(/\./g, '-');
