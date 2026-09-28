/**
 * Generic fetcher utility for asynchronous data requests.
 */
export async function useFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`[useFetch] Request failed with status ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
