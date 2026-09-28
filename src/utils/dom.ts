export const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
export const $$ = (selector: string) => document.querySelectorAll(selector);
export const getElementById = (id: string) => document.getElementById(id);
