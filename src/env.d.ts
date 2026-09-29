/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Administrador con sesión válida en esta petición (lo resuelve `middleware.ts`), o `null`. */
    admin: import('@/lib/server').AdminUser | null;
  }
}
