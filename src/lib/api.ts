/**
 * Tiny typed HTTP client used by every service.
 * Server-only on purpose: it reads a private env var and is called from
 * Server Components and Server Actions, so secrets/tokens never reach the browser bundle.
 */

const API_BASE_URL = `http://localhost:${process.env.PORT ?? 3000}/api`;

const REQUEST_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
    /** The JSON the API sent with the error (for example field errors), if any. */
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

async function request<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    cache: "no-store", // dashboards want fresh numbers
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      // Auth later: Authorization: `Bearer ${token}`
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => undefined);
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
      path,
      errorBody,
    );
  }

  return (await response.json()) as T;
}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiSend = <T>(method: "POST" | "PATCH" | "DELETE", path: string, body?: unknown) =>
  request<T>(path, { method, body });