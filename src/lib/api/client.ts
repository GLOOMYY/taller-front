import "server-only";

import { getAccessToken } from "@/lib/auth";
import { errorFromResponse } from "./errors";
import { getApiUrl } from "./config";

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown; public?: boolean };

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Correlation-ID", crypto.randomUUID());

  if (!options.public) {
    const token = await getAccessToken();
    if (!token) throw new Error("Sesión requerida");
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(`${getApiUrl()}${path}`, {
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
