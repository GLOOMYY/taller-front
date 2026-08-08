import "server-only";

const API_LOCAL = "http://127.0.0.1:8000";

/** URL del backend. En producción nunca permite caer silenciosamente a localhost. */
export function getApiUrl(): string {
  const configured = process.env.API_URL?.trim();
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("API_URL no está configurada en el entorno de producción");
    }
    return API_LOCAL;
  }

  const parsed = new URL(configured);
  if (
    process.env.NODE_ENV === "production" &&
    ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)
  ) {
    throw new Error("API_URL apunta a localhost en producción");
  }
  return configured.replace(/\/$/, "");
}
