const API_URL = 'http://localhost:5000/api';

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    // Handle unauthorized centrally: clear token and redirect to login
    if (res.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token');
      } catch {}
      // redirect to login so the UI stops calling protected endpoints
      window.location.href = '/auth/login';
    }

    let errorBody: unknown = null;
    try {
      errorBody = await res.json();
    } catch {
      /* ignore parse errors */
    }

    throw new Error(
      (errorBody && typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody
        ? (errorBody as { message?: string }).message
        : undefined) ||
      res.statusText ||
      'API Error'
    );
  }

  // try to parse JSON; if body is empty, return null
  try {
    return await res.json();
  } catch {
    return null;
  }
}


