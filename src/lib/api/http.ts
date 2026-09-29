export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Objeto JSON o FormData (subida de archivos). */
  body?: unknown;
}

const encodeBody = (body: unknown): Pick<RequestInit, 'body' | 'headers'> => {
  if (body === undefined) return {};
  // FormData fija su propio Content-Type (con el boundary): no se debe pisar.
  if (body instanceof FormData) return { body };
  return { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } };
};

/** Única puerta de salida HTTP del cliente: JSON in/out y errores tipados. */
export async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    ...encodeBody(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Ocurrió un error inesperado.', response.status);
  }
  return data as T;
}
