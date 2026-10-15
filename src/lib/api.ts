/**
 * Tiny typed HTTP client used by every service.
 * Server-only on purpose: it reads a private env var and is called from
 * Server Components, so secrets/tokens never reach the browser bundle.
 */

const API_BASE_URL = `http://localhost:${process.env.PORT ?? 3000}/api`;

const REQUEST_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    cache: "no-store", // dashboards want fresh numbers
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    // Auth later: headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}
