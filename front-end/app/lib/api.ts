const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const base = API_URL;
  const url = `${base}${endpoint}`;

  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  } catch (err) {
    throw new Error(
      `Network error when calling API. Check NEXT_PUBLIC_API_URL. Details: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    const message = text || `API Error: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return res.json();
}
