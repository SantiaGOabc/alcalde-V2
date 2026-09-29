/**
 * Punto de entrada único de `lib` para código de CLIENTE (islas React, scripts):
 *   import { login, saveContent } from '@/lib';
 *
 * El código de servidor (pg, sesiones, filesystem) vive en `@/lib/server`, con su
 * propio índice: no se re-exporta aquí para que el bundle del navegador nunca
 * arrastre `pg` ni `node:crypto`.
 */
export * from './api';
