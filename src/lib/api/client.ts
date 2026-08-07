import "server-only";

import { auth0, auth0Configured } from "@/lib/auth0";
import { errorFromResponse } from "./errors";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown; public?: boolean };

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Correlation-ID", crypto.randomUUID());

  if (!options.public) {
    if (!auth0Configured) throw new Error("Auth0 no está configurado");
    const { token } = await auth0.getAccessToken();
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw errorFromResponse(response, body);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) => apiFetch<T>(path, options),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
