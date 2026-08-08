import "server-only";

const API_LOCAL = "http://127.0.0.1:8000";
const API_PRODUCCION = "https://taller-back-izmg.onrender.com";

/** URL del backend. En producción nunca permite caer silenciosamente a localhost. */
export function getApiUrl(): string {
  const configured = process.env.API_URL?.trim();
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      // Permite que el frontend siga operativo si el proveedor omitió la variable;
      // la alternativa de producción nunca es localhost.
      return API_PRODUCCION;
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
