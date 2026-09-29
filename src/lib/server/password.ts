// Solo sintaxis "borrable" (sin enums ni parameter properties): este archivo lo
// importa también scripts/db-setup.mjs, que Node ejecuta quitando los tipos.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;
const SCHEME = 'scrypt';

const derive = (password: string, salt: Buffer): Promise<Buffer> =>
  new Promise((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, (error, key) => (error ? reject(error) : resolve(key))),
  );

/** Devuelve `scrypt$<salt hex>$<hash hex>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt);
  return `${SCHEME}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== SCHEME || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, 'hex');
  const actual = await derive(password, Buffer.from(saltHex, 'hex'));

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
