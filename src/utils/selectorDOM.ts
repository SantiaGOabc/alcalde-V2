export const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector);
export const $$ = <T extends Element = Element>(selector: string) => 
  document.querySelectorAll<T>(selector);
export const getElementById = <T extends Element = HTMLElement>(id: string) => document.getElementById(id) as T | null;

