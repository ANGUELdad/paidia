/** Same-origin API via Next rewrites — cookies stick on localhost:3000 */
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
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
}
