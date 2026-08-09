/** Same-origin API via Next rewrites — cookies stick on localhost:3000 */

const DEFAULT_TIMEOUT_MS = 20_000;

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const parentSignal = init.signal;
  if (parentSignal) {
    if (parentSignal.aborted) controller.abort();
    else parentSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  try {
    const res = await fetch(path, {
      ...init,
      credentials: "include",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = (data as { detail?: { error?: string; code?: string } | string })?.detail;
      const msg =
        (typeof detail === "object" && detail?.error) ||
        (typeof detail === "string" ? detail : null) ||
        (data as { error?: string }).error ||
        res.statusText;
      const err = new Error(String(msg));
      (err as Error & { status: number; data: unknown }).status = res.status;
      (err as Error & { status: number; data: unknown }).data = data;
      throw err;
    }
    return data as T;
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      throw new Error("Zeitüberschreitung — bitte erneut versuchen");
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
