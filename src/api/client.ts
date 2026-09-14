const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

let token: string | null = null;

export function setToken(value: string | null): void {
  token = value;
}

export async function request<T>(
  path: string,
  body?: unknown,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' =
    body === undefined ? 'GET' : 'POST',
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,

      headers: {
        'Content-Type': 'application/json',

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `No se pudo conectar con ${API_URL}. Verifica que el backend esté encendido.`,
    );
  }

  const data = (await response
    .json()
    .catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const messageFromData = Array.isArray(data.message)
      ? data.message.join(', ')
      : typeof data.message === 'string'
        ? data.message
        : null;

    const message =
      messageFromData ??
      (typeof data.error === 'string'
        ? data.error
        : `Error ${response.status} al llamar ${path}`);

    throw new Error(message);
  }

  return data as T;
}