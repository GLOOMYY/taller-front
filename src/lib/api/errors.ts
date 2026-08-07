export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly correlationId?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorBody = { detail?: string | { mensaje?: string }; mensaje?: string };

export function errorFromResponse(response: Response, body?: ErrorBody) {
  const detail = typeof body?.detail === "string" ? body.detail : body?.detail?.mensaje;
  const fallback = response.status === 401
    ? "Tu sesión venció. Vuelve a iniciar sesión."
    : response.status === 403
      ? "No tienes permiso para realizar esta acción."
      : response.status === 404
        ? "No encontramos el recurso solicitado."
        : "No pudimos completar la solicitud.";

  return new ApiError(
    body?.mensaje ?? detail ?? fallback,
    response.status,
    response.headers.get("x-correlation-id") ?? undefined,
    body,
  );
}
